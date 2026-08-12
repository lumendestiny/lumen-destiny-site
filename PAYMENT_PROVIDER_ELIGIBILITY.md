# Guardian payment provider eligibility — 2026-08-12

## Important finding

Paddle is **not an eligible primary payment provider for Lumen Destiny / Guardian** under Paddle's current Acceptable Use Policy. Paddle explicitly lists digital services associated with pseudo-science, including horoscopes and fortune-telling, as prohibited categories. Because Lumen Destiny's core product includes Saju/fortune interpretation and Guardian is sold inside that service, we should not attempt to disguise or reclassify the business to obtain approval.

## Revised provider strategy

1. **Do not build a Paddle production adapter.** Keep the generic Lumen payment adapter architecture, but mark Paddle as rejected for this product unless Paddle changes its written policy and provides explicit approval in the future.
2. **Stripe remains a conditional candidate, not an approved provider.** Stripe's restricted-business documentation indicates psychic services / fortune tellers are restricted or prohibited in some jurisdictions and account approval is case-specific. We must obtain explicit approval for the exact business model and operating entity/country before enabling production payments.
3. **PayPal / other PSPs require the same policy-first review.** No production adapter should be activated until the provider confirms the actual product category, countries, refund model, and digital delivery flow are acceptable.
4. **Never alter product descriptions to evade provider rules.** Describe the product accurately: traditional Saju/fortune interpretation for entertainment/self-reflection, plus optional symbolic digital Guardian content that does not guarantee outcomes.

## Checkout compliance requirements

Before enabling any provider:
- Provider/account approval for the exact Lumen Destiny business model.
- Business entity, country, settlement bank and KYC completed.
- Clear product description and prices ($5/$10/$50/$100 or later approved pricing).
- No claims that Guardian guarantees exam, wealth, health, employment, relationship or other outcomes.
- Refund/cancellation terms visible before payment.
- Privacy policy and terms accessible from checkout.
- Customer support contact available.
- Verified webhook signature validation implemented provider-side.
- Server-side amount/currency/order validation remains mandatory.
- Payment success never directly issues a Guardian from the browser; only verified server events may issue.

## Engineering consequence

The existing provider-neutral flow remains correct:

Guardian order → server price validation → approved provider adapter → provider checkout → signed webhook verification → amount/currency/order validation → limited-edition slot reservation → issuance → refund/support workflow when needed.

Provider-specific code should be isolated behind adapters so a rejected or unavailable provider can be replaced without changing Guardian issuance logic.

## Next engineering work while provider approval is unresolved

- Add an explicit provider eligibility/config gate so checkout stays OFF unless a provider has been deliberately enabled.
- Keep payment result pages provider-neutral.
- Add preflight checks for Terms / Privacy / Refund URLs before production payment readiness is reported.
- Prepare sandbox adapters only after provider eligibility is confirmed.
