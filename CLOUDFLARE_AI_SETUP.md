# Lumen Destiny — Cloudflare V1 activation checklist

This file contains only variable names and safe example values. Never commit real secrets to GitHub.

## V1 public scope
V1 publicly exposes Saju / fortune / compatibility and Lumen Guardian. The 1:1 AI consultation route is paused and must remain hidden from navigation and search for V1.

Do not enable a paused feature merely because its backend code exists.

## 1. Current AI key state
An OpenAI key may exist in Cloudflare for future/controlled use, but V1 launch does not require exposing 1:1 consultation.

If retained in Production:
- `OPENAI_API_KEY` = Secret only
- never place the key in GitHub or browser runtime configuration
- keep consultation UI/navigation paused

Optional server tuning variables, only when the consultation feature is intentionally re-enabled in a later release:
- `OPENAI_MODEL`
- `LUMEN_AI_REQUESTS_PER_MINUTE`
- `LUMEN_AI_MAX_OUTPUT_TOKENS`

## 2. Guardian server preflight
Before enabling Guardian server-backed issuance, confirm in Cloudflare Pages Production:
- D1 binding name: `GUARDIAN_DB`
- `LUMEN_INTERNAL_SECRET` = Secret
- `LUMEN_GUARDIAN_ENABLED=true` only after the D1 schema preflight passes

Before enabling real payment checkout also require the payment/provider secrets and release gates documented in the payment runbooks. Do not turn payments on just to test page rendering.

## 3. Production verification
After any Production environment or D1 binding change, trigger/review a new production deployment.

Verify only non-sensitive status information through public health/status routes. Admin release gates require the internal secret and must not be exposed publicly.

## 4. Privacy and security rules
- Secrets remain Cloudflare Secrets, never plain browser variables.
- Saju/compatibility result URLs are noindex and input values are not intended for server DB persistence.
- Guardian stores only fields required for order/issuance/payment/support operations.
- V1 Privacy, Security, Experience and Payment gates remain fail-closed until their evidence is complete.

## 5. D1 operations
The repository `migrations/` directory is the schema source for Guardian operational data. Existing migration filenames must not be casually renamed or renumbered because a deployed database may already record them.

Before launch:
- verify the Production D1 binding points to the intended database
- verify required tables/columns exist
- export/backup D1 before risky migration/provider changes
- perform restoration rehearsal on a non-production database, never by overwriting Production

See `CLOUDFLARE_D1_PREFLIGHT.md` and `OPERATIONS_BACKUP_RECOVERY.md`.
