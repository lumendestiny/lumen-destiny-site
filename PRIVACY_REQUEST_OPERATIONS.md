# Lumen Destiny V1 — Privacy Request Operations

Updated: 2026-08-15

Purpose: give the operator a safe, repeatable way to identify which Lumen records are associated with a Guardian/payment reference **without exposing raw private values and without authorizing deletion before the retention matrix is approved**.

## Current safety posture

- Support intake: `llumendestiny@gmail.com`
- Internal lookup endpoint: `/api/admin/privacy-record-map`
- The endpoint requires `LUMEN_INTERNAL_SECRET` through the `x-lumen-internal-secret` header.
- The endpoint is read-only.
- It returns record presence, counts, lifecycle timestamps/states and privacy categories; it does not return gift message text, giver/recipient names, shipping contact values or the verification token.
- `mutationAvailable` must remain `false` until an explicit retention/anonymization policy and controlled mutation procedure are approved.

Do not place the internal secret, customer exports, KYC documents, raw order data or screenshots containing private values in GitHub issues, commits, public chat or public support tickets.

## 1. Intake

When a privacy/deletion request arrives:

1. Record the request date and a minimal request ID in the private operations log.
2. Ask only for the minimum reference needed to locate records.
3. Prefer a Guardian ID from the customer's receipt/verification page.
4. If no Guardian ID is available, an exact payment reference may be used by an authorized operator.
5. Do not request birth information merely to find a Guardian/payment record.

Free Saju/compatibility inputs are designed as temporary browser-session data and are not intentionally written to the Guardian D1 transaction tables.

## 2. Identity / authority check

Before any future mutation:

- Confirm the requester has a reasonable relationship to the referenced record.
- Avoid collecting unnecessary identity documents.
- If additional verification is genuinely necessary, keep it outside the public repository and follow the merchant/provider/legal process that will be approved for production.

The read-only record-map lookup itself does not constitute approval to delete or anonymize anything.

## 3. Internal record lookup

Authorized operator request shape:

- By Guardian ID: `/api/admin/privacy-record-map?id=<GUARDIAN_ID>`
- By payment reference: `/api/admin/privacy-record-map?paymentReference=<EXACT_REFERENCE>`
- Required header: `x-lumen-internal-secret: <secure environment value>`

Never put the secret in a URL/query parameter.

Expected response properties include:

- `lookup.guardianId`
- `mutationAvailable: false`
- `recordMap.guardianOrder`
- `recordMap.guardianStories`
- `recordMap.checkoutSessions`
- `recordMap.paymentEvents`
- `recordMap.refundJobs`
- `recordMap.physicalFulfillment`
- `recordMap.editionSlots`
- `redactionCandidates`
- `protectedOperationalClasses`

The operator should use presence booleans and record counts to understand the scope without copying raw personal content into the privacy case log.

## 4. How to interpret the map

### Personalization / user-content candidates
May become candidates for deletion or anonymization once the final policy permits it:

- Guardian display name
- giver name
- recipient name
- gift message
- target date
- story text
- story display name
- optional shipping name/phone/postal/address fields

### Operational / transaction classes
Must not be automatically deleted merely because they are linked to a privacy request:

- payment reconciliation records
- refund/dispute evidence
- policy acceptance evidence
- provider/accounting records
- limited-edition slot/integrity records
- fulfillment records where a legal/operational retention requirement still applies

The approved retention matrix must define whether a record is retained, deleted, pseudonymized, anonymized or detached from personal fields.

## 5. Current mutation rule — HOLD

There is intentionally **no public or admin automatic-delete endpoint** in this V1 workflow.

Until the final retention matrix is approved:

- do not issue ad-hoc production `DELETE` statements,
- do not blank transaction/payment records simply to make a privacy request appear completed,
- do not delete edition-slot evidence in a way that could allow over-issuance,
- do not delete refund/dispute evidence needed to resolve an open case,
- do not claim a request is fully completed if required records are still retained.

If a lawful/approved deletion must occur before a dedicated mutation workflow exists, it requires a separately reviewed operational change procedure, backup/rollback consideration and a documented list of fields/tables to change.

## 6. Response to requester

After the approved action is actually completed:

- confirm completion in plain language,
- state if certain transaction records must be retained and why, when applicable,
- do not include internal table names, secrets, other users' data or provider credentials,
- do not paste deleted private content back into the confirmation message.

## 7. Minimal evidence record

Keep only what is needed to prove the request was handled:

- internal request ID
- received date
- completed date
- Guardian/order reference or a minimized internal reference
- categories reviewed
- action classification (deleted / anonymized / retained under obligation / no server record found)
- operator
- reason for any retained category

Do not copy gift messages, birth data, shipping addresses or raw payment credentials into the evidence record.

## 8. Rehearsal required before `LUMEN_DELETE_REQUEST_FLOW_VERIFIED=true`

Run one controlled end-to-end rehearsal using non-sensitive test data:

1. Send a test privacy request to the real support channel.
2. Record intake using the minimal process.
3. Resolve the test Guardian ID with the internal record map.
4. Confirm unauthenticated access to the record map is rejected.
5. Confirm the map does not return raw gift/shipping/token values.
6. Apply the approved retention/anonymization decision once that policy exists.
7. Confirm the final response process.
8. Record only minimal evidence.
9. Review the rehearsal for any unnecessary data exposure.

Only after the real deployed process is proven should `LUMEN_DELETE_REQUEST_FLOW_VERIFIED=true` be considered.

## 9. Relationship to other gates

Use together with:

- `V1_DATA_INVENTORY.md`
- `PRIVACY_RELEASE_CHECKLIST.md`
- `OPERATIONS_BACKUP_RECOVERY.md`
- `PAYMENT_KYC_SANDBOX_CHECKLIST.md`

The privacy request workflow cannot be finalized independently of the actual merchant jurisdiction, payment provider, accounting/dispute requirements and final data-retention matrix.
