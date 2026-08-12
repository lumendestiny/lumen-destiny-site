# Lumen Destiny — Guardian PG/KYC Submission Pack

Updated: 2026-08-12

## 1. Business description
Lumen Destiny is a multilingual cultural entertainment and self-reflection service. Core fortune-style readings are offered free. Guardian is an optional paid personalized digital encouragement/keepsake product. It does not guarantee exam results, employment, wealth, health, relationships, or any other real-world outcome.

## 2. Product sold
- Personalized digital Guardian card/artwork
- Customer may enter a name, wish/encouragement message, and select an eligible design/tier
- Digital delivery only at purchase; any future physical-card promotional event is separate and subject to its own eligibility/terms
- Current planned price points: USD 5 / 10 / 50 / 100
- Limited editions may have a fixed issuance quantity

## 3. Customer journey evidence
Provide screenshots/URLs for:
1. Lumen Destiny home
2. Free reading/result page
3. Guardian catalog/product explanation
4. Guardian personalization/order page
5. Final order summary with USD price
6. Refund/cancellation policy acknowledgement
7. Payment result page
8. Guardian verification page
9. Terms, privacy, refund/cancellation, support pages
10. payment-review.html reviewer navigation page

## 4. Consumer protection statements
- Entertainment/cultural/self-reflection positioning is disclosed.
- No guaranteed outcome claims.
- Price/currency shown before checkout.
- Personalized digital-content nature shown before checkout.
- Refund/cancellation policy shown and acceptance version/time stored server-side.
- Sold-out race after successful payment routes to refund rather than over-issuance.
- Duplicate webhook handling is idempotent.
- Payment/refund exceptions are available to internal support review.

## 5. KYC/company documents to prepare
Exact requirements depend on provider and contracting country. Prepare current copies of:
- Government-issued ID of owner/authorized representative
- Business registration/incorporation document, if applicable
- Tax registration/TIN evidence, if applicable
- Registered and operating address evidence
- Bank account ownership/settlement evidence
- Beneficial-owner/director information if requested
- Domain ownership or proof of control
- Customer-support email/contact information
- Product screenshots and public policies
- Expected monthly volume, average ticket, refund estimate, customer-country mix

Do not fabricate a document or claim a registration that does not exist. Submit the legal structure actually used at onboarding.

## 6. Risk disclosure to PG
Explicitly disclose that the site contains traditional fortune-style/saju content. Ask for written confirmation that the provider accepts the business and the optional Guardian digital product. Do not relabel the business to evade restricted-business review.

Suggested classification description:
“Multilingual cultural entertainment/self-reflection website with free traditional fortune-style readings. Optional paid product is personalized digital Guardian artwork/encouragement content. No real-world result is guaranteed.”

## 7. Questions requiring written answer
- Is this business model permitted for our contracting country/account?
- Is prior elevated-risk/restricted-business approval required?
- Are personalized digital Guardian products permitted?
- Are any card brands, payment methods or customer countries excluded?
- Are USD 5–100 one-time transactions supported?
- Are reserves, delayed settlement or rolling holds expected?
- Are API/webhook checkout and API refunds supported for this account?
- What evidence is required before production activation?

## 8. Internal activation rule
Never set the production readiness flags merely because an application was submitted.
- LUMEN_PG_APPROVED=true only after written business/category approval.
- LUMEN_PG_KYC_COMPLETE=true only after provider KYC approval.
- LUMEN_PG_SANDBOX_VERIFIED=true only after required sandbox scenarios pass.
- LUMEN_PG_PRODUCTION_READY=true only after live credentials/account activation are confirmed.

Guardian production payments remain closed unless the master GO LIVE gate is READY.