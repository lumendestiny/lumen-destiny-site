# Lumen Destiny V1 — Store Asset Production Spec

Updated: 2026-08-16

This file defines the exact deliverables to produce from real V1 app screens after physical-device acceptance. Do not create misleading mock functionality or show features outside the submitted V1 scope.

## Shared creative direction

- Brand name: Lumen Destiny / 루멘 명운.
- Use real in-app screens from the release candidate.
- Prioritize the V1 journeys: Saju/Four Pillars, results, compatibility, LUMEN GUARDIAN archive/personalization/gifting/verification.
- Do not show face reading/photo upload or 1:1 AI consultation while those features remain outside V1.
- Do not imply that real payment is active while payment production gate remains HOLD.
- Keep claims descriptive, not predictive guarantees. Avoid phrases implying guaranteed wealth, health, exam success, marriage, or other outcomes.

## Google Play

### Store icon
- 512 x 512 px.
- 32-bit PNG with alpha.
- Maximum 1024 KB.
- No ranking, pricing, Play badges, or misleading promotional text.

### Phone screenshots
Prepare at least 6 portrait screenshots from the accepted Android build, all using one consistent presentation system. Google requires at least two screenshots to publish; six are planned for stronger coverage.

Recommended capture/story order:
1. Home / core service entry.
2. Saju input and result context.
3. A representative long-form Saju result section.
4. Compatibility result.
5. LUMEN GUARDIAN archive/detail.
6. Personalization/gifting/verification flow.

Export constraints:
- JPEG or 24-bit PNG, no alpha.
- 320–3840 px per dimension.
- Prefer portrait 9:16 presentation suitable for recommendation surfaces.
- Screenshot must accurately reflect the current submitted app.

### Feature graphic
Prepare one Play feature graphic after the final brand key art is approved. Keep the key subject and title inside a conservative central safe zone so automated crops do not remove critical information.

## Apple App Store

### App icon
- Add the approved Lumen Destiny icon to the Xcode asset catalog / Icon Composer output.
- The icon ships inside the uploaded build; no separate legacy App Store icon upload is assumed.

### iPhone screenshots
Prepare 6 portrait screenshots from the accepted iPhone build, using the same story order as Android where possible.

Primary required set target:
- iPhone 6.9-inch accepted portrait size, using an Apple-accepted current size such as 1260 x 2736, 1290 x 2796, or 1320 x 2868 px.
- PNG/JPEG/JPG; no alpha/transparency.
- App Store Connect accepts 1–10 screenshots.

If the UI differs materially by locale, create localized sets. Otherwise use highest-resolution required assets and let App Store Connect scale to smaller display classes where supported.

## Capture acceptance gate

Do not produce final store screenshots until:
- Android physical-device test is PASS.
- iPhone physical-device test is PASS.
- Final store release UI is frozen.
- App icon/key art is approved.
- Privacy and payment-visible states match the build submitted for review.

## Required handoff files

Target final asset package:
- `store-assets/google/icon-512.png`
- `store-assets/google/feature-graphic.png`
- `store-assets/google/phone-01..06.(png|jpg)`
- `store-assets/apple/iphone-01..06.(png|jpg)`
- source/master key art retained separately for future localization and size variants.
