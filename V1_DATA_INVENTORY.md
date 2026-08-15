# Lumen Destiny V1 — Data Inventory

Updated: 2026-08-15

Purpose: document the V1 data flow from the current code so privacy/retention decisions can be verified against implementation instead of relying on assumptions.

This document **does not set legal retention periods**. Where a period depends on the merchant jurisdiction, payment provider, tax/accounting obligations or an approved operating process, it remains explicitly HOLD/TBD until that evidence exists.

## V1 scope covered

Public V1:
- Free Saju / Four Pillars
- Fortune result pages
- Compatibility
- LUMEN GUARDIAN archive, personalization, gifting, verification and payment-ready flow

Excluded from V1:
- Face reading / face-photo upload
- 1:1 AI consultation

No excluded feature should collect production user data merely because old/future code exists in the repository.

## 1. Free Saju input

### Fields
- Display/input name
- Gender selection
- Birth year/month/day
- Birth time when supplied
- Calendar type
- Leap-month selection when applicable
- Language preference needed for the journey

### Current V1 processing design
- The form is calculated client-side using the existing Saju calculation modules.
- The private handoff stores the input temporarily in browser `sessionStorage` under `lumen-private-saju-v1`.
- The initial result-page network navigation contains language only; the private fields are not intentionally sent in that navigation URL.
- The result bridge reconstructs the legacy calculation query only inside browser history state so the existing calculation module can read it without a second network request.
- Result pages use `referrer=no-referrer` while the compatibility layer exists.
- After a successful result is produced, the private session entry is removed and the visible result URL is reduced back to the language parameter.
- An unfinished saved handoff is accepted by the bridge only while it is younger than 30 minutes; browser-session lifetime remains an additional boundary.

### Purpose
Generate and display the requested Saju result.

### Server database
No Saju birth/name record is intentionally written to the Guardian D1 order/payment tables by this flow.

### Retention rule for V1 implementation
- Successful calculation: remove the temporary private session handoff immediately after result generation.
- Unfinished calculation: do not reuse a saved handoff after the 30-minute application window.
- Closing the browser session removes normal `sessionStorage` state according to browser behavior.

### Evidence status
- Core functional journey: automated PASS.
- Dedicated no-network-URL / cleanup privacy runtime audit: RETESTING after canonical-route audit correction.

## 2. Compatibility input

### Fields
For each of the two people:
- Display/input name
- Gender selection
- Birth date
- Birth time when supplied
- Calendar type
- Leap-month selection when applicable
- Language preference for the journey

### Current V1 processing design
- Temporary browser `sessionStorage` key: `lumen-private-compat-v1`.
- Initial result-page network navigation carries language only.
- Legacy query reconstruction occurs through browser history state for the existing calculation module rather than by issuing a new request containing the private fields.
- After a successful compatibility result, the temporary session record is removed and the visible URL is reduced to language only.
- The bridge ignores saved handoffs older than 30 minutes.

### Purpose
Generate and display the requested compatibility result.

### Server database
No compatibility names/birth data are intentionally written to Guardian order/payment D1 tables by this flow.

### Retention rule for V1 implementation
Same temporary-session rule as free Saju: successful result cleanup immediately; unfinished handoff not reused after the 30-minute application window.

### Evidence status
Dedicated privacy runtime audit already completed all six compatibility language journeys successfully in its first diagnostic run; the combined 12-journey audit is being re-run after correcting the Saju canonical-route matcher.

## 3. Language preference

### Field
- `lumen-lang`

### Location
Browser local storage / language query state.

### Purpose
Keep the user-selected KO / EN / JA / TL / VI / ZH interface language consistent across pages.

### Sensitivity
Not treated as a sensitive birth/order field by itself.

### Retention
May persist as a browser preference until the user/browser clears site storage or the application changes the preference.

## 4. Guardian order record

The D1 `guardian_orders` schema currently includes core order/issuance data such as:
- Guardian ID
- Tier
- Server-controlled USD price
- Edition limit
- Display name
- Wish category/type
- Payment status
- Issuance status
- Payment reference
- Verification token
- Created/paid/issued timestamps
- Payment provider / payment event reference where added by later migrations

Gift migrations additionally add:
- Gift flag
- Giver name
- Recipient name
- Gift message
- Campaign ID
- Target date

Policy-acceptance migrations additionally add:
- Policy version
- Policy accepted timestamp
- Policy language

### Purpose
- Create and fulfill the requested personalized digital Guardian.
- Enforce edition limits and unique issuance.
- Support gifting.
- Reconcile payment and issuance state.
- Record the policy version accepted before checkout.
- Support customer service, dispute/refund handling and verification.

### Storage
Cloudflare D1 production binding when Guardian ordering is enabled.

### Public exposure rule
The public Guardian verification endpoint must expose only the intended verification subset. It must not return gift message, giver/recipient private fields or the private verification token itself.

### Retention
**HOLD / TBD before paid launch.** Final periods and deletion/anonymization triggers must be aligned with:
- legal merchant jurisdiction,
- accounting/tax requirements,
- approved payment-provider requirements,
- fraud/chargeback/refund windows,
- customer-support needs,
- limited-edition integrity requirements.

Do not invent a short deletion period that would prevent reconciliation, and do not retain personal gift fields indefinitely merely because transaction records must be retained.

A final retention matrix should distinguish transaction evidence from fields that can be anonymized earlier.

## 5. Guardian payment event audit

The D1 `guardian_payment_events` table includes:
- provider event ID
- provider
- normalized event type
- Guardian ID
- payment reference
- amount
- currency
- status
- received/processed timestamps
- stable error code

### Purpose
- Idempotent webhook processing.
- Prevent duplicate issuance.
- Reconcile provider payment events.
- Diagnose payment/refund state without storing raw card credentials.

### Raw card data
The Lumen application is not designed to store raw card number/CVC. Payment collection must remain with an approved provider.

### Retention
**HOLD / TBD before paid launch** based on provider, accounting, dispute and fraud obligations.

## 6. Guardian checkout session

The D1 `guardian_checkout_sessions` table includes:
- checkout ID
- Guardian ID
- provider
- amount/currency
- checkout status
- provider session ID
- provider checkout URL
- created/updated/expiry timestamps
- policy version / accepted timestamp from later migration

### Purpose
Connect a server-priced Guardian order to one provider checkout attempt and track its lifecycle safely.

### Access rule
Provider session identifiers and checkout URLs are operational data and must not be exposed through unrelated public verification APIs or logs.

### Retention
**HOLD / TBD before paid launch.** Expired/cancelled checkout-session retention can likely be shorter than legally required transaction records, but the exact policy must be finalized after the provider relationship is known.

## 7. Guardian public verification

### Intended public fields
The current verification handler is designed to return an issuance-verification subset such as:
- Guardian ID
- tier / price / edition information
- display name
- wish category/type
- payment/issuance status
- created/issued timestamps

### Explicitly private / not public verification output
- gift message
- giver name
- recipient name
- verification token itself
- payment secrets
- provider credentials

Public verification behavior is part of the dedicated privacy runtime/static audit.

## 8. Policy acceptance evidence

### Fields
- policy version
- accepted timestamp
- policy language

### Purpose
Show which published terms/refund framing the customer acknowledged before checkout.

### Retention
Should normally follow the associated transaction/dispute evidence period. **Final period remains TBD until legal/provider review.**

## 9. Face-reading data

Face reading and face-photo upload are excluded from V1.

V1 production rule:
- Do not expose the upload flow.
- Do not collect a face photo for V1.
- `LUMEN_FACE_PHOTO_EPHEMERAL_VERIFIED` is not a V1 launch blocker while the feature remains disabled.

Before any future face-reading release, the original-photo non-retention design must be separately implemented and verified across success, error and timeout paths.

## 10. 1:1 AI consultation data

1:1 AI consultation is excluded from V1.

V1 production rule:
- Do not expose the public consultation route.
- Do not treat an existing AI/API key as permission to process consultation data.
- Future consultation retention and model/provider disclosure must be reviewed before any later release.

## 11. Data not allowed in public GitHub

Never commit:
- IDs/KYC documents
- bank proof or account statements
- tax documents containing private identifiers
- payment-provider API keys
- webhook secrets
- Cloudflare secrets
- internal admin secret
- customer exports
- raw production order/payment data

## 12. Remaining retention/privacy HOLD decisions

Before setting `LUMEN_DATA_RETENTION_VERIFIED=true`, record approved answers for:

| Data class | Current location | Current technical cleanup | Final retention decision |
|---|---|---|---|
| Saju private input | Browser session only | Successful-result cleanup; 30-minute handoff reuse limit | Technical rule documented; runtime audit required |
| Compatibility private input | Browser session only | Successful-result cleanup; 30-minute handoff reuse limit | Technical rule documented; runtime audit required |
| Language preference | Browser local storage | User/browser clear or preference change | Accept as UX preference or revise |
| Guardian order/issuance | D1 | No final automatic retention policy yet | HOLD |
| Gift personal fields/message | D1 | No final automatic retention/anonymization policy yet | HOLD; assess earlier anonymization |
| Payment event audit | D1 | Operational record | HOLD; provider/legal/accounting decision |
| Checkout sessions | D1 | Status/expiry lifecycle exists | HOLD; define purge window |
| Policy acceptance | D1 | Associated with order/checkout | HOLD; align with transaction evidence |

## 13. Next evidence steps

1. Complete the dedicated V1 Privacy Runtime Audit and require PASS.
2. Review deployed Cloudflare/Functions logs during successful and forced-error paths before setting `LUMEN_SENSITIVE_LOGGING_VERIFIED=true`.
3. Select/approve the legal merchant + payment-provider relationship.
4. Finalize Guardian/payment retention periods and anonymization triggers.
5. Run one end-to-end privacy/deletion request through the real support/operations process.
6. Only then set the corresponding privacy environment flags and require authenticated `/api/admin/privacy-gate` to report `PRIVACY RELEASE READY`.

## Principle

Free-reading data minimization can be automated and evidenced now. Transaction retention cannot be responsibly finalized until the actual merchant/provider/legal obligations are known. Keep those two facts separate rather than marking the entire privacy gate PASS prematurely.
