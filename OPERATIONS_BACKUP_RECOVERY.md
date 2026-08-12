# Lumen Destiny — Operations Backup & Recovery Runbook

Updated: 2026-08-12

## 1. What must be recoverable
- GitHub source and configuration documentation
- Cloudflare Pages project configuration
- Cloudflare environment-variable names and configuration state (never copy secrets into GitHub)
- D1 Guardian order/payment/refund/test-history data
- Guardian issued-number / edition state
- Public policy pages and current policy version identifiers
- PG approval/KYC evidence stored outside the public repository

## 2. Source rollback
GitHub `main` is the source of truth for application code.
Before high-risk production changes:
- record the current deployed commit SHA
- confirm CI audits pass
- keep the previous known-good commit identifiable

If a release breaks the site:
1. Disable new payment checkout if payment integrity is uncertain.
2. Roll back/redeploy the last known-good commit.
3. Do not delete payment/webhook records while investigating.
4. Re-run Guardian E2E and security release gates before re-enabling payment.

## 3. D1 backup discipline
Before schema migrations or payment-provider cutover:
- create/export a D1 backup using the current Cloudflare-supported method
- record backup timestamp and migration version
- verify that orders, payment events, refund jobs and issued Guardian state are included
- never test restoration by overwriting production

Restoration rehearsal must be performed on a non-production database before launch.

## 4. Incident priorities
### Payment incident
- set payment capability to HOLD/OFF
- preserve webhook/event records
- identify provider event IDs and Guardian IDs affected
- prevent duplicate issuance/refund
- communicate with affected customers after scope is known

### Guardian issuance incident
- stop new issuance if edition counters may be inconsistent
- compare verified payments against issued-number records
- never manually invent or reuse an issued number

### Privacy incident
- stop the affected upload/processing path
- preserve only logs needed for investigation without spreading sensitive data
- verify whether source images/personal data were retained unexpectedly
- follow applicable notification/legal requirements based on actual operating jurisdiction

## 5. Secret compromise
If any API key/webhook/internal secret is exposed:
1. Rotate/revoke it at the provider immediately.
2. Update Cloudflare Secret storage.
3. Do not commit the replacement secret to GitHub.
4. Review logs/events from the exposure window.
5. Re-run security and payment tests.

## 6. Launch requirement
Production launch remains HOLD until:
- rollback path is understood
- D1 backup/export has been successfully produced
- non-production restoration rehearsal has been completed
- payment-disable emergency procedure is documented and accessible to the operator
- provider and Cloudflare account recovery methods are verified

This runbook is operational guidance; provider-specific backup/restore commands must be re-verified against current official Cloudflare/PG documentation at the time they are executed.