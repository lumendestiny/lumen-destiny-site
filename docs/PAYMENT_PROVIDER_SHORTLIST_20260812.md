# Lumen Destiny payment provider shortlist — 2026-08-12

## Decision rule
Paid Guardian must remain disabled until the selected payment provider gives explicit written approval for the actual Lumen Destiny business model. We will not disguise, relabel, or misrepresent fortune-telling/Saju content to bypass provider policy.

Actual product description for review:
- Free traditional Saju/Four Pillars interpretations and compatibility content.
- Paid personalized digital Guardian artwork / encouragement content.
- Guardian does not guarantee luck, wealth, health, exam success, promotion, relationships, or supernatural outcomes.
- No gambling, investment promises, medical claims, or guaranteed-result testimonials.

## Current provider ranking

### 1. PayMongo — first approval request for a Philippine entity
Status: PRIORITY FOR WRITTEN PRE-APPROVAL

Why it remains viable:
- PayMongo operates in the Philippines and supports local merchant onboarding.
- Its restricted-business policy lists psychic services under businesses that may pose elevated risk rather than an unconditional prohibition.
- Restricted businesses may be eligible only after assessment and prior written approval.
- Digital goods also have partner-specific restrictions, so Guardian must be disclosed in full.

Required before integration:
1. Send exact business description and website URL.
2. Ask whether Saju/Four Pillars interpretation plus personalized digital Guardian artwork is acceptable.
3. Ask whether cards, GCash/Maya and international cards can be enabled for this category.
4. Ask whether USD-presentment is supported for the approved account, or whether checkout must use PHP.
5. Get written confirmation before production payments are enabled.

### 2. Xendit Philippines — policy clarification / pre-approval request
Status: SECONDARY CANDIDATE, NEEDS WRITTEN CLASSIFICATION

Why it is worth checking:
- Xendit supports Philippine business onboarding and multiple local payment channels.
- It maintains prohibited and high-risk industry classifications and performs enhanced due diligence for high-risk industries.
- Public policy text available to us does not clearly expose a searchable fortune-telling/psychic classification, so no assumption of eligibility should be made.

Required before integration:
1. Send the same full Lumen Destiny description.
2. Ask for a written classification: prohibited / high-risk / permitted.
3. Ask whether digital personalized artwork tied to a fortune-content site is treated as the same merchant category as psychic/fortune services.
4. Ask whether international cards and cross-border customers are permitted.
5. Confirm refund, webhook and dispute support for the approved payment methods.

### 3. Stripe — only with explicit approval for the merchant jurisdiction
Status: CONDITIONAL

Risk:
- Stripe lists psychic services / fortune tellers as restricted or jurisdiction-specific prohibited in several countries.
- Stripe states restricted businesses require additional due diligence and explicit approval may be necessary.
- Eligibility therefore depends on the merchant entity jurisdiction and Stripe's account review.

Required before integration:
1. Determine the exact merchant entity country first.
2. Submit the real business model to Stripe before production activation.
3. Obtain explicit approval if the business is classified as restricted.
4. Do not use Japan Konbini for this product; Stripe specifically prohibits fortune-telling and superstition-based content for Konbini.

### 4. PayPal / Braintree — not a primary candidate
Status: AVOID AS PRIMARY PROCESSOR

Reason:
- PayPal/Braintree acceptable-use material explicitly lists fortune tellers or psychic/fortune-teller services among restricted/prohibited categories in relevant payment products.
- PayPal alternative-payment terms also reference fortune-teller services and expensive amulets/lucky charms as disallowed or problematic categories.

Do not integrate unless PayPal provides clear written approval for the exact merchant account, product and countries involved.

### Paddle
Status: REMOVED FROM SHORTLIST

Reason:
- Paddle's current prohibited-business guidance excludes fortune-telling / horoscope / pseudoscience-related offerings. It should not be pursued for Lumen Destiny.

## Integration architecture remains unchanged
The provider-independent flow stays:

Guardian order
→ server-side price validation
→ provider adapter checkout
→ provider-native webhook verification
→ Lumen normalized payment event
→ edition-slot allocation
→ Guardian issuance
→ payment-result / verification
→ refund adapter when required

A provider decision only changes the adapter layer. Core Guardian issuance rules must not depend on the processor.

## Approval package to prepare
Before contacting any provider, prepare:
- Legal merchant/entity name and incorporation country.
- Website URL and screenshots of free Saju result, Guardian product, checkout disclosure, Terms, Privacy and Refund pages.
- Exact Guardian prices: USD 5 / 10 / 50 / 100, subject to provider-approved presentment currency.
- Plain-language description of personalization and digital delivery.
- Statement that Guardian is symbolic/entertainment/encouragement content and does not guarantee outcomes.
- Refund policy for duplicate charge, technical non-delivery and paid-but-sold-out cases.
- Estimated monthly volume and average ticket.
- Expected customer countries.
- Explanation of success stories: factual, customer-consented, and never presented as causal proof.

## Production gate
`LUMEN_PAYMENTS_ENABLED` must stay false until all of the following are true:
- Provider eligibility approved in writing.
- Merchant KYC approved.
- Settlement account approved.
- Sandbox checkout and webhook tests pass.
- Refund path passes.
- Wrong amount/currency tests reject correctly.
- Duplicate webhook is idempotent.
- Final edition slot concurrency test passes.
- Terms/refund text matches provider rules.

## Recommended next move
Contact PayMongo first and Xendit second with the same transparent approval package. Stripe becomes the parallel fallback once the merchant entity jurisdiction is final. Do not spend integration time on a provider before written category approval.