# Lumen Destiny App V1 — Account & Guardian Sync Architecture

## Goal
Restore owned and gifted Guardians safely after device changes without storing fortune inputs, wishes, birth data, or private gift messages in the public verification surface.

## V1 identity
- Support Apple Sign In on iOS and Google Sign In on Android/iOS.
- Server creates an internal opaque `user_id` after verifying provider identity tokens.
- Never use email as the ownership key. Email can change or be hidden by Apple.
- One account may link multiple identity providers later.

## Minimal account data
`users`: `id`, `created_at`, `status`, `locale`

`user_identities`: `user_id`, `provider`, `provider_subject`, `created_at`, unique(provider, provider_subject)

Do not store birth date/time, Saju inputs, wish text, or gift message in the account table.

## Guardian ownership
Add private ownership data separate from the public Guardian verification record:

`guardian_ownerships`
- `guardian_id` (unique)
- `owner_user_id` (nullable until claimed)
- `source`: `purchase | gift | claim`
- `claimed_at`
- `transferred_at` (nullable)

Public `/api/guardian/verify` must continue to expose only non-sensitive issuance/authenticity fields.

## Claim model
1. Purchase while signed in: server binds the successfully paid/issued Guardian to the authenticated `user_id`.
2. Gift: purchaser is not automatically the final owner. Recipient receives a one-time claim token/link.
3. Claim token is random, single-use, hashed at rest, expires, and is never returned by public verification API.
4. Recipient signs in, redeems token, and server atomically assigns ownership.
5. Manual Guardian ID alone must never be enough to claim ownership. It remains sufficient only for public authenticity verification.

## Private API contract
All endpoints require an authenticated server session/access token.

- `GET /api/account/me` — minimal profile/session state.
- `GET /api/account/guardians` — Guardians owned by current user; returns only display/issuance fields needed by the app.
- `POST /api/account/guardians/claim` — redeem one-time gift/claim token.
- `POST /api/account/logout` — revoke/clear session where applicable.
- `DELETE /api/account` — account deletion flow; preserve only legally required transaction records with ownership identity minimized/separated.

## App behavior
- Before login, keep the existing local vault as an offline convenience layer.
- After login, fetch server-owned Guardians and merge by Guardian ID with local vault.
- Server ownership is authoritative. Local entries that cannot be proven as owned remain labeled `이 기기에서만 보관` and are never uploaded as ownership claims.
- Newly issued signed-in purchases appear automatically after server issuance confirmation.
- Gifted Guardians appear after the recipient completes the claim flow.

## Security requirements
- Verify Apple/Google tokens server-side (issuer, audience, signature, expiry, nonce where applicable).
- Store app auth tokens in platform secure storage, not AsyncStorage.
- Rate-limit login, claim, and account Guardian endpoints.
- CSRF protection for cookie-based web sessions; mobile should use bearer/session credentials appropriate to the chosen auth service.
- No auth secrets, OAuth client secrets, service-role keys, or database admin credentials in the app bundle or GitHub source.
- Public Guardian QR remains an authenticity check, not proof of account ownership.
- Log ownership changes without logging wish text or other private personalization content.

## Privacy / deletion
- Explain clearly what is synchronized before sign-in.
- Provide account deletion in-app before store submission.
- Deleting an account removes identity/profile and private sync links subject to transaction/legal retention requirements; public issuance authenticity may remain pseudonymous so limited-edition provenance is not broken.

## Implementation gate
Do not enable production account synchronization until provider credentials, backend session verification, database migration, claim-token storage, deletion behavior, and security tests are deployed. The current local Guardian vault remains the safe fallback until that gate passes.
