# Lumen Destiny V1 — Store Privacy Declaration Draft

Updated: 2026-08-16

Status: DRAFT. This maps the current public V1 data model into questions that must be answered in Google Play Data safety and Apple App Privacy. Final console answers must be based on the exact submitted binary plus production backend/payment configuration.

## Current V1 source-supported data handling

### Saju / compatibility input
Current privacy policy states that users may enter name or nickname, birth date, birth time, gender, and calendar type for result calculation/display. V1 does not assume long-term storage of free Saju/compatibility inputs in a member database.

Store declaration implication:
- Treat these inputs as user-provided personal information handled by the service.
- Before final submission, verify via production runtime and D1 inventory whether any request logs, analytics, support tooling, edge logs, or third-party processors retain these fields.
- Do not declare "not collected" merely because the main application database does not intentionally persist them; store definitions can include off-device transmission and processor handling.

### Guardian order / personalization
Current privacy policy states that display name, selected tier/wish category, gifting information when needed, order identifier, payment status, and issuance status may be processed for Guardian preparation/order handling.

Store declaration implication:
- Map each actually transmitted field to the closest console data category.
- Mark purposes only when supported by the production implementation (for example app functionality/order fulfilment).
- Recheck whether gift-recipient information is entered and transmitted in the submitted V1.

### Payments
Current policy states Lumen Destiny should not receive full card number, password, or security code through customer support; once live payment is enabled, payment processing is intended to occur in the selected payment provider's secure environment.

Store declaration implication:
- Payment production remains HOLD. Do not finalize finance/payment-data answers until the selected PG SDK/hosted flow and actual data path are fixed.
- Third-party payment-provider collection still needs to be evaluated under each store's definitions even if Lumen Destiny does not directly store raw card data.

### Face photos
Current V1 public scope excludes face-photo upload. Therefore the submitted V1 should not request photo/camera access for face reading and should not declare face-photo collection for functionality that is not present.

### Support/privacy requests
Privacy requests are directed to `llumendestiny@gmail.com`. Any data users send voluntarily by email must be treated according to the support process and should not be conflated with automatic in-app collection without checking store definitions.

## Google Play Data safety finalization checklist

Google requires developers to complete the Data safety form and disclose app data collection/sharing and relevant security practices.

Before entering final answers:
1. Freeze the exact production V1 build and backend environment.
2. Verify every app -> lumendestiny.com request and every third-party endpoint used by the embedded web app.
3. Review Cloudflare/edge logging and retention.
4. Review D1 tables and retention.
5. Review analytics, crash reporting, customer support, email, payment provider, and any AI provider actually enabled in V1.
6. Determine for each data type: collected, shared, ephemeral processing, purpose, required/optional, encryption in transit, deletion request support.
7. Ensure Play privacy-policy URL remains publicly accessible and matches the console answers.

## Apple App Privacy finalization checklist

Before App Store Connect privacy answers:
1. Perform the same full production data-flow inventory above.
2. Include data collected by third-party partners/code used in the app where Apple's definitions require it.
3. Distinguish data linked to the user vs not linked, and tracking vs non-tracking, based on the actual V1 implementation.
4. Do not claim tracking unless the app actually meets Apple's tracking definition; conversely do not omit third-party behavior without verification.
5. Ensure the privacy-policy URL is valid and the policy describes the submitted V1 accurately.

## Current safe conclusions

- No face-photo upload in V1 scope.
- Android/iOS native shells currently request no camera, microphone, contacts, or location permissions for V1.
- Real payment is not to be presented as live until the independent PG/KYC/payment release gates pass.
- A final "no data collected" declaration is NOT approved at this stage because web/backend transmission, infrastructure logging, Guardian processing, and future payment processor behavior must be included in the final assessment.
