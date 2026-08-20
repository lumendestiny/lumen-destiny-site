# Lumen Destiny — Store Release & Payments Plan

## Release tracks

### Google Play
1. Keep closed testing active until the required period is satisfied.
2. Stabilize Android V10 and record tester feedback/fixes.
3. Apply for Production access.
4. Submit the final Production release only after payment architecture and store compliance are ready.

### Apple App Store
1. Prepare iOS V1 from the shared Capacitor codebase.
2. Connect Apple Developer / App Store Connect, Bundle ID, signing certificates and provisioning.
3. Validate on iPhone and TestFlight.
4. Prepare App Store metadata, privacy disclosures, review notes and demo account if required.
5. Submit to App Review after payment architecture and store compliance are ready.

## Payment architecture

### Website
- External PG can be connected for website purchases.
- Connect the real PG after core UI/feature testing is stable, but before final production launch.
- Before enabling live payments, test sandbox/staging payment flows, success/failure/cancel/refund handling, receipts, order status, and webhook idempotency.

### Android app
- Digital content/features sold and consumed in the Android app should be designed around Google Play Billing unless a permitted regional/program exception applies.
- Do not simply embed the website PG checkout into the Android app for digital goods without store-policy review.
- Physical goods or offline services can generally use an external PG, subject to applicable policy and law.

### iOS app
- Digital content/features sold and consumed in the iOS app should be designed around Apple In-App Purchase unless an applicable entitlement/regional exception applies.
- Do not simply embed the website PG checkout into the iOS app for digital goods without App Store policy review.
- Physical goods or services consumed outside the app can generally use an external PG, subject to applicable policy and law.

## Recommended timing

1. Finish core functional testing first.
2. Decide payment product classification now (digital vs physical/service) because it affects app architecture and store approval.
3. Build/test store-native purchase flows before final store submission.
4. Connect the website live PG near the end of testing, after staging/sandbox validation.
5. Run end-to-end payment tests before production launch.

## Lumen Destiny product note

- Digital talismans/Guardian digital images are treated as digital content for store-design purposes and should be reviewed for Play Billing / Apple IAP compliance before store submission.
- Any future physical talisman shipment can use external PG checkout where store rules permit, because fulfillment occurs outside the app.
