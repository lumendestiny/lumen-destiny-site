# Lumen Destiny V1 — Store Submission Readiness

Updated: 2026-08-16

This document tracks preparation up to, but not including, the final Apple App Store / Google Play submission action.

## Shared V1 scope

Store V1 follows the frozen public scope in `V1_RELEASE_STATUS.md`: free Saju/Four Pillars, fortune result pages, compatibility, and LUMEN GUARDIAN archive/personalization/gifting/verification/payment-ready flow. Face reading/photo upload and 1:1 AI consultation remain excluded.

Real payment must remain closed until the separate PG/KYC/privacy/D1/payment gates are complete.

## Android

Engineering readiness:
- Test APK pipeline: PASS.
- Test package: `com.lumendestiny.app.debug`.
- Production package reserved in source: `com.lumendestiny.app`.
- Store-release source targets Android API 36.
- Release-candidate AAB validation is built separately from the physical-device test APK.

Before Google Play upload:
- Complete real Android physical-device checklist and record evidence.
- Create/secure the permanent Play upload key or configure Play App Signing as appropriate.
- Configure CI signing secrets outside the public repository; never commit a keystore/password.
- Produce the signed production AAB and preserve signing-key recovery material securely.
- Complete Play Console app record, store listing, screenshots/icon/feature graphic, category/contact information.
- Complete Data safety, privacy-policy URL, ads declaration, app access, target audience/content, content rating and any applicable sensitive-permission declarations.
- Confirm developer-account identity/organization verification requirements.
- If the developer account is a newly created personal account subject to Google Play's production-access testing requirement, complete the required closed testing before requesting production access.

## iOS

Engineering readiness:
- Native iOS project definition and WKWebView-based shell exist.
- Native navigation includes back, refresh and system share controls.
- CI simulator build validates source without signing.
- Production bundle identifier reserved in source: `com.lumendestiny.app`.

Before App Store Connect upload:
- Build/archive with a currently accepted Xcode/iOS SDK.
- Configure the Apple Developer team, Distribution signing and provisioning in the authorized Apple account.
- Complete one real iPhone physical-device journey and record evidence.
- Create App Store Connect app record and fill name/subtitle/category/support URL/privacy-policy URL/review contact.
- Complete App Privacy disclosures based on actual V1 data flows, including data processed through embedded web content where applicable.
- Prepare required App Store screenshots and app icon assets.
- Verify age rating and review notes.
- Reassess App Review Guideline 4.2: the submitted binary must provide sufficient app-like value beyond a repackaged website. Native toolbar controls alone are not treated as proof that 4.2 is satisfied.

## Existing operational HOLD gates

Do not reinterpret store packaging as completion of the existing V1 operational gates. The following remain independently controlled by `V1_RELEASE_STATUS.md`:
- Privacy operational evidence.
- Live Production D1 authenticated preflight and backup/restore rehearsal.
- External PG business approval/KYC/sandbox/production credentials.
- Real payment cutover.
- Physical-device evidence.

## Final handoff boundary

The repository is considered "submission-prepared" only when engineering builds are green, real Android+iPhone evidence is recorded, store metadata/privacy declarations/assets are complete, and account-specific signing is configured. The final irreversible/user-account actions are the actual upload/submission/review buttons in Google Play Console and App Store Connect.
