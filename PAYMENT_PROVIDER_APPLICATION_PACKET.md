# Lumen Destiny — Payment Provider Application Packet

Updated: 2026-08-15

Purpose: provide one consistent, truthful application package for any payment provider that is willing to review the actual Lumen Destiny / LUMEN GUARDIAN business model.

Do not change the service category or wording to evade a provider's restricted-business rules. Provider approval must apply to the real product.

## 1. Merchant identity — fill before submission

- Legal merchant / entity name: `[REQUIRED]`
- Country of registration: `[REQUIRED]`
- Business registration number: `[REQUIRED IF APPLICABLE]`
- Tax ID / tax registration: `[REQUIRED IF APPLICABLE]`
- Registered / operating address: `[REQUIRED]`
- Authorized representative: `[REQUIRED]`
- Settlement bank account holder: `[REQUIRED]`
- Settlement bank country/currency: `[REQUIRED]`
- Customer support email: `llumendestiny@gmail.com`
- Website: `https://lumendestiny.com`

Do not submit until the legal seller name and settlement account relationship are clear.

## 2. Short business description — copy/paste version

Lumen Destiny provides traditional Four Pillars (Saju) / fortune-style cultural, entertainment and self-reflection content. The service does not guarantee future events or specific real-world outcomes. Free users can receive Saju and compatibility-style interpretations. The paid LUMEN GUARDIAN product is a personalized digital encouragement item containing a display name, wish category, optional message, unique issuance ID and limited-edition serial when applicable.

## 3. Expanded reviewer description

Lumen Destiny is a digital cultural/entertainment service based on traditional Four Pillars (Saju) concepts. Customers may use free interpretation tools for self-reflection and entertainment. The service does not promise or guarantee exam results, employment, promotion, wealth, health, relationships, or any other future outcome.

The paid product, LUMEN GUARDIAN, is a personalized digital encouragement/collectible item. A customer selects a Guardian tier and a wish category, enters a display name and wish/message, reviews the personalized digital item and applicable policies, and then proceeds to payment only when live payment is enabled through an approved provider. After the provider confirms a valid payment server-side, Lumen issues a unique digital Guardian ID and a limited-edition serial where applicable.

Lumen does not issue a paid Guardian merely because the browser reports payment success. Payment amount, currency, order state and provider event are validated server-side before digital fulfillment.

## 4. Product and price table

| Product | Price | Digital availability | Description |
|---|---:|---:|---|
| Guardian Basic | USD 5 | 100 per design | Personalized digital Guardian encouragement item |
| Personal Wish | USD 10 | 100 per design | Expanded personalized wish/message digital Guardian |
| Rare Edition | USD 50 | 5 per design | Limited digital Guardian edition |
| Legendary Motion | USD 100 | 1 per design | One-of-one animated/motion digital Guardian edition |

Prices are determined server-side. Browser/client input cannot set the charge amount.

## 5. Delivery / fulfillment answer

Suggested answer if the provider asks how goods are delivered:

> Products are delivered digitally. After the payment provider sends a verified successful payment event and the server validates the amount, currency and order, the system issues the customer's personalized LUMEN GUARDIAN digital item and unique issuance/edition information. There is no physical shipping.

## 6. When the customer is charged

Suggested answer:

> The customer first reviews the Guardian configuration, digital-content disclosure, refund/cancellation policy and Terms of Use. A policy acknowledgment is required before the payment-ready step. A live charge is initiated only through the approved provider checkout after the order amount is confirmed server-side.

## 7. Recurring billing

Current V1 answer:

> No. LUMEN GUARDIAN V1 purchases are one-time digital purchases. There is no automatic subscription/recurring Guardian charge in the current V1 payment flow.

Do not state this if a future subscription is added without updating the application and customer policies.

## 8. Refund / cancellation explanation

Suggested reviewer answer:

> Lumen publishes a Refund & Cancellation Policy before payment. Because Guardian is personalized digital content, refund/cancellation eligibility depends on payment and fulfillment state and the published policy. Failed, cancelled or expired payments do not result in issuance. If a payment succeeds but a limited edition cannot be fulfilled because the final slot is no longer available, the system routes the order to a refund workflow rather than issuing beyond the edition limit.

Do not promise a refund rule that differs from the current public policy page.

## 9. Customer protection controls

Reviewer evidence available in the product flow:

- Clear statement that Saju/Guardian content does not guarantee real-world outcomes.
- Personalized digital-content disclosure.
- Public Terms of Use.
- Public Privacy Policy.
- Public Refund & Cancellation Policy.
- Public Support page and support email.
- Explicit policy checkbox before checkout-ready flow.
- Final order/product/amount/currency review.
- Server-side price control.
- Server-side payment confirmation before issuance.
- Duplicate payment-event protection.
- Amount/currency mismatch rejection.
- Limited-edition inventory enforcement.
- Refund workflow for paid-but-unfulfillable limited-edition orders.

## 10. Reviewer-facing URLs

Use the production domain and include these pages in the application/review ticket:

- Home: `https://lumendestiny.com/`
- Guardian archive: `https://lumendestiny.com/guardian/`
- Guardian order preparation: `https://lumendestiny.com/guardian-order/`
- Guardian verification: `https://lumendestiny.com/guardian-verify/`
- Payment review: `https://lumendestiny.com/payment-review.html`
- Terms: `https://lumendestiny.com/terms.html`
- Privacy: `https://lumendestiny.com/privacy.html`
- Refund / cancellation: `https://lumendestiny.com/refund-policy.html`
- Support: `https://lumendestiny.com/support.html`

The public site supports KO / EN / JA / TL / VI / ZH. If the reviewer requests English, select EN and provide screenshots from that state.

## 11. Suggested answers to common provider questions

### What do you sell?

> Personalized digital cultural/entertainment encouragement items (LUMEN GUARDIAN) and free traditional Four Pillars / Saju-style self-reflection content.

### Is the product physical?

> No. Paid Guardian products are digitally delivered.

### Do you guarantee outcomes?

> No. The service expressly states that it does not guarantee future events or outcomes such as exam success, employment, wealth, health or relationships.

### How do customers contact you?

> Through the public Support page and `llumendestiny@gmail.com`.

### How quickly is the paid product delivered?

> Digital issuance occurs after the server receives and verifies the provider's successful payment event and validates the order. If a payment cannot be safely matched/fulfilled, issuance is withheld and the support/refund path is used as appropriate.

### Do you store card data?

> Lumen's intended provider architecture sends payment collection through the approved payment provider. Lumen should not collect or store raw card numbers/CVC in its application. Confirm the selected provider integration before submitting a final compliance answer.

### What prevents duplicate digital issuance?

> Provider events are processed idempotently. Duplicate payment events must not create a second Guardian issuance or consume a second limited-edition slot.

## 12. Supporting documents to attach when requested

Prepare clean, readable copies of:

- Business registration certificate / equivalent.
- Tax registration where applicable.
- Government-issued ID of the authorized representative.
- Proof of address if required.
- Settlement bank proof/account ownership evidence if required.
- Beneficial-owner information if required.
- Website screenshots showing product, prices, Terms, Privacy, Refund and Support.
- Screenshot of the no-guaranteed-outcome disclosure.
- Screenshot of Guardian checkout policy acknowledgment.

Never place IDs, bank documents, tax numbers, API keys, secrets or KYC documents in this public GitHub repository.

## 13. Pre-submission internal checklist

Before clicking Submit on a provider application:

- [ ] Legal merchant identity is filled accurately.
- [ ] Provider supports the merchant's registration/settlement country.
- [ ] Business description matches the real site.
- [ ] Provider has not explicitly prohibited the actual service category.
- [ ] Prices shown in the application match the production site.
- [ ] Terms / Privacy / Refund / Support pages are live.
- [ ] Support email is correct.
- [ ] Live real payment is still disabled during review unless the provider specifically requires a controlled production verification step.
- [ ] No application screenshot contains internal/admin secrets.

## 14. Approval evidence to retain outside GitHub

Keep copies of:

- Provider application/ticket ID.
- Written or dashboard evidence that the actual business category is approved.
- KYC approval result.
- Settlement/payout approval.
- Sandbox/live account identifiers (non-secret references only in project notes if needed).
- Date of approval and reviewer/support correspondence.

Do not commit secret credentials or identity/KYC documents to GitHub.

## 15. After conditional approval

The next order is:

1. Configure provider sandbox credentials outside GitHub.
2. Implement/enable the approved provider adapter.
3. Run the full `PAYMENT_KYC_SANDBOX_CHECKLIST.md` acceptance suite.
4. Verify signed webhook and refund mapping.
5. Obtain/confirm production credentials and settlement activation.
6. Ensure test mode is off in production.
7. Re-run release/smoke/payment audits.
8. Enable `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED=true` only as the final deliberate arm step.
