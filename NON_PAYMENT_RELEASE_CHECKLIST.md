# Lumen Destiny — Non-payment Release Checklist

Updated: 2026-08-15

This checklist covers V1 launch readiness outside payment-provider approval.

Evidence rule: automated PASS and manual PASS are different gates. Do not replace a required physical-device check with desktop/browser emulation.

## V1 public scope — PASS
- Public V1 includes Free Saju / Four Pillars, fortune result pages, compatibility and LUMEN GUARDIAN.
- 1:1 consultation remains hidden/disabled for V1 and is not a launch dependency.
- Face reading / face-photo upload remain excluded from V1.
- Supported launch languages: KO / EN / JA / TL / VI / ZH (Simplified Chinese).
- All six language buttons render stable official flag state without runtime rewriting.

## 1. Mobile UX

### Automated rendered coverage — PASS
Chromium runtime coverage now checks 320/360/390/430px across the six supported languages and core/Guardian routes. The final 144-combination run passed with:

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
- Saju and compatibility form -> result journeys.
- Core static language coverage.
- Guardian archive/personalization/gift preview journeys.
- Guardian checkout policy wording/links.
- Terms, Refund/Cancellation, Privacy and Support rendered localization.
- V1 public navigation does not expose 1:1 consultation.

Manual physical-device review should still watch for clipped long translations or native-control rendering differences.

## 3. Privacy/data handling — MANUAL/CONFIG EVIDENCE REQUIRED
Do not mark complete from design intent alone. Verify actual runtime behavior.

- Privacy policy reflects actual data flow.
- Face-reading is excluded from V1; do not enable face-photo upload during V1 release.
- Saju/compatibility/Guardian data has documented purpose and retention period.
- User deletion request workflow is operational where required.
- Sensitive personal inputs and secrets are not unnecessarily written to logs.
- Guardian payment/order records retain only what is operationally/accounting necessary.

Environment flags are intentionally manual evidence gates:

- `LUMEN_PRIVACY_POLICY_FINALIZED`
- `LUMEN_FACE_PHOTO_EPHEMERAL_VERIFIED` — not a V1 launch dependency while face reading remains disabled; do not set it merely to clear a gate.
- `LUMEN_DATA_RETENTION_VERIFIED`
- `LUMEN_DELETE_REQUEST_FLOW_VERIFIED`
- `LUMEN_SENSITIVE_LOGGING_VERIFIED`

Set them true only after runtime/operational verification.

## 4. Error/recovery UX
- Friendly 404 page with home/service navigation.
- API/network error messages do not expose stack traces or secrets.
- Retry paths exist for readings where safe.
- Guardian payment pending state warns against duplicate payment.
- Failed/cancelled/expired/refund states have clear next actions.
- Maintenance/offline state remains readable on mobile.

## 5. SEO/share/public discovery — AUTOMATED PASS FOR CURRENT V1 SCOPE
- Public pages have intended title/description/canonical behavior.
- Admin/test/review pages remain excluded from public indexing.
- Consultation is excluded from V1 indexing.
- robots.txt/sitemap/structured-data release checks are automated.
- Structured data must continue to avoid guaranteed-outcome claims.
- AI Discovery Layer files/pages must not expose internal APIs or secrets.

## 6. Accessibility/basic quality — RENDERED PASS + PHYSICAL SPOT CHECK
Rendered Chromium + axe testing has no remaining serious/critical WCAG 2.0/2.1 A/AA findings on the tested V1 pages after the current fixes.

Keep verifying:

- Form labels remain associated with inputs.
- Keyboard navigation and visible focus remain intact.
- Images use meaningful alt text or empty alt when decorative.
- Contrast/readability remains acceptable.
- Premium Guardian motion respects reduced-motion preference.
- Real-device zoom/keyboard behavior does not create an accessibility regression.

## 7. Operational readiness
- Admin Guardian dashboard works only with Internal Secret.
- Production real customer payment remains disabled until the external payment gate is complete.
- Backup/export procedure is documented for D1 operational records.
- Refund/support email is `llumendestiny@gmail.com` and must be monitored before paid launch.
- Error logging must not contain raw secrets.
- Deployment rollback method is documented.
- Release/status documents must reflect enabled/disabled features accurately.

## 8. Current launch rule

### Engineering-side V1 gates already evidenced PASS
1. V1 scope lock.
2. Production route smoke.
3. Core Saju + compatibility runtime journeys.
4. Six-language core coverage.
5. Six-language Guardian preview/gift journeys.
6. Rendered mobile audit.
7. Rendered legal/support localization.
8. Rendered accessibility audit.
9. Payment-flow safety / fail-closed architecture.
10. Security, schema, flag-integrity and SEO release audits.

### Remaining HOLD gates
1. Real iOS physical-device UX verification.
2. Real Android physical-device UX verification.
3. PG/provider business-category approval.
4. KYC and settlement approval.
5. Provider sandbox acceptance suite.
6. Production credentials/webhook/refund mapping.
7. TEST MODE off and explicit public checkout arm only after every payment gate is green.

Do not switch a manual verification flag to true simply to clear the gate. Public real payment must remain disabled until the external evidence chain is complete.
