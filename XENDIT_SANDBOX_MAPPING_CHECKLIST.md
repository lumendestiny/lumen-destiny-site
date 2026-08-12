# Lumen Destiny — Xendit Sandbox Mapping Checklist

Updated: 2026-08-12

Use this only after written category approval and KYC are confirmed for the account actually used by Lumen Destiny.

## 1. Account and approval evidence
- Record approved legal entity / contracting country.
- Record written approval reference and date for traditional fortune-style content plus optional Guardian digital product.
- Confirm sandbox account is linked to the approved business profile.
- Never enable production because a sandbox account merely exists.

## 2. Checkout / Payment Session mapping
Verify current official Xendit documentation and approved account capabilities before coding.

Map Lumen fields:
- guardianId -> provider reference / metadata field
- internal checkoutId -> idempotency / external reference field
- amountMinor -> Xendit amount representation
- currency -> USD when approved
- product type -> digital product/service classification where supported
- returnUrl -> success/return URL
- cancelUrl -> cancel/failure return URL
- customer fields -> only minimum fields required by Xendit

Acceptance checks:
- Server-side price only
- HTTPS URLs only
- Provider session ID stored
- Hosted checkout URL must be HTTPS
- Duplicate checkout request uses provider idempotency where available

## 3. Webhook verification mapping
Before enabling any event handler, document the current official:
- webhook endpoint setup process
- signature/token/header verification method
- replay/idempotency guidance
- event payload schema
- payment status values
- refund status values

Normalize verified events to Lumen:
- payment.succeeded
- payment.failed
- payment.cancelled
- checkout.expired
- payment.refunded
- payment.refund_failed

Required fields after normalization:
- eventId
- guardianId / merchant reference
- providerPaymentId
- providerCheckoutId if present
- amountMinor
- currency
- occurredAt

No Guardian issuance from browser redirect alone.

## 4. Refund mapping
Confirm current refund endpoint and permissions for the approved account.

Map:
- refundJobId -> idempotency/reference
- providerPaymentId -> payment to refund
- amountMinor + currency
- reason

Store:
- providerRefundId
- accepted/processing/completed status
- provider error code/message

Prefer final verified provider status/webhook for completion.

## 5. Required sandbox scenarios
Run and record PASS/FAIL for:
1. Successful USD checkout
2. Successful webhook -> exactly one Guardian issuance
3. Failed payment -> no issuance
4. Cancelled checkout -> no issuance
5. Duplicate webhook -> no duplicate issuance
6. Wrong amount -> rejected
7. Wrong currency -> rejected
8. Expired checkout
9. Last-unit race -> one issuance, other order refund path
10. Refund accepted
11. Refund completion confirmation
12. Refund failure -> support review

## 6. Environment variables
General:
- LUMEN_PAYMENT_PROVIDER=xendit
- LUMEN_XENDIT_ADAPTER_ENABLED=true only after approval/KYC
- LUMEN_XENDIT_MAPPING_VERIFIED=true only after code mapping is checked against current official docs and sandbox
- LUMEN_PG_APPROVED=true only after written approval
- LUMEN_PG_KYC_COMPLETE=true only after KYC approval
- LUMEN_PG_SANDBOX_VERIFIED=true only after all required sandbox scenarios pass
- LUMEN_PG_PRODUCTION_READY=true only when live account/credentials are activated
- LUMEN_PAYMENT_TEST_MODE=false before production

Secrets (Cloudflare secret/env only, never GitHub):
- XENDIT_API_SECRET
- XENDIT_WEBHOOK_SECRET or current provider verification credential as documented
- LUMEN_PAYMENT_ADAPTER_SECRET
- LUMEN_PAYMENT_WEBHOOK_SECRET
- LUMEN_INTERNAL_SECRET

## 7. Mapping completion record
Before setting `LUMEN_XENDIT_MAPPING_VERIFIED=true`, record internally:
- official docs revision/access date
- checkout endpoint used
- auth method
- idempotency method
- webhook verification method
- payment event names/statuses
- refund endpoint
- refund event/status mapping
- sandbox test date
- engineer/operator who verified mapping

## 8. Production cutover
Do not enable live Xendit traffic until:
- PAYMENT RELEASE READY
- SECURITY RELEASE READY
- Xendit provider check READY
- written business approval
- KYC complete
- sandbox suite PASS
- production credentials active
- live webhook registered and verified
- refund path configured
- TEST MODE is off

If any item is uncertain, remain HOLD.