# Lumen Destiny V1 — Release Status

Updated: 2026-08-15

This file is an evidence-based release snapshot. A gate is marked PASS only when the corresponding automated or manual evidence exists. Do not convert HOLD to PASS merely because implementation code exists.

## Frozen V1 scope

Public V1 includes:
- Free Saju / Four Pillars
- Fortune result pages
- Compatibility
- LUMEN GUARDIAN archive, personalization, gifting, verification and payment-ready flow

Explicitly excluded from V1:
- Face reading / physiognomy
- Face-photo upload
- 1:1 AI consultation

The excluded features remain future-upgrade candidates only.

## Automated / engineering gates

| Area | Status | Evidence / rule |
|---|---|---|
| V1 scope lock | PASS | `/consult` redirects to home; public consultation API requires a separate future flag; production smoke requires `consult=false`. |
| Production route smoke | PASS | Core V1 and public legal/support URLs are checked across all six languages; internal privacy/D1 admin endpoints reject unauthenticated access. |
| Core V1 Saju + compatibility runtime | PASS | Chromium completed 12/12 KO / EN / JA / TL / VI / ZH form → result journeys with populated Saju/compatibility results and mobile fit. |
| Free-reading private-input runtime | PASS | Chromium completed 12/12 Saju/compatibility language journeys with private input absent from audited network URLs and cleaned from result URL/session state after success. |
| Core language coverage | PASS | KO / EN / JA / TL / VI / ZH static/runtime coverage, including shared recovery UI. |
| Legal/support language coverage | PASS | Terms, Refund/Cancellation, Privacy and Support are wired/rendered for all six languages. |
| Recovery/error runtime | PASS | Chromium exercises offline and temporary-error UI in all six languages with localized actions and mobile-safe layout. |
| Payment flow safety | PASS | Checkout requires policy consent, server-confirmed payment, duplicate/refund protection, explicit-open DB control and all external/privacy/public-arm prerequisites before payment control can be opened. |
| Public real payment | HOLD | Must remain disabled until external provider approval/KYC/sandbox/production credentials and all applicable operational gates are complete. |
| Mobile rendered audit | PASS | Chromium completed 144 route/language/width combinations at 320/360/390/430px with no page-level overflow and stable mobile controls/navigation. |
| Guardian preview journey | PASS | 20-card archive → personalization and gift preview journeys pass across all six languages without creating real payment/orders. |
| Accessibility rendered audit | PASS | Chromium + axe has no remaining serious/critical tested WCAG findings; skip link works; Legendary Guardian switches to approved static media when reduced motion is requested. |
| Security release audit | PASS | Client secrets absent; internal admin endpoints protected; privacy record map and D1 preflight are read-only. |
| Guardian D1 schema audit | PASS | Canonical V1 Bootstrap, historical schema evidence and fail-closed checkout-control normalization are covered by schema checks. |
| Operations recovery engineering audit | PASS | Canonical V1 Bootstrap executes in memory; D1 export validator self-test passes; validator refuses backup artifacts stored inside the public repo. |
| Admin dashboard D1 Preflight UI | PASS | Mobile browser runtime verifies noindex, password/session-only secret handling, read-only D1 status rendering and secret clearing. |
| Flag integrity audit | PASS | Existing flag-integrity workflow. |
| SEO release audit | PASS | Existing SEO workflow, with consultation excluded from V1 indexing. |
| Privacy operational release gate | HOLD | Final Guardian/payment retention, deployed sensitive-log review, real deletion-request rehearsal and privacy flags still need operational evidence. |
| Live Production D1 authenticated preflight | HOLD | Read-only endpoint/UI exist, but the live bound `GUARDIAN_DB` still needs an authenticated operator run and checkout-control HOLD confirmation. |
| Real backup / restore rehearsal | HOLD | Engineering validator is PASS, but a secure real D1 export and import into a separate non-production D1 still need operational evidence. |
| Physical-device UX | HOLD | One real iOS and one real Android test remain required. |

## Free-reading privacy hardening completed

- Free Saju and compatibility input use temporary browser `sessionStorage` handoff instead of intentionally putting name/birth data in the initial result-page network URL.
- The existing calculation modules receive legacy query state only inside browser history, without a second private-data network request.
- Result pages use `referrer=no-referrer` while this compatibility bridge exists.
- Successful calculation clears the private session record and reduces the visible URL back to language-only state.
- Saved handoffs older than 30 minutes are not reused.
- Dedicated Privacy Runtime Audit verifies all six supported languages for both Saju and compatibility.
- `V1_DATA_INVENTORY.md` separates technical cleanup evidence from retention decisions that require merchant/provider/legal evidence.

This PASS does **not** make the whole privacy operational gate PASS.

## Guardian and accessibility hardening completed

- Guardian purchase/personalization/gift preview remains connected across all six languages.
- Policy/refund/terms consent is checked before checkout-ready state and checked again before the checkout API call.
- Chinese Guardian checkout/payment-result recovery paths are explicitly localized.
- Reduced-motion users selecting Legendary Guardian receive the approved static Legendary asset rather than the animated live-motion asset; decorative CSS sweep/border motion is also disabled.
- Mobile, Guardian Journey and Accessibility Runtime audits all pass after the reduced-motion change.

## Payment fail-closed hardening completed

Public checkout now requires every applicable layer rather than relying on a single switch:

1. payment backend enabled,
2. PG category approval,
3. KYC complete,
4. provider sandbox verified,
5. provider production-ready,
6. privacy policy finalized,
7. retention verified,
8. deletion-request flow verified,
9. sensitive logging verified,
10. TEST MODE off,
11. emergency hold off,
12. explicit public checkout arm,
13. database checkout control explicitly `open`,
14. no unresolved critical payment incident.

Additional fail-closed behavior:
- missing DB checkout-control row = HOLD,
- unknown/non-open state = HOLD,
- control read failure = HOLD,
- internal payment-control `open` command is rejected until the external/privacy/public-arm prerequisites are complete,
- historical evolved databases have `0017_payment_control_fail_closed.sql`, which can only normalize checkout toward `hold`, never open it,
- fresh V1 database Bootstrap starts checkout at `hold`.

Real customer checkout must remain closed while the external evidence chain is incomplete.

## Production D1 / admin tooling completed

- `/api/admin/d1-preflight` is internal-secret protected and read-only.
- It checks required table/column availability, required indexes and checkout-control state without returning customer rows.
- Production Smoke requires public unauthenticated access to receive `401 unauthorized`.
- Guardian admin dashboard now exposes a `D1 Preflight` button using the existing current-tab Internal Secret workflow.
- Admin Dashboard Runtime Audit verifies the secret is kept in `sessionStorage`, not localStorage, and can be cleared with the Forget action.
- `/api/admin/privacy-record-map` provides a separate read-only record-class map for privacy requests without returning raw gift/shipping/token values.

These tools make the remaining operational checks easier; they do not substitute for actually running the authenticated Production D1 preflight.

## Backup / recovery engineering completed

- Fresh V1 schema source of truth is `migrations/BOOTSTRAP_V1_NEW_D1.sql`; do not lexically replay every historical migration file into a new database.
- Historical migrations remain migration/evolution evidence for databases created during development.
- `scripts/d1-export-validate.mjs` validates a secure D1 SQL export for expected schema coverage and refuses a backup file stored inside the public repository.
- Operations Recovery Audit executes the canonical Bootstrap against empty in-memory SQLite and self-tests the export validator.
- `OPERATIONS_BACKUP_RECOVERY.md` documents secure export, non-production import rehearsal and Time Travel incident-recovery boundaries.

Still HOLD:
- produce a real secure export from the live D1,
- validate that real export,
- import it into a separate non-production D1,
- verify aggregate/schema/edition integrity there without publishing customer data.

## Manual / external HOLD items

1. **Physical-device UX verification**
   - One real iPhone/iOS browser journey.
   - One real Android/Chrome journey.
   - Touch, keyboard, native controls, browser chrome, rotation/resume and Guardian visual quality.

2. **Privacy operational evidence**
   - Finalize Guardian/payment retention periods and deletion/anonymization triggers after actual merchant/provider/legal requirements are known.
   - Review deployed Cloudflare/Functions logs during success and forced-error cases for birth input, gift messages and secrets.
   - Run one controlled end-to-end privacy/deletion request through `llumendestiny@gmail.com` and the deployed operations process.
   - Reconcile final privacy wording and then set privacy evidence flags individually.

3. **Production D1 operations**
   - Run authenticated Guardian Admin `D1 Preflight` against the live `GUARDIAN_DB`.
   - Confirm current checkout-control state is `hold` while payment approval is incomplete.
   - Produce secure real D1 export and complete non-production restoration rehearsal.

4. **PG business approval / KYC**
   - Written approval for the actual Lumen Destiny / Guardian category.
   - KYC/business and settlement approval.
   - Provider sandbox acceptance suite.
   - Production credentials/account activation.

5. **Real payment cutover**
   - Signed webhook/refund mapping verified against the approved account.
   - TEST MODE off.
   - All privacy/payment/D1 gates green.
   - Deliberately arm public checkout.
   - Deliberately set DB checkout control `open` as the final controlled payment-enable step.

## Current release posture

The remaining HOLD items are now concentrated in **real-device evidence, live Production D1/backup operations, privacy operations, and external payment-provider approval** rather than unresolved core V1 page functionality.

Do not open real customer payment until all applicable external and operational evidence is complete.
