# Lumen Destiny — Payment Provider Adapter Template

Updated: 2026-08-12

Purpose: connect an approved PG without coupling Guardian business logic to one provider.

## A. Checkout adapter contract
The Lumen server sends only server-validated order data to the provider adapter:
- guardianId
- amountMinor
- currency
- product/tier label
- return/success URL
- cancel URL
- idempotency key / internal checkout ID
- minimal customer fields actually required by the approved PG

Adapter response expected by Lumen:
- ok
- provider
- providerCheckoutId
- checkoutUrl (HTTPS)
- expiresAt when supported

Rules:
- Never trust price supplied by browser.
- Never place provider secret keys in public JS/HTML.
- Use HTTPS only.
- Use provider idempotency capability where available.
- Store provider identifiers, not raw card data.

## B. Webhook normalization contract
Provider-specific webhook must be verified using the provider's documented signature scheme before normalization.

Normalize to Lumen events such as:
- payment.succeeded
- payment.failed
- payment.cancelled
- checkout.expired
- payment.refunded
- payment.refund_failed

Normalized fields:
- eventId
- type
- provider
- guardianId / merchant reference
- providerPaymentId
- providerCheckoutId when available
- amountMinor
- currency
- occurredAt

Rules:
- Reject invalid signatures.
- Preserve raw provider event ID for idempotency.
- Verify amount/currency against server order before issuance.
- Do not issue Guardian from browser redirect alone.

## C. Refund adapter contract
Lumen sends:
- refundJobId
- guardianId
- providerPaymentId/reference
- amountMinor
- currency
- reason
- idempotency key

Expected response:
- accepted
- providerRefundId
- status (processing/completed where provider supports synchronous completion)
- provider error code/message on failure

Final refund state should prefer verified provider webhook/status, not browser state.

## D. Provider onboarding checklist
For each approved provider create a provider-specific note containing:
1. Contracting entity/country
2. Written category approval reference/date
3. KYC approval date
4. Sandbox account identifier (non-secret)
5. API base URL
6. Checkout endpoint mapping
7. Webhook signature algorithm/header
8. Refund endpoint mapping
9. Supported currencies/payment methods
10. Settlement currency/bank
11. Known restricted countries/methods
12. Production activation evidence

Never commit secret keys, webhook signing secrets, private certificates or full KYC identity documents to GitHub.

## E. Sandbox acceptance suite
Run at minimum:
- successful payment and one Guardian issuance
- failed payment and no issuance
- cancelled checkout and no issuance
- duplicate webhook and no duplicate issuance
- wrong amount rejection
- wrong currency rejection
- expired checkout
- last-unit concurrency / sold-out refund path
- refund accepted
- refund completion webhook/status
- refund failure/support-review path

Only after the required suite passes should `LUMEN_PG_SANDBOX_VERIFIED=true` be set.

## F. Production cutover
Before live credentials are enabled:
- PAYMENT RELEASE READY
- SECURITY RELEASE READY
- written PG approval
- KYC complete
- Sandbox verified
- production credentials active
- TEST MODE false
- live webhook endpoint registered
- live refund path configured
- support/refund policy publicly reachable

Then and only then allow the master `GUARDIAN GO LIVE READY` gate to become READY.