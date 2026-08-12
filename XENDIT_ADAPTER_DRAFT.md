# Lumen Destiny — Xendit Guardian Adapter Draft
Updated: 2026-08-12
Status: DRAFT ONLY — do not activate before written category approval/KYC.

## Why this maps well
Use Xendit Payment Sessions hosted checkout. Guardian merchant reference should be the immutable Lumen checkout/order reference. Xendit currently documents Session currencies including PHP and USD and item types including DIGITAL_PRODUCT / DIGITAL_SERVICE.

## Checkout mapping
POST /sessions using server-side Xendit credentials.
Suggested fields:
- reference_id: Lumen checkout ID
- session_type: PAY
- mode: PAYMENT_LINK
- amount: server-validated amount
- currency: approved settlement/charge currency
- country: PH when the approved account/integration requires PH
- locale: mapped from Lumen language where supported
- description: Personalized Lumen Guardian digital encouragement content
- success_return_url: Lumen guardian-payment-result page
- cancel_return_url: Lumen guardian-payment-result page with cancellation state
- items[0].reference_id: Guardian order ID
- items[0].type: DIGITAL_PRODUCT (confirm classification with Xendit during approval)
- metadata: Guardian/order reconciliation IDs only; no unnecessary sensitive fortune/profile data

Store payment_session_id, payment_link_url, expiry, and later payment_request_id/payment_id references.

## Payment webhook mapping
Verify the Xendit callback token/signature exactly as required for the enabled Payments/Session product before accepting an event. Never rely on the browser return URL.

Normalize:
- payment.capture + successful status -> payment.succeeded
- payment.failure -> payment.failed
- payment_session.expired / payment expiry as applicable -> checkout.expired
- refund.succeeded -> payment.refunded
- refund.failed -> payment.refund_failed

For payment success, compare Xendit amount/currency/reference with the Lumen server order before issuance. Preserve Xendit event/provider IDs for idempotency.

## Refund mapping
POST /refunds with:
- reference_id: Lumen refund job ID
- payment_request_id: stored Xendit payment request ID
- currency and amount: server refund job values
- reason: map sold-out/system exception to an approved Xendit reason, likely OTHERS or CANCELLATION depending on provider guidance

Treat the create-refund response as accepted/pending unless Xendit explicitly confirms final state. Finalize from verified refund webhook/status.

## Required secrets / config (names proposed)
- XENDIT_SECRET_KEY
- XENDIT_WEBHOOK_TOKEN (or exact verification secret required by activated product)
- XENDIT_API_BASE=https://api.xendit.co
- LUMEN_PAYMENT_PROVIDER=xendit

Never commit values to GitHub.

## Sandbox acceptance
Run Lumen mandatory E2E suite plus Xendit-specific reconciliation:
- Session creation and HTTPS payment_link_url
- success return does not itself issue Guardian
- verified payment webhook issues once
- duplicate webhook remains idempotent
- amount/currency mismatch blocks issuance
- expired session closes checkout
- refund request obtains provider refund ID
- refund success/failure webhook updates Lumen
- last-unit race sends loser to refund path

## Activation blocker
Do not activate this adapter until Xendit has provided written acceptance of Lumen Destiny's disclosed traditional fortune-style content and Guardian product, and account KYC/product access is complete.