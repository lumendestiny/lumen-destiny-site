# Lumen Destiny — Non-payment Release Checklist

Updated: 2026-08-12

This checklist covers launch readiness outside payment-provider approval.

## 1. Mobile UX
- Test 360/375/390/412px widths.
- No horizontal clipping in header, language bar, forms, result cards, Guardian pages, policy pages or admin pages.
- Sticky header/language bar must not cover first content block.
- Inputs and date selectors remain usable with Android/iOS keyboards.
- Buttons have adequate touch area and no accidental overlap.
- Long translated strings wrap without pushing controls off-screen.

## 2. Multilingual completeness
For KO/EN/JA/TL/VI verify:
- Home/navigation/language bar.
- Saju, compatibility and face-reading input labels/placeholders.
- Validation errors and loading states.
- Result headings, explanatory blocks and action buttons.
- Guardian catalog/order/checkout/result/verification states.
- Refund/cancellation notice shown before payment.
- New functionality must use translation keys rather than hard-coded Korean strings.

## 3. Privacy/data handling
Do not mark complete from design intent alone. Verify actual runtime behavior.
- Privacy policy reflects actual data flow.
- Face-reading original photo is not retained after processing unless separately consented.
- Saju/compatibility/consultation/Guardian data has documented purpose and retention period.
- User deletion request workflow is operational.
- Sensitive personal inputs and secrets are not unnecessarily written to logs.
- Guardian payment/order records retain only what is operationally/accounting necessary.

Environment flags are intentionally manual evidence gates:
- LUMEN_PRIVACY_POLICY_FINALIZED
- LUMEN_FACE_PHOTO_EPHEMERAL_VERIFIED
- LUMEN_DATA_RETENTION_VERIFIED
- LUMEN_DELETE_REQUEST_FLOW_VERIFIED
- LUMEN_SENSITIVE_LOGGING_VERIFIED

Set them true only after runtime verification.

## 4. Error/recovery UX
- Friendly 404 page with home/service navigation.
- API/network error messages do not expose stack traces or secrets.
- Retry paths exist for AI/readings where safe.
- Guardian payment pending screen warns against duplicate payment.
- Failed/cancelled/expired/refund states have clear next actions.
- Maintenance/offline state remains readable on mobile.

## 5. SEO/share/public discovery
- Public pages have unique title/description.
- Admin/test/review pages remain noindex.
- robots.txt and sitemap include only intended public pages.
- Open Graph/share image and canonical URL are set for public landing pages.
- Structured data must describe the service accurately and avoid guaranteed-outcome claims.
- AI Discovery Layer files/pages must not expose internal APIs or secrets.

## 6. Accessibility/basic quality
- Form labels are associated with inputs.
- Keyboard navigation works for navigation and language controls.
- Visible focus state exists.
- Images have meaningful alt text or empty alt when decorative.
- Contrast/readability acceptable on mobile and desktop.
- Motion, if added to premium Guardian, should respect reduced-motion preference.

## 7. Operational readiness
- Admin Guardian dashboard works only with Internal Secret.
- Production TEST MODE is off.
- Backup/export procedure documented for D1 operational records.
- Refund/support email is monitored.
- Error logging does not contain raw secrets.
- Deployment rollback method is documented.
- Status page reflects enabled/disabled features accurately.

## 8. Launch rule
Payment readiness is necessary but not sufficient. Final release should require:
1. PAYMENT RELEASE READY
2. SECURITY RELEASE READY
3. PRIVACY RELEASE READY
4. PG/KYC/Sandbox/Production readiness
5. Manual mobile/multilingual smoke test complete

Do not switch a manual verification flag to true simply to clear the gate.