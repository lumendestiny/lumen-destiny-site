# Lumen Destiny — Payment Provider Environment Matrix

Updated: 2026-08-12

This table is the operational source of truth for payment-related environment variables. Secrets must live only in Cloudflare/hosting secret storage and must never be committed to GitHub.

## Common production controls
| Variable | Purpose | Sandbox | Production |
|---|---|---|---|
| LUMEN_PAYMENTS_ENABLED | Global payment switch | true when testing | true only at live launch |
| LUMEN_GUARDIAN_ENABLED | Guardian server switch | true | true |
| LUMEN_PAYMENT_PROVIDER | Selected provider | xendit/paymongo | approved provider only |
| LUMEN_PAYMENT_TEST_MODE | Internal mock payment mode | true for internal mock only | **false** |
| LUMEN_PAYMENT_ADAPTER_SECRET | Protects adapter calls | secret | separate production secret |
| LUMEN_PAYMENT_WEBHOOK_SECRET | Protects normalized internal webhook path | secret | separate production secret |
| LUMEN_INTERNAL_SECRET | Protects admin/refund/maintenance APIs | secret | separate production secret |
| LUMEN_PAYMENT_ADAPTER_URL | Checkout adapter URL | HTTPS | HTTPS |
| LUMEN_PAYMENT_REFUND_ADAPTER_URL | Refund adapter URL | HTTPS | HTTPS |

## Approval / launch flags
These are evidence flags, not wishes. Set true only after the named event is actually confirmed.

| Variable | Set true only when |
|---|---|
| LUMEN_PG_APPROVED | PG gives written approval for Lumen Destiny business/category and Guardian product |
| LUMEN_PG_KYC_COMPLETE | KYC/business verification is approved |
| LUMEN_PG_SANDBOX_VERIFIED | Required provider sandbox suite passes |
| LUMEN_PG_PRODUCTION_READY | Live account and production credentials are activated |

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
1. Confirm written PG approval and KYC.
2. Configure sandbox secrets.
3. Verify provider mapping against current official docs.
4. Run sandbox suite and record results.
5. Set sandbox verified flag only after PASS.
6. Obtain/activate production credentials.
7. Configure production adapter/refund/webhook endpoints.
8. Turn TEST MODE off.
9. Confirm PAYMENT RELEASE READY + SECURITY RELEASE READY + provider READY.
10. Only then allow GUARDIAN GO LIVE READY.

If a selected provider becomes unsupported or approval changes, disable its adapter first, then investigate. Do not silently fail over to another provider.