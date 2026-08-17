# Lumen Destiny Android AAB setup

This branch prepares the existing Lumen Destiny web application for Android packaging with Capacitor.

## Required before the first Play Console upload

1. Confirm the **exact package name/applicationId** already registered for Lumen Destiny in Google Play Console.
2. Run the GitHub Actions workflow **Build Android AAB** and enter that exact package name in the `app_id` input.
3. Configure a persistent Android upload key before uploading a release AAB to Google Play.

### GitHub Actions signing secrets

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_KEY_ALIAS`

The upload key must be preserved and reused for future releases. Never commit the keystore or passwords to the repository.

## Android target level

The workflow explicitly sets `compileSdkVersion` and `targetSdkVersion` to API 36 so the project is ready for Google Play's Android 16 target requirement beginning August 31, 2026.

## Build output

The workflow uploads this artifact:

`android/app/build/outputs/bundle/release/app-release.aab`

If signing secrets are configured, the bundle is signed with the persistent upload key. Without those secrets the workflow can still create the release bundle, but that unsigned bundle must be signed before it can be uploaded to Google Play.
