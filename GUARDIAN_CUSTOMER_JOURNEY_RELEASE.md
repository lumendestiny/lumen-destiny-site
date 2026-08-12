# Lumen Guardian — Customer Journey Release Checklist

Updated: 2026-08-12

Goal: verify the entire customer experience before production payments are enabled.

## 1. Discover
- Home navigation exposes Guardian clearly without implying it is required for free readings.
- Guardian archive explains symbolic/entertainment positioning and no guaranteed outcome.
- Prices and limited quantities are visible before entering checkout.
- Gift and story/physical-card event routes are understandable.

## 2. Select
- Basic $5 / Personal Wish $10 / Rare $50 / Legendary $100 selection maps to the correct server-side product.
- Wish category survives navigation into order form.
- Sold-out editions cannot proceed as purchasable inventory.
- Limited quantity shown to the user is never treated as authoritative inventory; server remains authoritative.

## 3. Personalize
- Required name/nickname and wish fields validate.
- Gift mode clearly separates giver and recipient.
- Target date/campaign is optional unless the campaign requires it.
- Character limits work on mobile and all five languages.
- User can edit before payment.

## 4. Review before payment
- Product/tier and USD amount are shown again immediately before checkout.
- Product is described as personalized digital content.
- Refund/cancellation policy and terms are reachable before payment.
- Explicit policy checkbox is required.
- No guarantee of exam, job, wealth, health, relationship, or other real-world result.
- Server revalidates price, currency, inventory, policy version and order state.

## 5. Checkout
- Browser receives only a provider-hosted HTTPS checkout URL.
- Provider secrets never reach browser code.
- Refresh/back/double-click does not create duplicate issuance.
- Browser redirect alone never marks payment successful or issues Guardian.

## 6. Payment result
### Success
- Verified provider webhook matches merchant reference, amount and currency.
- Guardian issues once only.
- Customer receives a clear issued/pending result rather than a blank screen.
- Unique Guardian ID and edition number are visible when issuance completes.

### Failure / cancellation / expiry
- No Guardian issuance.
- Customer receives a localized explanation and a safe retry/back route.
- Existing personalization is preserved where practical.

### Paid but sold out race
- No over-issuance.
- Refund job is created and customer receives a clear refund-status explanation.

## 7. Verify and keep
- QR/verification URL resolves to a public verification page.
- Verification exposes only appropriate public issuance metadata.
- Verification does not expose private wish/message/contact/KYC/payment data.
- Invalid Guardian ID has a clear not-found state.

## 8. Gift
- Recipient-facing experience does not expose payer secrets or unnecessary personal data.
- Shared link works on mobile and common messengers.
- Gift copy is localized.
- A recipient can understand who sent it only when the purchaser intentionally provided that information.

## 9. Good-news / physical-card event
- Submission explicitly states that a positive outcome does not prove Guardian caused the outcome.
- Evidence collection is minimized and has retention/deletion rules.
- Public posting requires separate consent.
- Physical-card selection is an event benefit, not a guaranteed purchase entitlement unless terms explicitly say otherwise.
- Exam/certification D-100 campaigns link to the same transparent event terms.

## 10. Support and refund
- Guardian ID is the primary support reference.
- Customer can find support, terms, privacy and refund policy from the relevant journey pages.
- Duplicate charge, system error, sold-out-after-payment and refund-failure paths are documented for support.
- Refund completion is based on verified provider state.

## Production sign-off
Do not mark the customer journey verified until the journey has been run on 320/360/390/430px mobile widths and desktop in all five supported languages, including success, failure, cancellation, duplicate webhook, sold-out race and refund scenarios.

Recommended production flag after evidence is retained internally:
`LUMEN_GUARDIAN_JOURNEY_VERIFIED=true`
