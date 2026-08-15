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
- Guardian public verification source excludes gift message, giver/recipient private fields and the private verification token from its public response contract.
- Core Saju/compatibility functionality remains PASS after the privacy hardening.

`V1_DATA_INVENTORY.md` documents the current browser and D1 data classes.

### Operational/config evidence — HOLD
Do not mark the overall privacy release ready yet. Still verify:

- Final Guardian/payment/checkout/policy retention periods and deletion/anonymization triggers.
- One real privacy/deletion request through `llumendestiny@gmail.com` and the deployed operations process.
- Deployed Cloudflare/Functions logs during success and forced-error cases do not expose birth data, personal gift messages or secrets.
- Final public privacy policy wording matches the approved retention/operations process.

Environment flags remain manual evidence gates:

- `LUMEN_PRIVACY_POLICY_FINALIZED`
- `LUMEN_FACE_PHOTO_EPHEMERAL_VERIFIED` — not a V1 launch dependency while face reading remains disabled; do not set it merely to clear a gate.
- `LUMEN_DATA_RETENTION_VERIFIED`
- `LUMEN_DELETE_REQUEST_FLOW_VERIFIED`
- `LUMEN_SENSITIVE_LOGGING_VERIFIED`

Use `PRIVACY_RELEASE_CHECKLIST.md` for the evidence sequence. Set flags true only after the corresponding deployed/operational evidence exists.

## 4. Error/recovery UX — AUTOMATED PASS + PHYSICAL SPOT CHECK

Automated evidence now covers:
- Friendly localized 404 recovery page.
- Shared offline/temporary-error recovery UI in KO / EN / JA / TL / VI / ZH.
- Runtime exercise of offline and error states on a 390px mobile viewport.
- Localized recovery action labels and language-preserving home link.
- No page-level horizontal overflow caused by the recovery panel.
- Core result watchdog/retry paths remain present.
- Guardian payment states continue to be covered by payment-flow/production smoke gates.

Real iOS/Android review should still confirm browser-native offline/keyboard behavior feels usable.

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
- Guardian decorative CSS motion respects reduced-motion preference; any live image/media motion should also be checked on a physical device where applicable.
- Real-device zoom/keyboard behavior does not create an accessibility regression.

## 7. Operational readiness
- Admin Guardian dashboard works only with Internal Secret.
- Production real customer payment remains disabled until the external payment gate is complete.
- Backup/export procedure is documented for D1 operational records.
- A real backup export and non-production restore rehearsal still require operations evidence before they should be called verified.
- Refund/support email is `llumendestiny@gmail.com` and must be monitored before paid launch.
- Error logging must not contain raw secrets; deployed log review remains part of the privacy HOLD gate.
- Deployment rollback method is documented.
- Release/status documents must reflect enabled/disabled features accurately.

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
9. Rendered accessibility audit.
10. Recovery/error runtime audit.
11. Payment-flow safety / fail-closed architecture.
12. Security, schema, flag-integrity and SEO release audits.

### Remaining HOLD gates
1. Real iOS physical-device UX verification.
2. Real Android physical-device UX verification.
3. Privacy retention/anonymization finalization for Guardian/payment records.
4. Real deletion-request rehearsal and deployed sensitive-log review.
5. D1 operational backup/restore rehearsal where required for launch operations.
6. PG/provider business-category approval.
7. KYC and settlement approval.
8. Provider sandbox acceptance suite.
9. Production credentials/webhook/refund mapping.
10. TEST MODE off and explicit public checkout arm only after every payment/privacy gate is green.

Do not switch a manual verification flag to true simply to clear the gate. Public real payment must remain disabled until the external payment and applicable privacy evidence chains are complete.
