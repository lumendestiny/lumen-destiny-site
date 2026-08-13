# Guardian Payment Provider Decision — 2026-08-13

## Current decision

**Paddle is not a production candidate for Lumen Destiny / Guardian.**

Paddle's current Acceptable Use Policy prohibits digital services associated with pseudo-science, including horoscopes and fortune-telling. Lumen Destiny includes Saju / fortune-style interpretation and Guardian is sold inside that service, so we must not attempt to route the business through Paddle or describe it differently to evade review.

The provider-neutral Lumen payment architecture remains unchanged.

## Candidate order

### 1. Stripe — conditional eligibility review only

Stripe remains a possible provider only if Stripe explicitly approves the exact Lumen Destiny business model, legal entity, operating country and settlement setup. Psychic / fortune-telling services are restricted or prohibited in some jurisdictions, and Stripe account review is case-specific.

Do not enable a Stripe production adapter before written/account-level approval.

### 2. PayMongo / Xendit / other PSP — policy-first alternatives

The repository already contains provider adapter preparation for PayMongo and Xendit. These are engineering options, not approval evidence. Each provider must confirm that the actual service category, digital delivery model, refund policy and merchant country are acceptable before production activation.

### 3. PayPal or other approved provider — fallback

Any additional provider must go through the same policy, KYC, payout and webhook verification gates. Do not hard-code a provider until eligibility is confirmed.

## Business description to use consistently

Lumen Destiny provides traditional Four Pillars / fortune-style cultural, entertainment and self-reflection content. It does not guarantee future outcomes. The paid Guardian product is a personalized digital encouragement item containing a display name, wish category, message, unique issuance ID and limited-edition serial when applicable.

Never alter the description to evade a provider's restricted-business rules.

## Current Guardian prices

- Basic: USD 5
- Personal Wish: USD 10
- Rare: USD 50
- Legendary: USD 100

The server, not browser input, determines the payable amount.

## Production go-live gates

Do not enable live payments until all are true:

- Provider explicitly approves the actual Lumen Destiny / Guardian business category.
- Legal seller/entity and payout account are verified.
- KYC and settlement setup are approved.
- Terms, Privacy, Refund/Cancellation and Support pages match the selected provider relationship.
- Sandbox checkout works for USD 5, 10, 50 and 100.
- Provider webhook signature validation is implemented and verified.
- Success, failure, cancellation, expiry and refund events map to Lumen's provider-neutral state machine.
- Duplicate webhook test passes without duplicate issuance.
- Amount and currency tampering are rejected server-side.
- Final limited-edition concurrency test passes.
- Paid-but-sold-out refund path passes.
- Customer payment result page transitions pending -> issued/refund correctly.
- No API key, webhook secret, internal secret or provider credential is committed to GitHub.
- `LUMEN_PAYMENT_TEST_MODE` is false or absent in production.

## Provider-neutral architecture to preserve

Guardian order -> server price validation -> approved provider adapter -> provider checkout -> signed webhook verification -> amount/currency/order validation -> limited-edition slot reservation -> issuance -> refund/support workflow when needed.

Internal normalized events remain:

- checkout.created
- payment.succeeded
- payment.failed
- payment.cancelled
- checkout.expired
- payment.refunded
- payment.refund_failed

Provider-specific signatures and event names must be translated at the adapter boundary before reaching Guardian issuance logic.

## Next engineering step

While provider approval is unresolved:

1. Keep production checkout disabled.
2. Keep the existing mock/test adapter restricted to explicit test mode plus internal-secret protection.
3. Maintain preflight checks for public Terms / Privacy / Refund / Support pages.
4. Run provider-neutral E2E tests against the sandbox flow.
5. Once a provider is explicitly approved, implement that provider's sandbox adapter behind `LUMEN_PAYMENT_ADAPTER_URL` / `LUMEN_PAYMENT_ADAPTER_SECRET`, then run the full payment acceptance suite before enabling live payments.
