# Lumen Destiny — Payment Provider Selection Switch

Updated: 2026-08-12

## Goal
Keep Guardian payment logic provider-neutral. Only one approved production provider should be active at a time unless a later multi-provider design is explicitly introduced.

## Provider selector
Use `LUMEN_PAYMENT_PROVIDER` as the canonical provider name.

Allowed planned values:
- `xendit`
- `paymongo`
- future approved provider identifiers

Provider-specific adapter flags are separate kill switches:
- `LUMEN_XENDIT_ADAPTER_ENABLED`
- `LUMEN_PAYMONGO_ADAPTER_ENABLED`

A provider-specific adapter must remain disabled until the corresponding account has written category approval and completed KYC.

## Production activation conditions
Provider routing is allowed only when all are true:
1. `LUMEN_PAYMENTS_ENABLED=true`
2. `LUMEN_GUARDIAN_ENABLED=true`
3. `LUMEN_PG_APPROVED=true`
4. `LUMEN_PG_KYC_COMPLETE=true`
5. `LUMEN_PG_SANDBOX_VERIFIED=true`
6. `LUMEN_PG_PRODUCTION_READY=true`
7. `LUMEN_PAYMENT_TEST_MODE=false`
8. provider-specific adapter enabled
9. required provider secret configured in Cloudflare Secret storage
10. checkout/refund/webhook mappings verified against current provider docs

## Safety behavior
If the selected provider does not match an enabled adapter, checkout must fail closed rather than fall back silently.

Examples:
- `LUMEN_PAYMENT_PROVIDER=xendit` + Xendit adapter disabled => HOLD / no checkout
- `LUMEN_PAYMENT_PROVIDER=paymongo` + PayMongo adapter disabled => HOLD / no checkout
- unknown provider value => HOLD / no checkout

Never route to a different provider simply because the configured provider is unavailable. The customer should receive a controlled payment-unavailable response instead.

## Operational note
Provider selection is configuration, not business approval. Changing `LUMEN_PAYMENT_PROVIDER` must not automatically change PG approval/KYC flags. Those flags represent evidence, not preference.

## Go-live rule
The master Guardian GO LIVE gate must include provider match + provider-specific adapter readiness before production payments are opened.