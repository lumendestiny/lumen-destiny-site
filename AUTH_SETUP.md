# Lumen Destiny authentication activation

The repository now contains a login/signup UI and auth gate for Connection Map and Guardian services. Authentication uses Supabase Auth so Google, Kakao, X and email/password can share one account/session layer.

## Privacy rules

- Do not store original Saju/compatibility/Connection Map birth date or birth time in the user account.
- Connection Map raw birth inputs remain calculation-only. Saved Connection Map data stays local to the device and is separated by authenticated user id.
- Guardian orders may store the authenticated `user_id` so orders and checkout can be owner-scoped.
- `/guardian-verify/` stays public because QR authenticity verification must work for a recipient who is not signed in. Other Guardian service pages are login-gated after auth enforcement is enabled.

## 1. Create/configure Supabase

Create a Supabase project and enable Authentication.

Set the site URL to:

`https://lumendestiny.com`

Add redirect URLs that include:

- `https://lumendestiny.com/login/`
- `https://www.lumendestiny.com/login/` if the www host is used
- local preview URLs used during development

## 2. Enable providers

Enable these Supabase Auth providers:

- Email/password
- Google
- Kakao
- X / Twitter OAuth 2.0

Provider client secrets belong in the provider dashboards/Supabase settings, never in this repository or browser JavaScript.

## 3. Cloudflare Pages environment variables

Add these variables to the Lumen Destiny Pages project:

- `SUPABASE_URL` = project URL
- `SUPABASE_PUBLISHABLE_KEY` = public/publishable browser key
- `LUMEN_AUTH_REQUIRED` = `false` during setup and QA

Do **not** place a Supabase service-role key in browser code or `/api/auth/config`.

## 4. Apply D1 migration

Apply `migrations/0018_auth_user_ownership.sql` to the Guardian D1 database before requiring authentication. This adds `guardian_orders.user_id` and its index.

## 5. Test before locking routes

Test all six languages and all sign-in methods:

1. Google sign-in
2. Kakao sign-in
3. X sign-in
4. Email signup and verification
5. Email/password sign-in
6. Sign out
7. Protected route returns to the original `next` path after sign-in
8. Guardian order creation and checkout send the Bearer access token
9. A signed-in user cannot checkout another user's Guardian order
10. `/guardian-verify/` remains usable without sign-in

## 6. Turn on login requirement

After provider setup, migration and QA are complete, set:

`LUMEN_AUTH_REQUIRED=true`

The client runtime will redirect unauthenticated users from the protected routes to `/login/`, and the Guardian order/checkout APIs will require and verify a valid Supabase access token.

## Protected service scope

Login-gated when `LUMEN_AUTH_REQUIRED=true`:

- `/connection-map/`
- `/guardian/` including the talisman archive
- `/guardian-order/`
- `/guardian-gift/`
- `/guardian-gallery/`
- `/guardian-campaigns/`
- `/guardian-story/`
- `/guardian-physical-status/`
- Guardian shipping/payment-result service paths

Public exception:

- `/guardian-verify/` for QR authenticity verification
