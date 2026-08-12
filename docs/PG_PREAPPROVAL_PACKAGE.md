# Lumen Destiny payment-provider pre-approval package

Last updated: 2026-08-12

## 1. Business summary

Lumen Destiny is a multilingual digital service that offers traditional Four Pillars (Saju) interpretation, compatibility reading, and reflective AI explanations. Core readings are intended as cultural, entertainment, and self-reflection content and do not guarantee future outcomes.

The paid product is Lumen Guardian, a personalized digital encouragement item. A Guardian may include the purchaser's chosen name/nickname, a wish category, a short encouragement message, a unique issuance number, issuance date, rarity/edition information, and a verification link/QR.

Guardian is not represented as causing or guaranteeing exam success, employment, promotion, wealth, health improvement, romantic outcomes, or any other specific result.

## 2. Product catalog

Planned digital Guardian tiers:

- Guardian Basic: USD 5, limited to 100 units per design/edition.
- Personal Wish: USD 10, limited to 100 units per design/edition.
- Rare Edition: USD 50, limited to 5 units per design/edition.
- Legendary Motion: USD 100, limited to 1 unit per design/edition.

Each limited edition uses a server-controlled edition key and issuance slot. The buyer cannot change the server price or issuance limit from the browser.

## 3. Fulfillment

The product is delivered digitally after server-side payment confirmation. The browser redirect alone never marks an order as paid or issued.

Flow:

1. Customer configures a Guardian.
2. Server creates an order with the authoritative product tier and USD price.
3. Payment checkout is created by the payment provider or approved adapter.
4. A verified payment-provider webhook confirms payment.
5. The server validates order ID, amount, currency, and payment event.
6. A limited-edition issuance slot is allocated.
7. The Guardian receives its unique issuance ID and serial number.
8. Customer can verify the issuance through a public verification page/QR.

## 4. Refund and payment-exception controls

Lumen Destiny is designed to avoid false fulfillment claims and duplicate charges.

- Duplicate payment events are processed idempotently.
- Wrong amount or currency is rejected.
- If a limited edition sells out after payment but before issuance, the order is marked `sold_out_pending_refund` and a refund job is created.
- Refund state is tracked separately from issuance state.
- Failed refund attempts are moved to internal support review.
- Expired checkout sessions are cleaned up and cannot be treated as paid orders.
- Customers are instructed not to make a second payment while a transaction is still being verified.

Provider-native refund APIs/webhooks will be used when the selected payment provider supports them.

## 5. Customer claims and marketing policy

Lumen Destiny does not market Guardian as a product that changes destiny, guarantees luck, or causes a measurable result.

Public wording should consistently describe Guardian as one or more of the following:

- symbolic digital encouragement content;
- personalized digital keepsake;
- cultural/entertainment content;
- a way to send support before an important goal or event.

The service must not publish claims such as "this Guardian guarantees passing the exam," "brings guaranteed wealth," or equivalent claims.

Customer testimonials may only be shown with consent and should be framed as the customer's own experience. Testimonials must not be presented as proof that Guardian caused the result.

## 6. Success-story and physical-card promotion

Customers may optionally submit a positive-life-event story after purchasing Guardian. Public display requires separate consent and internal approval.

Where offered, selected customers may receive a physical commemorative Guardian card as a promotional gift. Physical-card selection is not guaranteed by purchase and does not alter the nature of the original paid product, which is digital.

Shipping information is requested only after a customer has been selected for the physical-card promotion.

## 7. Data handling

The service aims to minimize personal-data retention.

- Saju/compatibility input is processed for the requested result and is not intended for unrelated reuse.
- Guardian orders store only information necessary for issuance, verification, payment reconciliation, and support.
- Public verification must not expose private wish text, full shipping information, or payment credentials.
- Payment card data is not collected or stored by Lumen Destiny; it is handled by the payment provider.
- Internal secrets, payment secrets, and API keys are stored only in protected server-side environment variables.

## 8. Business category disclosure

For underwriting and compliance review, Lumen Destiny should be disclosed accurately as a digital entertainment/cultural self-reflection service that includes traditional Saju/fortune-style interpretations and personalized symbolic Guardian digital content.

We are seeking written confirmation that this category and the described digital Guardian product are acceptable under the provider's policies before enabling live payments.

We will not rename or disguise the service category to bypass restricted-business rules.

## 9. Countries and customers

The product is designed for international customers and currently supports Korean, English, Japanese, Tagalog, and Vietnamese interfaces.

Initial customer demand may include South Korea, the Philippines, Vietnam, Japan, and English-speaking international users. Availability will be limited to jurisdictions and payment methods approved by the selected provider.

## 10. Payment requirements

Preferred capabilities:

- international card payments;
- USD pricing and settlement support or transparent FX handling;
- hosted checkout or secure tokenized checkout;
- verified webhooks;
- refund API and refund-status webhooks;
- dispute/chargeback notifications;
- clear restricted-business approval process;
- sandbox/test environment;
- provider identifiers that can be reconciled with our internal Guardian order ID.

## 11. Questions for underwriting/compliance

Please provide written confirmation on the following:

1. Is a traditional Saju/fortune-style interpretation service permitted under your policy if it is clearly marketed as cultural/entertainment/self-reflection content with no guaranteed outcomes?
2. Is the personalized digital Guardian product described above permitted?
3. Does this business require elevated-risk or restricted-business approval?
4. Are there countries, card networks, wallets, or local payment methods that must not be used for this category?
5. Are one-time digital products priced at USD 5, 10, 50, and 100 acceptable?
6. Are any additional disclosures required on the checkout page or website?
7. Are there reserve, rolling-reserve, delayed-settlement, or volume limits expected for this category?
8. What documents are required for onboarding and beneficial-owner/KYC review?
9. Can refunds be initiated through API and confirmed through webhooks?
10. Can the provider confirm approval in writing before live transactions are enabled?

## 12. Documents/screenshots to prepare for provider review

Before submitting an application, prepare:

- homepage screenshot;
- free Saju input and result screenshots;
- Guardian catalog screenshot showing prices and limits;
- Guardian order preview screenshot;
- payment-result pending/issued/refund-state screenshots;
- Guardian public verification screenshot;
- Terms of Service;
- Privacy Policy;
- Refund/Cancellation Policy;
- Customer Support page/contact;
- business registration documents for the applying legal entity;
- beneficial-owner/director identity documents requested by the provider;
- settlement-bank information;
- expected monthly transaction count and volume estimate.

## 13. Internal approval gate

Do not enable `LUMEN_PAYMENTS_ENABLED=true` in production until all of the following are true:

- provider has given written or dashboard-confirmed category approval;
- merchant/KYC review is complete;
- sandbox checkout succeeds;
- provider-native webhook signature verification is implemented;
- wrong amount/currency tests are rejected;
- duplicate webhook test is idempotent;
- refund test succeeds;
- sold-out-after-payment refund path is tested;
- terms, privacy, refund disclosure, and support contact are visible;
- the production settlement account is verified.
