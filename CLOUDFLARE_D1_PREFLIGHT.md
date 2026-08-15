# Lumen Destiny V1 — Cloudflare / D1 Production Preflight

Updated: 2026-08-15

Use this before setting Guardian/Experience/Privacy production flags to true.

## A. Pages Production bindings
Confirm the Production environment, not Preview:
- D1 binding exactly: `GUARDIAN_DB`
- binding points to the intended production Guardian database
- `LUMEN_INTERNAL_SECRET` exists as a Secret
- paused 1:1 consultation is not re-exposed by environment configuration

Do not paste secret values into screenshots, GitHub, support tickets, or chat.

## B. Guardian D1 schema evidence

### Historical migrations vs fresh V1 bootstrap
The repository contains migration history from several implementation phases. It includes duplicate numeric prefixes, an older `0001_guardian.sql` baseline and a numbering gap. **Do not treat lexical replay of every historical `.sql` file as the fresh-database recipe.** The older files remain useful as migration/history evidence for databases that were evolved during development.

For a brand-new empty V1 D1 database, the canonical current schema file is:

`migrations/BOOTSTRAP_V1_NEW_D1.sql`

The Operations Recovery Audit executes this Bootstrap against an empty in-memory SQLite database and then validates the resulting schema through `scripts/d1-export-validate.mjs`.

Do not run the Bootstrap over an existing Production database merely as a verification step. Existing Production is verified read-only against the required final schema.

For V1 the deployed schema must support at least:
- Guardian orders and issuance state
- gift/order recipient fields used by the current order Functions
- Guardian personalization fields
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
- optional/currently schema-compatible story/shipping/physical-fulfillment tables used by existing server endpoints

Static repository evidence is checked by `scripts/d1-schema-audit.mjs`; the canonical Bootstrap is also executed by the Operations Recovery Audit. Neither proves by itself that the bound Production D1 has the expected live schema.

## C. Production D1 manual verification
In Cloudflare D1, verify the bound database contains the required tables. Record only table names/schema/version evidence; do not expose customer rows.

Suggested read-only verification targets:
- list tables
- inspect schema for required tables/indexes
- verify the checkout control row exists for `control_key='checkout'`
- verify application Functions can read the database without returning `storage_not_configured` or schema errors

Do not run destructive statements as part of launch verification.

If Production was created/evolved through historical migrations, **do not try to make its migration history look like a fresh Bootstrap database by replaying old files**. Verify final schema compatibility instead.

## D. Backup / recovery evidence
Before risky schema/provider changes:
- confirm current D1 recovery/Time Travel information
- produce a secure D1 SQL export using the currently supported Cloudflare method
- record UTC timestamp and deployed commit SHA
- run `scripts/d1-export-validate.mjs` against the export from a secure path outside this public repository
- verify backup includes orders, payment events, refunds, issued/edition state and control/audit state
- import the export into a separate non-production D1 database and verify required tables/representative aggregate counts
- never overwrite Production for a rehearsal

A restore rehearsal uses the **actual export artifact**, not the Bootstrap. The Bootstrap validates that a fresh V1 schema is coherent; the export rehearsal proves that current operational data can be reconstructed elsewhere.

See `OPERATIONS_BACKUP_RECOVERY.md` for the detailed procedure.

Only after a secure export and non-production restoration rehearsal succeed may `LUMEN_BACKUP_RECOVERY_VERIFIED=true` be considered.

## E. Privacy/logging evidence
During controlled success and forced-error tests, inspect Cloudflare Functions logs. Confirm logs do not contain raw secrets, authorization headers, raw payment credentials, personal free-form Guardian messages, or unnecessary Saju/compatibility inputs.

Only after evidence exists should the corresponding Privacy Gate flags be set true.

## F. Production feature activation order
1. D1 binding/final schema verified.
2. Security and Privacy evidence verified.
3. Guardian server E2E verified with payments still OFF if possible.
4. PG/KYC/Sandbox/provider mapping/webhook/refund verified.
5. Secure D1 export + non-production recovery rehearsal completed.
6. Experience/manual physical-device evidence completed.
7. Master Go-Live Gate has zero blockers.
8. Enable real checkout only after all preceding requirements are satisfied.

Fail closed: absence of evidence means HOLD, not PASS.
