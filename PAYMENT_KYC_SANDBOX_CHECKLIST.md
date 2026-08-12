# Lumen Destiny — Payment KYC & Sandbox Readiness

Updated: 2026-08-12

## 1. Merchant / KYC documents

Prepare before applying to PayMongo, Xendit, Stripe, or another approved provider.

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

Do not submit documents that imply a different business category from the actual service.

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

## 5. Sandbox acceptance tests

Run all tests before switching to a live provider.

### Normal purchase

- Create Guardian order.
- Accept policy.
- Create checkout.
- Confirm checkout amount equals DB price.
- Simulate provider success.
- Verify webhook is processed exactly once.
- Verify `payment_status=paid`.
- Verify `issuance_status=issued`.
- Verify edition serial exists and is within the limit.
- Verify public Guardian verification page returns issued state.

### Duplicate event

- Send the same payment event twice.
- Confirm no duplicate issuance and no second edition slot.

### Amount mismatch

- Send a success event with a different amount.
- Confirm issuance is rejected.

### Currency mismatch

- Send a non-USD success event.
- Confirm issuance is rejected.

### Cancelled / failed checkout

- Simulate cancelled payment.
- Simulate failed payment.
- Confirm Guardian is not issued.

### Checkout expiry

- Expire an open checkout.
- Run maintenance.
- Confirm session becomes `expired`.

### Final limited slot race

- Prepare two orders for the final remaining serial.
- Complete them near-simultaneously.
- Confirm only one is issued.
- Confirm the other becomes `sold_out_pending_refund` and creates a refund job.

### Refund

- Submit refund job to test adapter.
- Simulate provider refunded event.
- Confirm order and refund job become completed/refunded.

## 6. Go-live gate

Do not enable live payments until all are true:

- Provider has explicitly approved the actual business category.
- KYC is approved.
- Live settlement account is confirmed.
- Webhook signature / secret validation is configured.
- Sandbox normal, duplicate, mismatch, failure, sold-out, and refund tests pass.
- Refund and support pages are public.
- Admin operations dashboard can identify support-review and refund-attention orders.
- `LUMEN_PAYMENT_TEST_MODE` is false or absent in production.

## 7. Test-mode safety rule

The built-in Lumen mock payment adapter is for development only. It must require `LUMEN_PAYMENT_TEST_MODE=true`, and test completion endpoints must additionally require `LUMEN_INTERNAL_SECRET`. Never expose production webhook or adapter secrets in browser code.