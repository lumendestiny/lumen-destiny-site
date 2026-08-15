# Lumen Destiny V1 — Final Cutover Checklist

Updated: 2026-08-15

Purpose: one-page operator sequence for the final V1 release. This checklist references the detailed evidence documents and does not contain credentials, secret values, customer data or provider keys.

## Release scope

V1 includes:
- Free Saju / Four Pillars
- Fortune result pages
- Compatibility
- LUMEN GUARDIAN archive, personalization, gifting, verification and paid digital issuance after payment approval

V1 excludes:
- Face reading / face-photo upload
- 1:1 AI consultation

Do not change this scope during final cutover without a separate release review.

## Hard rule

**No real customer payment is enabled while any required HOLD below remains.**

A code implementation or automated browser PASS is not a substitute for external/provider or manual operational evidence.

## Phase 1 — Engineering evidence

Require current green evidence for:
- Production Smoke
- Core V1 Runtime
- Privacy Runtime
- Mobile Runtime
- Guardian Journey Runtime
- Accessibility Runtime including Legendary reduced-motion behavior
- Recovery Runtime
- Legal/Language coverage
- Payment Flow Audit
- Security Release Audit
- Guardian D1 Schema Audit
- Operations Recovery Audit
- Sensitive Logging static audit
- Admin Dashboard Runtime Audit
- Flag Integrity / SEO release audits

If a release-changing commit is made after these checks, re-run the affected audits before proceeding.

## Phase 2 — Physical devices

Use `PHYSICAL_DEVICE_RELEASE_CHECKLIST.md`.

Require:
- one real iOS/iPhone PASS,
- one real Android/Chrome PASS,
- no blocking keyboard/touch/native-control/rotation/browser-chrome issue.

Do not turn on payment simply to test physical layout.

## Phase 3 — Production D1

From the protected Guardian admin dashboard:
- run the read-only `D1 Preflight`,
- confirm required schema/index checks are PASS,
- confirm no customer rows are returned by the preflight,
- while payment approval is incomplete, confirm checkout control remains HOLD.

Separately follow `OPERATIONS_BACKUP_RECOVERY.md`:
- create a secure real Production D1 export outside the public repository,
- validate its structure,
- import it into a separate non-production D1,
- verify schema/aggregate/edition integrity there,
- record rehearsal evidence privately.

Do not overwrite Production as a rehearsal.

## Phase 4 — Privacy operations

Use:
- `V1_DATA_INVENTORY.md`
- `PRIVACY_RELEASE_CHECKLIST.md`
- `PRIVACY_REQUEST_OPERATIONS.md`

Require:
- final Guardian/payment retention/anonymization matrix,
- deployed Cloudflare/Functions log review,
- one controlled privacy/deletion-request rehearsal,
- public privacy wording reconciled with the approved process,
- privacy evidence flags set only after the corresponding evidence exists,
- authenticated Privacy Gate reports READY.

Face-photo verification is not a V1 blocker while face reading remains disabled.

## Phase 5 — Payment provider

Use:
- `PAYMENT_PROVIDER_APPLICATION_PACKET.md`
- `PAYMENT_KYC_SANDBOX_CHECKLIST.md`
- `GUARDIAN_PAYMENT_PROVIDER_DECISION.md`

Require evidence that the selected provider has approved the **actual** Lumen Destiny / Guardian business category.

Then require:
- KYC/business verification,
- settlement/payout approval,
- sandbox checkout tests,
- webhook authenticity and duplicate-event tests,
- amount/currency mismatch rejection,
- failure/cancellation/expiry handling,
- final limited-slot concurrency test,
- refund and refund-failure mapping,
- production account/credentials activated in secure provider/Cloudflare storage.

Do not describe the service inaccurately to bypass provider restrictions.

## Phase 6 — Master Go-Live review

In the protected Guardian admin dashboard:
- review Security Gate,
- review Privacy Gate,
- review D1 Preflight,
- review payment incidents/integrity,
- review Master Go-Live Gate,
- confirm every required item is READY/PASS except controls that are intentionally still holding payment closed for the final arm sequence.

Any unexplained HOLD or ERROR stops the cutover.

## Phase 7 — Final payment arm sequence

Only after Phases 1–6 are complete:

1. Confirm payment test mode is off.
2. Confirm emergency hold is not active.
3. Confirm provider production checkout/webhook/refund configuration belongs to the approved production account.
4. Confirm the public payment enablement switch is deliberately armed by the authorized operator.
5. Confirm the database checkout control is still HOLD immediately before the final step.
6. Use the protected payment-control operation to change checkout from HOLD to OPEN only after its prerequisite check reports no blocker.
7. Immediately run Production Smoke / protected status checks again.
8. Perform one controlled low-risk production purchase according to the approved provider launch procedure.
9. Verify provider event → payment record → Guardian issuance → public verification end-to-end.
10. Verify no duplicate issuance and no unexpected privacy/logging exposure.

If any step is uncertain, keep or return checkout to HOLD.

## Phase 8 — Immediate rollback conditions

Return payment checkout to HOLD if any of the following occurs:
- unexpected amount/currency result,
- webhook signature/mapping problem,
- duplicate issuance risk,
- edition-slot inconsistency,
- paid-but-not-issued order without understood recovery path,
- refund mapping failure,
- critical/high unresolved payment incident,
- private data/secret exposure,
- Production D1 schema/control inconsistency.

Keep free Saju, compatibility and non-payment Guardian browsing available when safe; payment can remain independently held.

## Phase 9 — First-day monitoring

During the first paid operating period, review:
- payment incidents and rejected events,
- refund/support queue,
- issued edition counts,
- Guardian verification results,
- support inbox,
- error logs for secret/private-data leakage,
- customer-facing mobile/payment-result behavior.

Do not loosen safety checks in response to a failed transaction. Investigate the failure and correct the underlying issue.

## Current state rule

Until all manual/external evidence is recorded, the correct V1 state remains:

**CORE PRODUCT READY / REAL PAYMENT HOLD**
