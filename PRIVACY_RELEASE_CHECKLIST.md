# Lumen Destiny V1 — Privacy Release Checklist

This document is the evidence checklist behind `/api/admin/privacy-gate`.

## Release rule
Do not mark a privacy environment flag `true` until the corresponding runtime behavior has been verified in the deployed environment. The gate is intentionally fail-closed.

## 1. Privacy policy finalized — `LUMEN_PRIVACY_POLICY_FINALIZED`
- Public privacy page matches the actual V1 data flow.
- It explains what data is processed, why, retention/deletion behavior, and the support contact.
- V1 clearly states that face-reading photo upload is not part of the public release.

## 2. Face photo ephemeral — `LUMEN_FACE_PHOTO_EPHEMERAL_VERIFIED`
Face reading is excluded from V1, so this flag is **not a V1 release blocker**. It becomes mandatory before any future face-reading/photo-upload release.

Before that future feature is enabled:
- Test upload → analysis → completion/error paths.
- Confirm original face image is not written to D1, KV, R2, repository, analytics, backups, or application logs.
- Confirm failure/timeout paths also do not persist the original.
- Only mark verified after deployed runtime inspection.

## 3. Retention verified — `LUMEN_DATA_RETENTION_VERIFIED`
Create a data inventory for every V1 feature before enabling it:
- Saju/compatibility inputs: browser/runtime processing only unless a documented server feature explicitly requires storage.
- AI consultation question: do not persist by default.
- Guardian: store only fields required for order, payment, issuance, verification, gift delivery, support, fraud/accounting obligations. Do not store a free-form wish body unless a future feature explicitly requires it and the privacy policy is updated first.
- Payment: store provider/reference/status/amount fields needed for reconciliation; never store raw card credentials.
- For each stored field document purpose, location, retention period, deletion/anonymization trigger, and legal hold exception if applicable.

## 4. Deletion request flow — `LUMEN_DELETE_REQUEST_FLOW_VERIFIED`
Support channel: `llumendestiny@gmail.com`.

Minimum procedure:
1. Receive a deletion/privacy request.
2. Verify enough information to identify the relevant record without requesting unnecessary sensitive data.
3. Locate records by Guardian/order/payment reference or other minimum identifier.
4. Delete or anonymize data that is no longer required; retain only data that must legally/operationally remain, with documented reason.
5. Confirm completion to the requester without exposing internal secrets or other users' data.
6. Record only a minimal audit fact that the request was handled; do not copy the deleted sensitive content into the audit record.

Before setting the flag, run one end-to-end test request against the deployed support/operations process.

## 5. Sensitive logging — `LUMEN_SENSITIVE_LOGGING_VERIFIED`
Inspect deployed Cloudflare/Functions logs during success and forced-error tests.

Must not log:
- face image bytes/base64 or image URLs containing credentials (future face-reading feature)
- birth date/time or full consultation questions unless strictly necessary for a short-lived diagnostic session
- Guardian free-form personal messages
- authorization headers, webhook secrets, internal secrets, API keys, tokens, raw payment credentials

Errors returned to users should use stable error codes rather than echoing request bodies or secrets.

## V1 activation sequence
1. Keep the four V1 blocker flags false by default: privacy policy, retention, deletion flow, sensitive logging.
2. Face-photo verification remains optional/N/A until face reading is actually released.
3. Complete static Security Release Audit.
4. Complete deployed runtime tests above.
5. Set each V1 blocker flag true individually only after evidence exists.
6. Call authenticated `/api/admin/privacy-gate` and require `PRIVACY RELEASE READY` with zero blockers before enabling production features that depend on sensitive processing.

## Principle
Privacy readiness is an evidence gate, not a documentation checkbox. A passing CI audit does not by itself prove runtime deletion, retention, or logging behavior.