# Lumen Destiny V1 — Cloudflare / D1 Production Preflight

Use this before setting Guardian/Experience/Privacy production flags to true.

## A. Pages Production bindings
Confirm the Production environment, not Preview:
- D1 binding exactly: `GUARDIAN_DB`
- binding points to the intended production Guardian database
- `LUMEN_INTERNAL_SECRET` exists as a Secret
- paused 1:1 consultation is not re-exposed by environment configuration

Do not paste secret values into screenshots, GitHub, support tickets, or chat.

## B. Guardian D1 schema evidence
The repository contains migration history with duplicate numeric prefixes and a numbering gap. Do not rename historical migration files merely to make numbering look sequential.

For V1 the deployed schema must support at least:
- Guardian orders and issuance state
- gift/order recipient fields used by the current order Functions
- Guardian edition slots / limited-quantity issuance
- checkout sessions / checkout lifecycle
- policy acceptance
- payment event audit: `guardian_payment_events`
- refund jobs: `guardian_refund_jobs`
- Guardian E2E history: `guardian_e2e_runs`
- payment-reference indexes / uniqueness protection
- payment incidents: `guardian_payment_incidents`
- emergency checkout control: `guardian_payment_control`
- payment-control audit: `guardian_payment_control_audit`

Static repository evidence is checked by `scripts/d1-schema-audit.mjs`; it does not prove that Production D1 has received the migrations.

## C. Production D1 manual verification
In Cloudflare D1, verify the bound database contains the required tables. Record only table names/schema version evidence; do not expose customer rows.

Suggested read-only verification targets:
- list tables
- inspect schema for required tables/indexes
- verify the checkout control row exists for `control_key='checkout'`
- verify application Functions can read the database without returning `storage_not_configured` or schema errors

Do not run destructive statements as part of launch verification.

## D. Backup / recovery evidence
Before risky schema/provider changes:
- produce a D1 export/backup using the currently supported Cloudflare method
- record UTC timestamp and deployed commit SHA
- verify backup includes orders, payment events, refunds, issued/edition state and control/audit state
- restore into a non-production D1 database and verify required tables/representative counts
- never overwrite Production for a rehearsal

Only after this rehearsal succeeds may `LUMEN_BACKUP_RECOVERY_VERIFIED=true` be considered.

## E. Privacy/logging evidence
During controlled success and forced-error tests, inspect Cloudflare Functions logs. Confirm logs do not contain raw secrets, authorization headers, raw payment credentials, personal free-form Guardian messages, or unnecessary Saju/compatibility inputs.

Only after evidence exists should the corresponding Privacy Gate flags be set true.

## F. Production feature activation order
1. D1 binding/schema verified.
2. Security and Privacy evidence verified.
3. Guardian server E2E verified with payments still OFF if possible.
4. PG/KYC/Sandbox/provider mapping/webhook/refund verified.
5. Backup/recovery rehearsal completed.
6. Experience manual evidence completed.
7. Master Go-Live Gate has zero blockers.
8. Enable real checkout only after all preceding requirements are satisfied.

Fail closed: absence of evidence means HOLD, not PASS.
