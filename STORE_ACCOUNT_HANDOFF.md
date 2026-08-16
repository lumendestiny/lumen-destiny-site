# Lumen Destiny V1 — Store Account Handoff

Updated: 2026-08-16

This document is the final account-side handoff between engineering-ready builds and store upload/submission. It intentionally does not activate real payment or bypass any existing privacy/D1/PG HOLD gate.

## Current engineering status
- Android physical-device acceptance: PASS (Issue #3 closed).
- Android API 36 release AAB engineering build: PASS.
- Android signed Play AAB workflow: prepared; waits for upload-key secrets.
- iOS simulator build: PASS.
- iOS Xcode 26+ unsigned Release Archive: PASS.
- iOS Privacy Manifest / App Store export template: present.
- iOS signed App Store archive/IPA workflow: prepared; waits for Apple signing secrets.
- Real iPhone acceptance: OPEN (Issue #4).

## Google Play — required secure values
Configure these as GitHub Actions secrets only; never commit them to the repository:
- `ANDROID_KEYSTORE_BASE64` — base64-encoded permanent upload keystore.
- `ANDROID_KEYSTORE_PASSWORD` — keystore password.
- `ANDROID_KEY_ALIAS` — upload-key alias.
- `ANDROID_KEY_PASSWORD` — key password.

After they are present, run `.github/workflows/android-v1-signed-release.yml` manually. Expected artifact: signed `Lumen-Destiny-V1-Play-Upload.aab` for package `com.lumendestiny.app`.

## Apple App Store — required secure values
Configure these as GitHub Actions secrets only:
- `APPLE_DISTRIBUTION_P12_BASE64` — base64-encoded Apple Distribution .p12.
- `APPLE_DISTRIBUTION_P12_PASSWORD` — .p12 password.
- `APPLE_PROVISIONING_PROFILE_BASE64` — base64-encoded App Store provisioning profile for `com.lumendestiny.app`.
- `APPLE_TEAM_ID` — Apple Developer Team ID.

After they are present, run `.github/workflows/ios-v1-signed-release.yml` manually. Expected outputs: signed App Store archive and exported IPA artifact.

## Account-side store records still required
### Google Play Console
- Create app record for Lumen Destiny / `com.lumendestiny.app`.
- Upload final signed AAB.
- Complete store listing, icon, feature graphic and screenshots.
- Complete Data safety, privacy-policy URL, ads declaration, app access, target audience/content, content rating and developer contact.
- Confirm whether the linked developer account is subject to closed-testing production-access requirements.

### App Store Connect
- Create app record for Lumen Destiny / `com.lumendestiny.app`.
- Upload signed build through the approved Apple upload path.
- Complete subtitle/description/keywords/support URL/privacy-policy URL/review contact.
- Complete App Privacy and age rating.
- Attach iPhone screenshots and final 1024x1024 app icon source.
- Run one real iPhone acceptance pass before review submission.

## Contact / support
- Support email: llumendestiny@gmail.com
- Product website: https://lumendestiny.com/
- Privacy-policy URL must point to the final public Lumen Destiny privacy page and be verified live immediately before submission.

## Final submission boundary
Do not press the Google Play production publish/review action or Apple `Add for Review` / `Submit for Review` action until:
1. Android PASS remains valid after final signed build.
2. iPhone Issue #4 is PASS.
3. Final icon/screenshots are approved.
4. Store privacy declarations match the exact production data flow.
5. Existing production privacy/D1/payment gates are in the intended state.
