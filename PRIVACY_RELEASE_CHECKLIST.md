# Lumen Destiny V1 — Privacy Release Checklist

Updated: 2026-08-15

This document is the evidence checklist behind `/api/admin/privacy-gate`.

## Release rule
Do not mark a privacy environment flag `true` until the corresponding runtime/operational behavior has been verified in the deployed environment. The gate is intentionally fail-closed.

Automated privacy evidence may reduce implementation uncertainty, but it does **not** automatically set the operational privacy flags.

## 0. Automated V1 minimization evidence — PASS

The deployed Privacy Runtime Audit now verifies KO / EN / JA / TL / VI / ZH for both free Saju and compatibility:

- 12/12 form → result journeys complete.
- Names/birth inputs do not appear in the audited network request URLs during the private handoff.
- Successful results remove the temporary private `sessionStorage` handoff.
- Successful results reduce the visible result URL back to language-only state.
- Public Guardian verification source excludes gift message, giver name, recipient name and the private verification token from its public response contract.
- Core V1 Saju/compatibility functional runtime remains PASS after the privacy handoff change.

See `V1_DATA_INVENTORY.md` for the current browser/D1 data inventory and the retention decisions that remain HOLD.

This section is engineering evidence only. Sections 1, 3, 4 and 5 below still require their own operational evidence before `/api/admin/privacy-gate` may report READY.

## 1. Privacy policy finalized — `LUMEN_PRIVACY_POLICY_FINALIZED`
- Public privacy page matches the actual V1 data flow.
- It explains what data is processed, why, retention/deletion behavior, and the support contact.
- V1 clearly states that face-reading photo upload is not part of the public release.
- Final Guardian/payment retention wording must be reconciled after the actual merchant/provider/legal obligations are confirmed.

**Current status: HOLD.** Free-reading technical behavior is now evidenced, but transaction retention/operations are not yet fully finalized.

## 2. Face photo ephemeral — `LUMEN_FACE_PHOTO_EPHEMERAL_VERIFIED`
Face reading is excluded from V1, so this flag is **not a V1 release blocker**. It becomes mandatory before any future face-reading/photo-upload release.

Before that future feature is enabled:
- Test upload → analysis → completion/error paths.
- Confirm original face image is not written to D1, KV, R2, repository, analytics, backups, or application logs.
- Confirm failure/timeout paths also do not persist the original.
- Only mark verified after deployed runtime inspection.

## 3. Retention verified — `LUMEN_DATA_RETENTION_VERIFIED`
Use `V1_DATA_INVENTORY.md` as the working inventory.

Current evidence:
- Saju/compatibility private input: browser-session handoff with successful-result cleanup and 30-minute reuse limit — automated PASS.
- Guardian/payment/checkout/policy records: D1 schemas and operational purpose documented — implementation known.
- Internal read-only privacy record map can identify which Guardian/story/payment/fulfillment record classes exist for an exact Guardian ID or payment reference without returning raw gift/shipping/token values.

Still required before setting the flag:
- Final retention period for Guardian order/issuance records.
- Deletion/anonymization trigger for gift names/messages where possible.
- Final payment-event retention period.
- Final checkout-session purge window.
- Final policy-acceptance retention period.
- Any legal-hold/accounting/provider exceptions.

**Current status: HOLD.** Do not infer legal retention periods from code.

## 4. Deletion request flow — `LUMEN_DELETE_REQUEST_FLOW_VERIFIED`
Support channel: `llumendestiny@gmail.com`.

Operational runbook: `PRIVACY_REQUEST_OPERATIONS.md`.

Current engineering support:
- `/api/admin/privacy-record-map` is protected by `LUMEN_INTERNAL_SECRET`.
- It is intentionally read-only (`mutationAvailable:false`).
- It returns record presence/counts/categories rather than raw private gift/shipping/token values.
- Production Smoke requires unauthenticated access to return `401 unauthorized`.
- Security Release Audit requires the endpoint to remain internal and rejects SQL mutation patterns in this file.

Minimum procedure:
1. Receive a deletion/privacy request.
2. Verify enough information to identify the relevant record without requesting unnecessary sensitive data.
3. Locate record classes using the protected read-only record map and the minimum Guardian/payment reference.
4. Apply the **approved** deletion/anonymization matrix only after retention/legal/provider obligations are finalized.
5. Retain only data that must legally/operationally remain, with documented reason.
6. Confirm completion to the requester without exposing internal secrets or other users' data.
7. Record only a minimal audit fact that the request was handled; do not copy the deleted sensitive content into the audit record.

There is intentionally no automatic production delete endpoint yet. Do not add one merely to clear this gate.

Before setting the flag, run one end-to-end test request against the deployed support/operations process using non-sensitive test data and the approved retention/anonymization matrix.

**Current status: HOLD** until a real test request is completed and the allowed deletion/anonymization scope is documented.

## 5. Sensitive logging — `LUMEN_SENSITIVE_LOGGING_VERIFIED`
Inspect deployed Cloudflare/Functions logs during success and forced-error tests.

Must not log:
- face image bytes/base64 or image URLs containing credentials (future face-reading feature)
- birth date/time or full consultation questions unless strictly necessary for a short-lived diagnostic session
- Guardian free-form personal messages
- authorization headers, webhook secrets, internal secrets, API keys, tokens, raw payment credentials

Errors returned to users should use stable error codes rather than echoing request bodies or secrets.

**Current status: HOLD** until deployed log evidence is reviewed. Static/code audits alone are not enough to set the flag.

## V1 activation sequence
1. Keep the four V1 blocker flags false by default: privacy policy, retention, deletion flow, sensitive logging.
2. Face-photo verification remains optional/N/A until face reading is actually released.
3. Dedicated free-reading Privacy Runtime Audit — **PASS**.
4. Protected read-only privacy record map + public-access guard — **PASS engineering support**.
5. Complete deployed log review and real deletion-request rehearsal.
6. Finalize Guardian/payment retention after merchant/provider/legal obligations are known.
7. Reconcile the public privacy policy with the final approved data inventory/retention process.
8. Set each V1 blocker flag true individually only after evidence exists.
9. Call authenticated `/api/admin/privacy-gate` and require `PRIVACY RELEASE READY` with zero blockers before enabling public paid processing that depends on those records.

## Principle
Privacy readiness is an evidence gate, not a documentation checkbox. The automated free-reading privacy PASS and protected record-map tooling are meaningful implementation evidence, but they must not be misrepresented as proof of transaction retention, deletion operations or deployed log hygiene.
