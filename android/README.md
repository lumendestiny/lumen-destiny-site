# Lumen Destiny Android V1 Test Shell

This directory packages the existing production mobile web experience at `https://lumendestiny.com/` inside a minimal Android WebView shell for physical-device V1 testing.

## Current intent

- Test APK only; not a Play Store release artifact.
- Loads the production Lumen Destiny domain over HTTPS.
- Keeps Lumen Destiny pages in-app and opens non-Lumen external links with the Android handler.
- Blocks cleartext traffic and mixed content.
- Enables DOM storage required by the current temporary-session handoff used by V1 free readings.
- Debug package id: `com.lumendestiny.app.debug`.

## Build

GitHub Actions workflow: `.github/workflows/android-v1-apk.yml`.

The workflow builds `app-debug.apk`, renames it to `Lumen-Destiny-V1-Test.apk`, and uploads it as the `Lumen-Destiny-V1-Test-APK` artifact.

## V1 device verification

Use the repository `PHYSICAL_DEVICE_RELEASE_CHECKLIST.md` after installing the generated APK. Real payment must remain disabled while the separate provider/KYC/production gates are HOLD.
