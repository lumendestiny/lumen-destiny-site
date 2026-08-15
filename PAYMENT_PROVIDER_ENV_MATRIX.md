# Lumen Destiny — Payment Provider Environment Matrix

Updated: 2026-08-15

This table is the operational source of truth for payment-related environment variables. Secrets must live only in Cloudflare/hosting secret storage and must never be committed to GitHub.

## Common production controls
| Variable | Purpose | Sandbox | Production |
|---|---|---|---|
| LUMEN_PAYMENTS_ENABLED | Payment backend / sandbox switch | true when testing | may remain true while backend is prepared |
| LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED | **Final customer checkout arm** | false | **false until every PG release gate passes; true only at live sale cutover** |
| LUMEN_GUARDIAN_ENABLED | Guardian server switch | true | true |
| LUMEN_PAYMENT_PROVIDER | Selected provider | xendit/paymongo | approved provider only |
| LUMEN_PAYMENT_TEST_MODE | Internal mock payment mode | true for internal mock only | **false before public checkout** |
| LUMEN_PAYMENT_ADAPTER_SECRET | Protects adapter calls | secret | separate production secret |
| LUMEN_PAYMENT_WEBHOOK_SECRET | Protects normalized internal webhook path | secret | separate production secret |
| LUMEN_INTERNAL_SECRET | Protects admin/refund/maintenance APIs | secret | separate production secret |
| LUMEN_PAYMENT_ADAPTER_URL | Checkout adapter URL | HTTPS | HTTPS |
| LUMEN_PAYMENT_REFUND_ADAPTER_URL | Refund adapter URL | HTTPS | HTTPS |

`LUMEN_PAYMENTS_ENABLED=true` by itself must never mean customers can pay. On the production hostname, checkout is fail-closed unless all four PG evidence flags below are true, TEST MODE is false, and `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED=true` is explicitly set.

## Approval / launch flags
These are evidence flags, not wishes. Set true only after the named event is actually confirmed.

| Variable | Set true only when |
|---|---|
| LUMEN_PG_APPROVED | PG gives written approval for Lumen Destiny business/category and Guardian product |
| LUMEN_PG_KYC_COMPLETE | KYC/business verification is approved |
| LUMEN_PG_SANDBOX_VERIFIED | Required provider sandbox suite passes |
| LUMEN_PG_PRODUCTION_READY | Live account and production credentials are activated |

Production public checkout requires **all four** evidence flags. Missing any one of them keeps checkout unavailable even if another payment switch was accidentally enabled.

## Xendit
| Variable | Purpose |
|---|---|
| LUMEN_XENDIT_ADAPTER_ENABLED | Enables Xendit adapter scaffold/runtime |
| LUMEN_XENDIT_MAPPING_VERIFIED | Confirms current official API/webhook/refund mapping was verified |
| XENDIT_API_SECRET | Xendit server API credential |
| XENDIT_WEBHOOK_SECRET | Xendit webhook verification credential/token, according to current account/docs |

Production Xendit readiness requires:
- provider selected = xendit
- adapter enabled
- mapping verified
- XENDIT_API_SECRET configured
- webhook verification configured
- global PG approval/KYC/sandbox/production flags all true
- TEST MODE false
- public checkout arm still false until the final cutover step

## PayMongo
| Variable | Purpose |
|---|---|
| LUMEN_PAYMONGO_ADAPTER_ENABLED | Enables PayMongo adapter scaffold/runtime |
| LUMEN_PAYMONGO_MAPPING_VERIFIED | Confirms current official API/webhook/refund mapping was verified |
| PAYMONGO_SECRET_KEY | PayMongo server API credential |
| PAYMONGO_WEBHOOK_SECRET | PayMongo webhook verification credential/signing secret if provided by current approved setup |

Production PayMongo readiness requires the same evidence chain as Xendit, adapted to PayMongo's current official account configuration.

## Rotation rules
- Sandbox and production secrets must be different.
- Rotate any secret exposed in logs, screenshots, chat, issue text, browser code or Git history.
- Never put provider API keys in HTML, client JavaScript, README screenshots or query strings.
- Prefer least-privilege credentials when provider supports scopes.
- Keep an internal rotation date and owner record outside the public repository.

## Cutover sequence
1. Keep `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED=false` or unset.
2. Confirm written PG approval and KYC.
3. Configure sandbox secrets.
4. Verify provider mapping against current official docs.
5. Run sandbox suite and record results.
6. Set sandbox verified flag only after PASS.
7. Obtain/activate production credentials and set production-ready evidence only after confirmation.
8. Configure production adapter/refund/webhook endpoints.
9. Turn TEST MODE off.
10. Confirm PAYMENT RELEASE READY + SECURITY RELEASE READY + provider READY + required manual experience gates.
11. Re-run production smoke and go-live gate.
12. **Only as the final arm step**, set `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED=true` and immediately run smoke/checkout verification again.

If a selected provider becomes unsupported or approval changes, disable `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED` first, then disable the affected adapter and investigate. Do not silently fail over to another provider.
