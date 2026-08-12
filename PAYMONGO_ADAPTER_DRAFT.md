# Lumen Destiny — PayMongo Guardian Adapter Draft
Updated: 2026-08-12
Status: APPROVAL-FIRST DRAFT — no production activation before written category approval and current API docs are verified against the approved account.

## Integration principle
PayMongo remains a candidate because the business/category must first be explicitly accepted. Do not hard-code an API version or webhook signature implementation from memory. Once the approved PayMongo account is available, pin this draft to the exact current official Checkout/Payment/Refund/Webhook documentation exposed to that account.

## Lumen checkout contract
The provider adapter will receive only:
- guardianId
- internal checkout ID/idempotency key
- server-validated amountMinor and currency
- product/tier description
- success/return/cancel URLs as supported
- minimum customer data required by PayMongo

It must return:
- provider=paymongo
- providerCheckoutId/reference
- HTTPS checkoutUrl
- expiresAt if supplied

## Webhook contract
Before normalization:
1. Verify webhook authenticity using PayMongo's current documented mechanism.
2. Parse the provider event ID and preserve it for idempotency.
3. Resolve the Lumen merchant reference/Guardian order.
4. Compare amount and currency to the server order.
5. Only then normalize into Lumen payment.succeeded / failed / cancelled / refunded / refund_failed events supported by the approved API product.

A browser success redirect must never issue a Guardian.

## Refund contract
Use the exact refund endpoint and payment reference required by the approved PayMongo product. Map the response into Lumen refund processing and wait for verified final provider status/webhook where asynchronous.

## Proposed environment names
- PAYMONGO_SECRET_KEY
- PAYMONGO_WEBHOOK_SECRET (only if this matches the provider's current approved verification mechanism)
- PAYMONGO_API_BASE (pin after official docs verification)
- LUMEN_PAYMENT_PROVIDER=paymongo

Never commit credential values.

## Approval/KYC blockers
Before coding the live adapter:
- obtain written confirmation that the disclosed free traditional fortune-style/saju content is acceptable;
- obtain written confirmation that personalized paid Guardian digital encouragement/artwork is acceptable;
- complete KYC and required business verification;
- confirm permitted currencies, customer countries, payment methods, refund capability, webhook support and any reserve/settlement restrictions;
- capture the exact official API documentation/version used for implementation.

## Sandbox acceptance
After the exact API is pinned, run the same mandatory Lumen suite: success, failure, cancellation if supported, duplicate webhook, amount/currency mismatch, expiration, last-unit race, refund success/failure, and reconciliation.

This file intentionally avoids pretending unverified endpoint/signature details are final. Provider-specific implementation begins only after current official documentation and the approved account configuration are available.