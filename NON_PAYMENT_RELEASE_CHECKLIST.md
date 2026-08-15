# Lumen Destiny — Non-payment Release Checklist

Updated: 2026-08-15

This checklist covers V1 launch readiness outside payment-provider approval.

Evidence rule: automated PASS and manual PASS are different gates. Do not replace a required physical-device or operations check with desktop/browser emulation.

## V1 public scope — PASS
- Public V1 includes Free Saju / Four Pillars, fortune result pages, compatibility and LUMEN GUARDIAN.
- 1:1 consultation remains hidden/disabled for V1 and is not a launch dependency.
- Face reading / face-photo upload remain excluded from V1.
- Supported launch languages: KO / EN / JA / TL / VI / ZH (Simplified Chinese).
- All six language buttons render stable official flag state without runtime rewriting.

## 1. Mobile UX

### Automated rendered coverage — PASS
Chromium runtime coverage checks 320/360/390/430px across the six supported languages and core/Guardian routes. The final 144-combination run passed with:

- No page-level horizontal overflow.
- Stable brand + six-language header state.
- Sticky navigation/header behavior.
- Visible mobile form controls at safe sizing.
- Localized Guardian checkout policy links.

### Physical-device coverage — HOLD
At least one real iOS and one real Android device must still be checked for:

- Touch behavior and tap targets.
- Software keyboard opening/closing.
- Native date/select controls.
- Browser chrome and viewport resizing.
- Rotation/background-resume behavior.
- Real visual quality of Guardian cards.

Use `PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` as the evidence checklist. Do not mark the physical-device gate PASS until both rows in that checklist pass.

## 2. Multilingual completeness — AUTOMATED PASS
For KO/EN/JA/TL/VI/ZH the current automated/runtime evidence covers:

- Home/navigation/language state.
- Saju and compatibility form → result journeys.
- Core static language coverage.
- Shared offline/temporary-error recovery UI.
- Guardian archive/personalization/gift preview journeys.
- Guardian checkout policy wording/links.
- Terms, Refund/Cancellation, Privacy and Support rendered localization.
- V1 public navigation does not expose 1:1 consultation.

Manual physical-device review should still watch for clipped long translations or native-control rendering differences.

## 3. Privacy/data handling — AUTOMATED MINIMIZATION PASS + OPERATIONAL HOLD

### Automated evidence — PASS
The dedicated Privacy Runtime Audit verifies all six supported languages for both Saju and compatibility:

- 12/12 form → result journeys complete.
- Free-reading names/birth inputs do not appear in the audited network request URLs during the private handoff.
- Successful calculation removes temporary private `sessionStorage` input.
- Successful result URLs are reduced back to language-only state.
- Guardian public verification excludes gift/private verification fields from the public response contract.
- Core Saju/compatibility functionality remains PASS after the privacy hardening.

Engineering support also includes a protected read-only privacy record map for identifying record classes without returning raw gift/shipping/token values.

### Operational/config evidence — HOLD
Still verify:

- Final Guardian/payment/checkout/policy retention periods and deletion/anonymization triggers.
- One real privacy/deletion request through `llumendestiny@gmail.com` and the deployed operations process.
- Deployed Cloudflare/Functions logs during success and forced-error cases do not expose birth data, personal gift messages or secrets.
- Final public privacy policy wording matches the approved retention/operations process.

Use `V1_DATA_INVENTORY.md`, `PRIVACY_REQUEST_OPERATIONS.md` and `PRIVACY_RELEASE_CHECKLIST.md` for the evidence sequence.

## 4. Error/recovery UX — AUTOMATED PASS + PHYSICAL SPOT CHECK

Automated evidence covers:
- Friendly localized 404 recovery page.
- Shared offline/temporary-error recovery UI in KO / EN / JA / TL / VI / ZH.
- Runtime exercise of offline and error states on a mobile viewport.
- Localized recovery actions and language-preserving home links.
- No page-level overflow caused by recovery UI.
- Core result watchdog/retry paths.

Real iOS/Android review should still confirm browser-native offline/keyboard behavior feels usable.

## 5. SEO/share/public discovery — AUTOMATED PASS FOR CURRENT V1 SCOPE
- Public pages have intended title/description/canonical behavior.
- Admin/test/review pages remain excluded from public indexing.
- Consultation is excluded from V1 indexing.
- robots.txt/sitemap/structured-data release checks are automated.
- Structured data must continue to avoid guaranteed-outcome claims.
- AI Discovery Layer files/pages must not expose internal APIs or secrets.

## 6. Accessibility/basic quality — RENDERED PASS + PHYSICAL SPOT CHECK
Rendered Chromium + axe testing has no remaining serious/critical tested WCAG 2.0/2.1 A/AA findings on current V1 pages.

Additional premium-motion evidence now PASS:
- Guardian decorative CSS motion respects `prefers-reduced-motion`.
- Legendary Guardian switches from live-motion media to the approved static Legendary asset when the OS/browser requests reduced motion.
- The reduced-motion runtime audit confirms the static asset is used and the Legendary sweep animation is `none`.

Real-device zoom, keyboard and OS accessibility behavior still receive a physical spot check.

## 7. Operational readiness — ENGINEERING SUPPORT PASS + LIVE OPERATIONS HOLD

Engineering-side support now exists for:
- Admin Guardian dashboard protected with Internal Secret.
- Admin D1 Preflight control that returns schema/index/control evidence without customer rows.
- Production Smoke rejection of unauthenticated D1/privacy admin endpoints.
- D1 export structure validator that refuses production-style backups stored inside the public repository.
- Canonical V1 Bootstrap self-test against empty SQLite.
- Backup/export/recovery runbook.
- Privacy-request operations runbook.
- Checkout fail-closed behavior when DB control is missing, invalid or unreadable.
- Payment-control `open` command blocked until PG/KYC, privacy, TEST MODE and public-arm prerequisites are complete.

Still HOLD for live operations:
- authenticated D1 Preflight against the bound Production `GUARDIAN_DB`,
- confirmation that Production checkout control is currently `hold`,
- secure real D1 export,
- import/restore rehearsal into a separate non-production D1,
- deployed sensitive-log review,
- real privacy/deletion request rehearsal,
- support inbox monitoring before paid launch.

## 8. Current launch rule

### Engineering-side V1 gates already evidenced PASS
1. V1 scope lock.
2. Production route smoke.
3. Core Saju + compatibility runtime journeys.
4. Free-reading private-input/minimization runtime audit.
5. Six-language core/recovery coverage.
6. Six-language Guardian preview/gift journeys.
7. Rendered mobile audit.
8. Rendered legal/support localization.
9. Rendered accessibility + Legendary reduced-motion audit.
10. Recovery/error runtime audit.
11. Payment-flow fail-closed safety.
12. Security, schema, flag-integrity and SEO release audits.
13. Operations recovery validator/bootstrap self-test.
14. Guardian Admin D1 Preflight UI runtime audit.

### Remaining HOLD gates
1. Real iOS physical-device UX verification.
2. Real Android physical-device UX verification.
3. Privacy retention/anonymization finalization for Guardian/payment records.
4. Real deletion-request rehearsal and deployed sensitive-log review.
5. Authenticated live Production D1 preflight and checkout-HOLD confirmation.
6. Secure real D1 export and non-production restore rehearsal.
7. PG/provider business-category approval.
8. KYC and settlement approval.
9. Provider sandbox acceptance suite.
10. Production credentials/webhook/refund mapping.
11. TEST MODE off, public checkout arm, and deliberate DB checkout `open` only after every applicable payment/privacy/D1 gate is green.

Do not switch a manual verification flag to true simply to clear the gate. Public real payment must remain disabled until the external payment and applicable operational evidence chains are complete.
