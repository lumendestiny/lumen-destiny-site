# Lumen Destiny V1 — Release Candidate Gate

Candidate branch: `agent/android-v1-apk`

## Verified
- Android physical-device acceptance: PASS (Issue #3).
- Android V1 test APK build: PASS.
- Android API 36 release AAB engineering validation: PASS.
- iOS simulator build: PASS.
- iOS Xcode 26+ unsigned Release Archive validation: PASS.
- Experience Release Audit: PASS after auth-expanded health-scope compatibility update.
- Cloudflare Pages preview deployment: PASS for the latest candidate commit.

## Open release gates
- Cloudflare Workers Build failure must be explained/resolved or confirmed as stale/duplicate integration (Issue #5).
- One real iPhone acceptance pass (Issue #4).
- Final approved app icon/key art and store screenshots.
- Google Play permanent upload key / CI secrets and signed production AAB.
- Apple Developer Team / Distribution certificate / provisioning and signed App Store archive/IPA.
- Final Google Play Data Safety and Apple App Privacy answers based on production data flows.
- Store account records, age/content ratings, review contact, and review metadata.

## Safety holds
- Real payment remains disabled until PG/KYC/provider/production cutover gates are separately approved.
- Do not represent payment as live in review notes or screenshots while the payment gate is HOLD.

## RC rule
Do not merge this release branch into `main` or submit to a store while an unexplained release check is red. Account-specific signing/upload/submission remains a separate explicit release action.
