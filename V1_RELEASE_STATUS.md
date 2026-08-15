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

## Automated gates

| Area | Status | Evidence / rule |
|---|---|---|
| V1 scope lock | PASS | `/consult` redirects to home; public consultation API requires a separate future flag; production smoke requires `consult=false`. |
| Production route smoke | PASS | Core V1 and public legal/support URLs are checked across all six languages. |
| Core V1 Saju + compatibility runtime | PASS | Chromium completed 12/12 KO / EN / JA / TL / VI / ZH form → result journeys with populated Saju/compatibility results and 390px fit. |
| Free-reading private-input runtime | PASS | Chromium completed 12/12 KO / EN / JA / TL / VI / ZH Saju/compatibility journeys with private input absent from network URLs, result URL/session cleanup after success, and public Guardian verification source excluding gift/private-token fields. |
| Core language coverage | PASS | KO / EN / JA / TL / VI / ZH static coverage audit, including shared recovery UI. |
| Legal/support language coverage | PASS | Terms, Refund/Cancellation, Privacy and Support are wired for all six languages. |
| Rendered legal pages | PASS | Chromium runtime audit verifies localized headings, no Korean body/footer leakage on non-Korean pages, language-preserving internal links and 390px layout. |
| Recovery/error runtime | PASS | Chromium exercised offline and temporary-error UI in KO / EN / JA / TL / VI / ZH and verified localized actions, language-preserving home links and mobile-safe layout. |
| Payment flow safety | PASS | Static payment-flow audit locks policy consent, server-confirmed issuance, duplicate/refund handling and fail-closed public-payment gates. |
| Public real payment | HOLD | Must remain disabled until PG approval, KYC, provider sandbox verification, production credentials, TEST MODE off and explicit public checkout arm are all evidenced. |
| Mobile static audit | PASS | Existing CSS/static mobile audit. |
| Mobile rendered audit | PASS | Chromium completed 144 route/language/width combinations across 320/360/390/430px with no page-level horizontal overflow, stable six-language header state, sticky navigation, safe visible mobile form sizing and localized Guardian checkout policy links. |
| Guardian preview journey | PASS | Chromium completed 12 preview flows: 20-card archive → personalized preview and gift → recipient preview across all six languages, without creating server orders or payments. |
| Accessibility rendered audit | PASS | Chromium + axe found no remaining serious/critical WCAG 2.0/2.1 A/AA violations on tested KO/EN V1 pages after contrast/select-name fixes; localized skip link can be focused and activated. |
| Security release audit | PASS | Existing security release workflow. |
| Guardian D1 schema audit | PASS | Existing schema workflow. |
| Flag integrity audit | PASS | Existing flag-integrity workflow. |
| SEO release audit | PASS | Existing SEO workflow, with consultation excluded from V1 indexing. |
| Privacy operational release gate | HOLD | Free-reading minimization now has automated evidence, but final Guardian/payment retention periods, deployed sensitive-log review, real deletion-request handling and privacy environment flags still require operational evidence. |

## Free-reading privacy hardening completed

- Free Saju and compatibility form inputs now use a temporary browser-session handoff rather than intentionally placing names/birth inputs in the initial result-page network URL.
- Existing calculation modules are preserved by reconstructing their legacy query only inside browser history state, without a second network request carrying the private fields.
- Result pages use `referrer=no-referrer` while the compatibility bridge exists.
- After a successful calculation, the temporary session record is removed and the result URL is reduced back to the language parameter.
- Saved handoffs older than 30 minutes are not reused by the bridge.
- The dedicated Privacy Runtime Audit verifies all six supported languages for both Saju and compatibility.
- `V1_DATA_INVENTORY.md` now records current browser/D1 data classes and separates technical cleanup evidence from legal/provider retention decisions.

This PASS is **not** permission to mark the entire privacy release gate ready. Guardian/payment retention, deletion operations and deployed logging evidence remain separate HOLD items.

## Mobile issues discovered by real browser rendering and fixed

The Chromium mobile audit caught issues that static CSS inspection did not reliably expose:
- Brand and six language flags could fall out of the intended same-row mobile header layout.
- Some mobile form controls rendered below 16px.
- Guardian verification could render its header as `relative` instead of sticky.
- Chinese Guardian order/checkout mutation observers could repeatedly mutate text and stall the page.
- The audit itself counted hidden zero-height actions as touch-target failures; the audit now evaluates visible controls only.

The corresponding header/flag alignment, Guardian verify sticky behavior, Chinese observer loop, audit-visibility and mobile form sizing fixes are committed. The final 144-combination rendered audit passed at 320/360/390/430px across all six supported languages and all six tested core/Guardian routes.

## Error/recovery hardening completed

- Shared offline/temporary-error UI now has KO / EN / JA / TL / VI / ZH copy.
- Chinese no longer falls back to generic English recovery text.
- The recovery runtime audit opens each language on a mobile viewport, exercises offline and error states, checks action labels, confirms the home link preserves language and verifies the recovery UI does not create page-level horizontal overflow.

## Guardian checkout hardening completed

- Policy/refund/terms consent is localized for KO / EN / JA / TL / VI / ZH.
- Consent is checked before showing checkout review and checked again immediately before the checkout API call.
- Chinese checkout and payment-result UI have explicit translations.
- Chinese payment-result text traversal no longer aborts on blank text nodes.
- Chinese Guardian mutation observers only write when text actually changes, preventing self-trigger loops.
- Public real checkout remains fail-closed until external PG evidence is complete.

## Public policy/support localization completed

The Korean source content for the following public pages is now represented in EN / JA / TL / VI / ZH as well as KO, while preserving the original V1 policy framing:
- Terms of Use
- Refund & Cancellation Policy
- Privacy Policy
- Support

These translations do not change the underlying business/legal policy. Final country-specific legal review may still be required before paid commercial launch.

## Manual / external HOLD items

These items must not be auto-marked PASS:

1. **Physical-device UX verification**
   - 320 / 360 / 390 / 430px browser references are automated and PASS, but at least one real iOS and one real Android device must still be manually checked for touch, keyboard, browser chrome, rotation/resume and visual quality.

2. **Privacy operational evidence**
   - Finalize Guardian/payment retention periods and deletion/anonymization triggers after the actual merchant/provider/legal obligations are known.
   - Review deployed Cloudflare/Functions logs during success and forced-error cases for birth inputs, gift messages and secrets.
   - Run one real end-to-end privacy/deletion request through `llumendestiny@gmail.com` and the deployed operations process.
   - Reconcile the final public privacy wording with that approved retention/operations process.
   - Set privacy environment flags only after each evidence item is complete and require authenticated `/api/admin/privacy-gate` to report ready.

3. **PG business approval / KYC**
   - Written business/category approval
   - KYC/business verification
   - Provider sandbox suite
   - Production credentials/account activation

4. **Real payment cutover**
   - TEST MODE off
   - Provider webhook/refund mapping verified against the approved account
   - All payment and privacy release gates green
   - Explicit `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED=true` only as the final arm step

## Current release posture

Core Saju/compatibility, free-reading privacy minimization, six-language Guardian preview journeys, rendered mobile layouts, legal/support localization, shared recovery UX and rendered accessibility now have PASS evidence.

The remaining launch HOLD items are no longer unresolved core V1 page implementation. They are:
- real iOS/Android physical-device verification,
- privacy operational/retention/logging/deletion evidence,
- payment-provider approval/KYC/sandbox/production credential chain.

Do not open real customer payment until the external payment evidence and the applicable privacy operational gates are complete.
