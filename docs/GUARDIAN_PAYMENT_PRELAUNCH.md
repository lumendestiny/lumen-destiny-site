# Guardian payment pre-launch contract

This document defines the provider-agnostic boundary before connecting Stripe, Toss, PayPal, Paddle or another payment provider.

## Required payment flow

1. Create Guardian order on Lumen server first.
2. Server decides tier, USD amount and Guardian order ID. Client never decides the final payable amount.
3. Payment provider checkout stores the Guardian order ID in provider metadata/reference.
4. Browser redirect after payment is informational only. It must never mark an order as paid.
5. Only a server-to-server verified payment event may change payment_status to paid and issuance_status to issued.
6. Webhook adapter converts the provider event into the internal contract below.
7. Internal webhook validates Guardian ID, currency and amount against D1 before issuance.
8. Every accepted/ignored/rejected event is written to guardian_payment_events for audit and idempotency.

## Internal webhook contract

POST /api/payments/webhook

Headers:
- Content-Type: application/json
- x-lumen-webhook-secret: server-only adapter secret

Body:
- eventId: unique provider event ID
- provider: provider name
- event: payment.succeeded or other normalized event name
- guardianId: Lumen Guardian order ID
- paymentReference: provider payment/transaction ID
- amount: exact USD amount charged
- currency: USD

The public payment provider must not call this internal endpoint using a shared static secret unless the provider supports that model securely. Normally a provider-specific endpoint verifies the provider's native signature first, then calls this normalized internal handler or shares its processing module.

## Provider adapter requirements

Before enabling real payments, implement a provider-specific adapter that:
- verifies provider webhook signatures using the provider's official method;
- rejects replayed or stale requests where the provider supports timestamps;
- extracts provider event ID, payment ID, amount, currency and Guardian order ID;
- accepts only final successful payment states;
- never trusts price, tier or issuance state from the browser;
- supports duplicate webhook delivery safely;
- handles refund/cancellation events separately before refund UI is enabled.

## Required Cloudflare bindings/secrets

- GUARDIAN_DB (D1 binding)
- LUMEN_GUARDIAN_ENABLED=true
- LUMEN_PAYMENTS_ENABLED=true only after sandbox tests pass
- LUMEN_PAYMENT_WEBHOOK_SECRET (secret; internal adapter boundary only)
- provider-specific webhook/API secrets as Cloudflare secrets, never GitHub files

## Sandbox acceptance tests

- Correct $5 Basic payment issues exactly once.
- Correct $10 Personal Wish payment issues exactly once.
- $50 Rare and $100 Legendary amounts are validated server-side.
- Wrong amount is rejected and does not issue.
- Wrong currency is rejected and does not issue.
- Unknown Guardian ID is rejected.
- Duplicate eventId is idempotent.
- Browser success URL alone cannot issue.
- Invalid webhook signature never reaches internal success processing.
- Provider timeout/retry causes no duplicate Guardian.
- Payment event audit row exists for processed/rejected/ignored events.

## Do not enable production payments until

Provider account, legal merchant name, settlement account, refund policy, customer support contact, tax/VAT handling, privacy notice, terms, sandbox tests and webhook monitoring are all confirmed.
