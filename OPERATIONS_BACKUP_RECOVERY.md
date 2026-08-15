# Lumen Destiny — Operations Backup & Recovery Runbook

Updated: 2026-08-15

Cloudflare D1 procedure in this runbook was re-checked against the current official D1 Time Travel, Wrangler `d1 export`, and import/export documentation on 2026-08-15. Re-verify provider commands immediately before a real recovery because platform behavior can change.

## 1. What must be recoverable
- GitHub source and configuration documentation
- Cloudflare Pages project configuration
- Cloudflare environment-variable names and configuration state (never copy secrets into GitHub)
- D1 Guardian order/payment/refund records
- Guardian issued-number / edition-slot integrity state
- Guardian user-content/shipping records if any exist in the database
- Public policy pages and current policy version identifiers
- PG approval/KYC evidence stored outside the public repository

## 2. Source rollback
GitHub `main` is the source of truth for application code.

Before high-risk production changes:
- record the current deployed commit SHA
- confirm CI audits pass
- keep the previous known-good commit identifiable
- keep public real checkout disabled if payment integrity is uncertain

If a release breaks the site:
1. Disable new payment checkout if payment integrity is uncertain.
2. Roll back/redeploy the last known-good commit.
3. Do not delete payment/webhook records while investigating.
4. Re-run Production Smoke, Guardian/payment and security/privacy release gates before re-enabling payment.

## 3. Current D1 recovery mechanisms

### Time Travel
Current production-storage D1 databases use Time Travel for point-in-time recovery. It is enabled by Cloudflare rather than by a Lumen application switch.

Use the current Wrangler command to inspect the database version and Time Travel state before relying on it:

```bash
npx wrangler d1 info <PROD_DATABASE>
npx wrangler d1 time-travel info <PROD_DATABASE>
```

A Time Travel restore overwrites the selected database in place and is therefore a **destructive production action**. Do not run a production Time Travel restore merely to prove that recovery works.

Before any real emergency restore:
- stop/hold new public checkout if payment or issuance state could change,
- record the current Time Travel bookmark/timestamp,
- record the intended restore timestamp/bookmark,
- obtain an independent current export when feasible,
- confirm the incident scope,
- keep the previous bookmark so the restore itself can be reversed if Cloudflare reports it.

### Portable SQL export
Cloudflare Wrangler supports exporting the schema/data of a remote D1 database to SQL. This is the preferred artifact for a non-production restore rehearsal.

Example shape:

```bash
npx wrangler d1 export <PROD_DATABASE> --remote --output=/secure/path/lumen-d1-YYYYMMDD-HHMM.sql
```

**The SQL export can contain customer/order/payment/personal data.** Never store a production export:
- inside this public Git repository,
- as a public GitHub Actions artifact,
- in an issue or pull request,
- in public chat,
- in an unapproved shared drive.

Use encrypted/private operator storage with access appropriate to production customer data.

## 4. Validate the export without exposing its contents

The repository includes:

```bash
node scripts/d1-export-validate.mjs /secure/path/lumen-d1-YYYYMMDD-HHMM.sql
```

The validator:
- refuses a backup path located inside this Git repository,
- derives expected table names from the current `migrations/` directory,
- verifies that the export includes those expected table schemas,
- verifies critical Guardian/order/payment/refund/edition columns,
- prints only structural metadata such as counts and missing schema names,
- does not intentionally print customer row values.

A validator PASS proves **schema coverage only**. It is not a restore rehearsal and does not prove that every production row is correct.

## 5. Non-production restoration rehearsal

Cloudflare documents importing a D1 SQL export by executing the SQL file against a target D1 database.

Use a **separate non-production D1 database** that cannot serve public customer traffic.

Example shape:

```bash
npx wrangler d1 execute <NONPROD_REHEARSAL_DATABASE> --remote --file=/secure/path/lumen-d1-YYYYMMDD-HHMM.sql
```

Do not point this command at the production database for a rehearsal.

After import, verify at minimum:

```bash
npx wrangler d1 execute <NONPROD_REHEARSAL_DATABASE> --remote --command="PRAGMA table_list"
```

Then verify, without copying customer values into public logs:
- required tables exist,
- aggregate row counts are plausible against the source/export evidence,
- Guardian edition slots are present,
- order/payment/refund/checkout tables are queryable,
- policy acceptance fields are present,
- story/shipping/physical-fulfillment tables are present where defined by migrations,
- application code pointed at the rehearsal DB can read expected test/reference records if a safe test record exists.

Never paste raw production rows into GitHub to prove the rehearsal.

## 6. Rehearsal evidence — keep outside public GitHub

Record privately:
- rehearsal date/time and operator
- source production database name/reference (non-secret)
- source deployed commit SHA
- migration state/version
- Time Travel current bookmark/timestamp reference if recorded
- export filename/hash and secure storage location
- export validator PASS/FAIL
- non-production target database reference
- import start/completion result
- aggregate table-count comparison result
- edition-slot integrity check result
- application read test result
- cleanup/retention decision for the rehearsal copy

Do not record raw customer values, secret tokens, API credentials or the SQL export itself in the public repository.

## 7. D1 backup discipline

Before schema migrations or payment-provider cutover:
1. Confirm `d1 info` / recovery capability.
2. Record a current Time Travel bookmark/timestamp where appropriate.
3. Produce a secure remote SQL export.
4. Run `scripts/d1-export-validate.mjs` locally against that secure file.
5. Keep the export according to the approved operational/privacy retention policy.
6. Never test restoration by overwriting production.

Before paid launch, complete at least one non-production restoration rehearsal from an actual current export.

## 8. Incident priorities

### Payment incident
- set payment capability to HOLD/OFF
- preserve webhook/event records
- identify provider event IDs and Guardian IDs affected
- prevent duplicate issuance/refund
- communicate with affected customers after scope is known

### Guardian issuance incident
- stop new issuance if edition counters may be inconsistent
- compare verified payments against issued-number/edition-slot records
- never manually invent or reuse an issued number

### Privacy incident
- stop the affected collection/processing path
- preserve only logs needed for investigation without spreading sensitive data
- use the internal read-only privacy record map where appropriate to identify record classes
- verify whether personal data was retained unexpectedly
- follow applicable notification/legal requirements based on the actual operating jurisdiction

## 9. Secret compromise
If any API key/webhook/internal secret is exposed:
1. Rotate/revoke it at the provider immediately.
2. Update Cloudflare Secret storage.
3. Do not commit the replacement secret to GitHub.
4. Review logs/events from the exposure window.
5. Re-run security and payment tests.

## 10. Launch requirement
Production paid launch remains HOLD until:
- rollback path is understood
- a secure D1 export has been successfully produced
- export structure validator passes
- non-production restoration rehearsal has been completed
- payment-disable emergency procedure is accessible to the operator
- privacy request/retention rules are compatible with backup retention
- provider and Cloudflare account recovery methods are verified

## Principle
Time Travel protects against recent database mistakes; a portable SQL export provides a rehearsal/longer-lived recovery artifact. Neither should be used in a way that spreads customer data. A production restore is an incident action, not a launch rehearsal.
