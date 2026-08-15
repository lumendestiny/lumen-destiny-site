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
| Core language coverage | PASS | KO / EN / JA / TL / VI / ZH static coverage audit. |
| Legal/support language coverage | PASS | Terms, Refund/Cancellation, Privacy and Support are wired for all six languages. |
| Rendered legal pages | PASS | Chromium runtime audit verifies localized headings, no Korean body/footer leakage on non-Korean pages, language-preserving internal links and 390px layout. |
| Payment flow safety | PASS | Static payment-flow audit locks policy consent, server-confirmed issuance, duplicate/refund handling and fail-closed public-payment gates. |
| Public real payment | HOLD | Must remain disabled until PG approval, KYC, provider sandbox verification, production credentials, TEST MODE off and explicit public checkout arm are all evidenced. |
| Mobile static audit | PASS | Existing CSS/static mobile audit. |
| Mobile rendered audit | RETESTING | Chromium 320/360/390/430px audit found real issues; header/layout/font/Chinese-loop fixes are committed and a settled-production retest is running. |
| Guardian preview journey | RETESTING | Chromium archive → order preview and gift → recipient preview flows are running without creating server orders/payments. |
| Accessibility rendered audit | RETESTING | Serious/critical WCAG browser audit added; first run exposed an audit-context bug, which is fixed, and the corrected run is pending/running. |
| Security release audit | PASS | Existing security release workflow. |
| Guardian D1 schema audit | PASS | Existing schema workflow. |
| Flag integrity audit | PASS | Existing flag-integrity workflow. |
| SEO release audit | PASS | Existing SEO workflow, with consultation excluded from V1 indexing. |

## Mobile issues discovered by real browser rendering and fixed

The first Chromium mobile audit caught issues that static CSS inspection did not reliably expose:
- Brand and six language flags could fall out of the intended same-row mobile header layout.
- Some mobile form controls rendered below 16px.
- Guardian verification could render its header as `relative` instead of sticky.
- Chinese Guardian order/checkout mutation observers could repeatedly mutate text and stall the page.
- The audit itself counted hidden zero-height actions as touch-target failures; the audit now evaluates visible controls only.

The corresponding CSS/runtime fixes are committed. PASS is intentionally withheld until the new rendered audit completes successfully.

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
   - 320 / 360 / 390 / 430px references are automated, but at least one real iOS and one real Android device should still be manually checked for touch, keyboard, browser chrome and visual quality.

2. **PG business approval / KYC**
   - Written business/category approval
   - KYC/business verification
   - Provider sandbox suite
   - Production credentials/account activation

3. **Real payment cutover**
   - TEST MODE off
   - Provider webhook/refund mapping verified against the approved account
   - All payment release gates green
   - Explicit `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED=true` only as the final arm step

## Current release posture

The remaining release risk is concentrated in **rendered mobile/accessibility evidence and external payment-provider approval**, rather than missing core V1 product structure. Do not open real customer payment until the external evidence chain is complete.
