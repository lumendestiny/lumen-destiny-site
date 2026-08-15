# Lumen Destiny — Payment KYC & Sandbox Readiness

Updated: 2026-08-15

This document is the payment-provider approval and sandbox gate. It must remain HOLD until external/provider evidence exists.

Use `PAYMENT_PROVIDER_APPLICATION_PACKET.md` for the consistent reviewer-facing business description, product table, delivery/refund answers and public URLs.

## 1. Merchant / KYC documents

Prepare before applying to Stripe, PayMongo, Xendit, PayPal or another provider that is willing to review the actual service category.

- Legal merchant / business name
- Country of registration and operating address
- Business registration certificate or equivalent
- Tax registration / tax ID where applicable
- Government-issued ID of owner / authorized representative
- Proof of address if requested
- Settlement bank account in the merchant's legal name where required
- Beneficial-owner information where required
- Support email and customer-service contact
- Website domain and live product pages

Do not upload IDs, bank proof, tax documents or provider credentials to this public GitHub repository.

Do not submit documents or descriptions that imply a different business category from the actual service.

## 2. Service-review package

Reviewer-facing URLs should include:

- Home page
- Free Four Pillars / fortune-style interpretation page
- Guardian product/archive page
- Guardian order page
- Guardian verification page
- Payment review page: `/payment-review.html`
- Terms: `/terms.html`
- Privacy policy: `/privacy.html`
- Refund/cancellation policy: `/refund-policy.html`
- Customer support: `/support.html`

Business description must remain consistent:

> Lumen Destiny provides traditional Four Pillars / fortune-style cultural, entertainment, and self-reflection content. It does not guarantee future outcomes. The paid Guardian product is a personalized digital encouragement item containing a display name, wish category, message, unique issuance ID, and limited-edition serial when applicable.

Use the longer copy/paste answers in `PAYMENT_PROVIDER_APPLICATION_PACKET.md` when the provider requests more detail.

## 3. Product / pricing evidence

Current planned Guardian tiers:

- Guardian Basic — USD 5 — 100 per design
- Personal Wish — USD 10 — 100 per design
- Rare Edition — USD 50 — 5 per design
- Legendary Motion — USD 100 — 1 per design

The server, not browser input, determines the final payable amount.

## 4. Customer-protection evidence

Before payment, demonstrate:

1. Personalized-digital-content disclosure.
2. No guarantee of exam, wealth, career, health, relationship, or other real-world outcomes.
3. Refund / cancellation policy link.
4. Terms link.
5. Explicit policy checkbox.
6. Final order summary showing product, amount, currency, Guardian order ID, and refund summary.
7. Server-side `policyVersion`, `policyAcceptedAt`, and `policyLang` record.
8. Fulfillment only after verified server-side payment event.

Current engineering-side payment-flow safety is already fail-closed; this does not count as provider approval.

## 5. Provider eligibility evidence — REQUIRED BEFORE ADAPTER GO-LIVE

Retain provider evidence outside GitHub showing:

- The provider reviewed the actual Lumen Destiny / Guardian category.
- The provider did not require a misleading reclassification of the service.
- The legal merchant/entity is accepted.
- Registration/settlement country and payout setup are accepted.
- KYC/business verification is approved or explicitly in a provider-authorized test stage.

Engineering support for a provider is not approval evidence.

## 6. Sandbox acceptance tests

Run all tests against the provider-approved sandbox/test environment before switching to live processing.

### Normal purchase

- Create Guardian order.
- Accept policy.
- Create checkout.
- Confirm checkout amount equals DB price.
- Simulate/provider-complete success.
- Verify webhook is processed exactly once.
- Verify `payment_status=paid`.
- Verify `issuance_status=issued`.
- Verify edition serial exists and is within the limit.
- Verify public Guardian verification page returns issued state.

Run the normal purchase path at USD 5, 10, 50 and 100 where the provider sandbox permits.

### Duplicate event

- Send/replay the same payment event twice.
- Confirm no duplicate issuance and no second edition slot.

### Amount mismatch

- Send a success event with a different amount or use a provider-supported tamper test.
- Confirm issuance is rejected.

### Currency mismatch

- Send a non-USD success event or equivalent provider test.
- Confirm issuance is rejected.

### Cancelled / failed checkout

- Simulate cancelled payment.
- Simulate failed payment.
- Confirm Guardian is not issued.

### Checkout expiry

- Expire an open checkout.
- Run maintenance where applicable.
- Confirm session becomes `expired`.

### Final limited slot race

- Prepare two orders for the final remaining serial in a safe sandbox/test collection.
- Complete them near-simultaneously.
- Confirm only one is issued.
- Confirm the other becomes `sold_out_pending_refund` and creates a refund job.

### Refund

- Submit refund job through the approved sandbox adapter.
- Simulate/receive provider refunded event.
- Confirm order and refund job become completed/refunded.

### Webhook authenticity

- Send a correctly signed provider event and confirm acceptance.
- Send an invalid/unsigned event and confirm rejection.
- Confirm replay/duplicate handling remains idempotent.

## 7. Production credential / settlement gate

Before any public charge is possible, verify:

- Provider has explicitly approved the actual business category.
- KYC is approved.
- Live settlement/payout account is confirmed.
- Production account is activated.
- Production API credentials exist only in secure environment/secret storage.
- Production webhook signature / secret validation is configured.
- Refund API/mapping is configured for the approved account.
- No provider secret exists in browser JS or GitHub.

## 8. Go-live gate

Do not enable live payments until all are true:

- Provider has explicitly approved the actual business category.
- KYC is approved.
- Live settlement account is confirmed.
- Webhook signature / secret validation is configured.
- Sandbox normal, duplicate, mismatch, failure, sold-out, webhook-authenticity and refund tests pass.
- Refund and support pages are public.
- Admin operations dashboard can identify support-review and refund-attention orders.
- Real iOS/Android physical-device release check is PASS.
- `LUMEN_PAYMENT_TEST_MODE` is false or absent in production.
- Final production smoke/release audits pass after provider configuration.
- `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED=true` is applied only as the final deliberate arm step.

## 9. Test-mode safety rule

The built-in Lumen mock payment adapter is for development only. It must require `LUMEN_PAYMENT_TEST_MODE=true`, and test completion endpoints must additionally require `LUMEN_INTERNAL_SECRET`. Never expose production webhook or adapter secrets in browser code.

Physical UX testing does not require live payment. Do not enable public checkout merely to test layout or Guardian preview behavior.

## 10. Evidence record

Keep the following outside public GitHub:

- Provider application/ticket ID.
- Provider approval correspondence or dashboard evidence.
- KYC approval date/status.
- Settlement/payout approval date/status.
- Sandbox account/project identifier (non-secret reference only).
- Sandbox test execution results/screenshots.
- Production activation confirmation.
- Final cutover date/time and operator.

The release status must stay HOLD if any of the required external evidence is missing.
