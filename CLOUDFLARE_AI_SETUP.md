# Lumen Destiny — Cloudflare V1 activation checklist

This file contains only variable names and safe example values. Never commit real secrets to GitHub.

## V1 public scope
V1 publicly exposes Saju / fortune / compatibility and Lumen Guardian. **Face reading / physiognomy (관상) and 1:1 AI consultation are excluded from V1.** They are future-upgrade decisions and are not V1 launch blockers.

Do not enable an excluded feature merely because its backend code or secret exists.

## 1. Current AI key state
An OpenAI key may exist in Cloudflare for future/controlled use, but V1 launch does not expose 1:1 consultation.

For V1 Production:
- `LUMEN_PUBLIC_CONSULT_ENABLED` = **false or unset**
- `/consult` redirects to the V1 home experience
- `/api/consult` is fail-closed unless the dedicated public consultation flag is deliberately enabled in a later release

A legacy backend key/configuration alone must never expose the feature:
- `OPENAI_API_KEY` = Secret only, if retained
- `LUMEN_AI_ENABLED` may describe backend preparation, but it does **not** make consultation public
- never place the key in GitHub or browser runtime configuration

Only after a future product decision to reintroduce consultation should the team separately review the UI, policy, limits, storage behavior and all six languages, then intentionally set `LUMEN_PUBLIC_CONSULT_ENABLED=true`.

Optional server tuning variables for that future release:
- `OPENAI_MODEL`
- `LUMEN_AI_REQUESTS_PER_MINUTE`
- `LUMEN_AI_MAX_OUTPUT_TOKENS`

## 2. Guardian server preflight
Before enabling Guardian server-backed issuance, confirm in Cloudflare Pages Production:
- D1 binding name: `GUARDIAN_DB`
- `LUMEN_INTERNAL_SECRET` = Secret
- `LUMEN_GUARDIAN_ENABLED=true` only after the D1 schema preflight passes

Before enabling real payment checkout also require the payment/provider secrets and release gates documented in the payment runbooks. `LUMEN_PAYMENTS_ENABLED=true` may be used for backend/sandbox preparation; **customer checkout remains fail-closed until the separate final public checkout arm and all PG evidence gates pass.** Do not turn public payments on just to test page rendering.

## 3. Production verification
After any Production environment or D1 binding change, trigger/review a new production deployment.

Verify only non-sensitive status information through public health/status routes. Admin release gates require the internal secret and must not be exposed publicly.

For V1 smoke verification, confirm:
- `features.consult=false`
- public `/consult` does not expose the consultation UI
- while PG evidence is incomplete or payment test mode is active, `features.payments=false`

## 4. Privacy and security rules
- Secrets remain Cloudflare Secrets, never plain browser variables.
- Saju/compatibility result URLs are noindex and input values are not intended for server DB persistence.
- Guardian stores only fields required for order/issuance/payment/support operations.
- V1 Privacy, Security, Experience and Payment gates remain fail-closed until their evidence is complete.
- Face-reading photo processing is not part of V1 because face reading itself is excluded.

## 5. D1 operations
The repository `migrations/` directory is the schema source for Guardian operational data. Existing migration filenames must not be casually renamed or renumbered because a deployed database may already record them.

Before launch:
- verify the Production D1 binding points to the intended database
- verify required tables/columns exist
- export/backup D1 before risky migration/provider changes
- perform restoration rehearsal on a non-production database, never by overwriting Production

See `CLOUDFLARE_D1_PREFLIGHT.md` and `OPERATIONS_BACKUP_RECOVERY.md`.
