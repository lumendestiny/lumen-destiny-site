# Guardian Payment Provider Decision — 2026-08-12

## Goal
Choose the first payment provider for Lumen Guardian without changing the internal order/issuance architecture. The provider must support one-time digital products, server-verified checkout, webhooks, refunds, USD/global buyers, and later localization.

## Current Guardian prices
- Basic: USD 5
- Personal Wish: USD 10
- Rare: USD 50
- Legendary: USD 100

Because the two entry products are low-priced, fixed per-transaction fees matter materially.

## Candidate A — Paddle (recommended for eligibility review first)
Strengths:
- Merchant of Record model: Paddle handles payment collection plus sales-tax/VAT calculation/remittance and related buyer billing support.
- Explicit support for one-time digital products and transaction-completed webhooks.
- Global/localized checkout and many payment methods/currencies.
- Sandbox is available.
- Public pay-as-you-go pricing is 5% + USD 0.50 per Checkout transaction; Paddle says sellers with products under USD 10 should contact them for custom pricing.

Important fit check before integration:
- Guardian is a symbolic personalized digital encouragement product, not software/SaaS. Paddle's published positioning includes digital products, but account/product approval must be confirmed before we treat it as selected.
- USD 5 Guardian is especially sensitive to the USD 0.50 fixed fee; request sub-USD-10 pricing during onboarding.
- Confirm that personalized generated digital artwork/content is accepted under Paddle's current acceptable-use/product review.

Recommended use if approved:
1. Paddle becomes merchant of record for web Guardian sales.
2. Lumen server creates/validates the Guardian order first.
3. Paddle transaction metadata carries guardian_id / edition_key only; never send private wish text unless operationally required and approved.
4. Fulfillment occurs only after verified transaction.completed webhook.
5. Refund webhook maps into the existing Lumen refund state machine.

## Candidate B — Stripe (strong fallback / direct PSP)
Strengths:
- Excellent Checkout/API/webhook/refund ecosystem.
- Stripe has a Philippines services agreement for eligible businesses located in the Philippines, and supports Korean local payment methods for eligible Stripe businesses.
- More direct control over payment UX and processor relationship.

Trade-offs:
- Lumen remains responsible for the merchant-side tax/compliance stack rather than receiving a full Merchant-of-Record bundle.
- Stripe performs business/category/KYC review; eligibility depends on the legal entity, business country, website and product category.
- A Stripe account in a different country generally requires a legal entity, tax ID, physical location, phone and physical bank account in that supported country.

Recommended use if Paddle does not approve Guardian or if direct PSP economics/control are materially better.

## Candidate C — PayPal Checkout (secondary/fallback method)
Strengths:
- Broad buyer recognition and useful as an alternate wallet/payment route.
- Refund/dispute infrastructure and international commercial payments.

Trade-offs:
- Fee schedules vary by merchant market and international status, so do not hard-code the US fee table for a Korea/Philippines merchant.
- Not our preferred single-provider architecture for the first release because Lumen would still own more tax/compliance complexity than with a Merchant of Record.

## Decision
**First eligibility/onboarding target: Paddle.**

Reason: Lumen Guardian is intended for international web sales and starts as a small team. Offloading indirect-tax collection/remittance, payment compliance, fraud/chargeback handling and buyer billing support has high operational value. The existing Lumen Payment Adapter means we can switch providers without rewriting Guardian issuance.

**Fallback: Stripe**, if Paddle does not approve the product/business or sub-USD-10 economics are unattractive.

**Optional later:** add PayPal/local methods through the selected provider or as a secondary adapter when justified by conversion data.

## Do not enable live payments until these gates pass
- Provider account and Guardian product/category approved.
- Legal seller/entity and payout account verified.
- Public terms, privacy, refund/cancellation wording updated to match the selected provider/MoR relationship.
- Sandbox checkout works for USD 5, 10, 50, 100.
- Verified webhook maps success/failure/cancel/refund to Lumen states.
- Duplicate webhook test passes.
- Amount/currency tampering test is rejected.
- Last-edition concurrency test passes.
- paid-but-sold-out refund path passes.
- Customer payment result page transitions pending -> issued/refund correctly.
- No API key, webhook secret, internal secret, or provider credential is committed to GitHub.

## Provider adapter mapping to preserve
Lumen internal events should remain provider-neutral:
- checkout.created
- payment.succeeded
- payment.failed
- payment.cancelled
- checkout.expired
- payment.refunded
- payment.refund_failed

Provider-specific signatures and event names must be verified and translated at the adapter boundary before reaching Guardian issuance logic.

## Next implementation step after approval
Create a provider-specific Sandbox adapter (Paddle first if approved) behind the existing LUMEN_PAYMENT_ADAPTER_URL / secret boundary. Do not replace the Guardian order, limited-edition slot, refund-job, or admin-operation state machines.