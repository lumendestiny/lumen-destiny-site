# Lumen Destiny V1 — Physical Device Release Checklist

Updated: 2026-08-15

This checklist is the manual evidence gate that remains after the rendered Chromium mobile audit passes.

Do not mark this gate PASS from desktop emulation alone. At least one real iOS device and one real Android device must be checked on the production domain.

## PASS rule

Physical-device UX verification becomes PASS only when:

- One real iPhone / iOS browser session is completed.
- One real Android / Chrome browser session is completed.
- No blocking issue is found in the required V1 customer journeys below.
- Keyboard opening/closing, browser chrome, touch behavior and page scrolling are usable.
- Real customer payment remains disabled while PG/KYC/sandbox/production credentials are not approved.

Record device model, OS version, browser version, date and tester name in the evidence table at the bottom.

## 1. Production start state

Open `https://lumendestiny.com` in a fresh private/incognito session.

Verify:

- The home page loads without a certificate/privacy warning.
- No horizontal page overflow is visible.
- The Lumen Destiny brand and six language controls remain usable.
- The header does not cover the first content block when scrolling.
- Public navigation does not expose 1:1 AI consultation or face-reading in V1.
- Browser back/forward navigation does not leave the page in a broken state.

## 2. Language controls

Check all six languages at least once on each device:

- KO — Korean
- EN — English
- JA — Japanese
- TL — Tagalog
- VI — Vietnamese
- ZH — Simplified Chinese

Verify:

- The active language is visually identifiable.
- Selecting a language does not create a blank page or endless loading state.
- Navigation, core form labels and Guardian entry points change language.
- Long translated text wraps without clipping controls.
- Language selection persists when moving through the tested journey.

A complete duplicate journey in all six languages is not required on both physical devices because automated six-language runtime coverage already exists. The manual purpose here is to detect device/browser-specific rendering and interaction problems.

## 3. Free Saju journey

On each device:

1. Open the free Saju form.
2. Tap each input/select control.
3. Enter a valid name/date/time combination.
4. Open and close the software keyboard where applicable.
5. Submit the form.
6. Reach the populated result page.
7. Scroll through the result content and use at least one result navigation/action link.

Verify:

- Input text is comfortably readable without browser auto-zoom.
- Date/time/select controls are not cut off.
- The keyboard does not permanently cover the submit button.
- Submit does not require repeated taps.
- Result cards fit the viewport.
- Sticky navigation remains usable after keyboard dismissal.

## 4. Compatibility journey

On each device:

1. Open compatibility.
2. Complete both-person input data.
3. Submit.
4. Reach a populated compatibility result.

Verify:

- Both data-entry sections remain distinguishable.
- Keyboard switching between fields is usable.
- No field becomes inaccessible after scrolling.
- Result content does not overflow horizontally.

## 5. Guardian archive and personalization

On each device:

1. Open the Guardian archive.
2. Scroll through the current collection.
3. Open at least one Guardian design.
4. Move into personalization/order preparation.
5. Change tier and wish type.
6. Enter display name and wish text.
7. Generate the issuance preview.

Verify:

- Cards/images load at acceptable visual quality.
- No card overlaps another card or the page edge.
- Tier and wish-type selectors remain readable.
- Textarea typing/scrolling works normally.
- Preview updates without freezing or endless mutation/loading.
- Policy/terms/refund links are readable and tappable.
- The policy checkbox has an adequate touch target.

## 6. Guardian gift journey

On at least one of the two devices:

1. Enter gift mode.
2. Enter sender and recipient names.
3. Add a gift message.
4. Generate the recipient-facing preview.

Verify:

- Gift fields are not hidden behind the keyboard.
- Sender/recipient/message values remain intact through preview.
- Recipient presentation is visually clear.
- No real paid order or issuance is accidentally triggered by this manual preview test.

## 7. Guardian verification

On each device:

- Open the public Guardian verification page.
- Verify header/navigation remains sticky and usable.
- Test a valid test/reference identifier if one is available without creating a real customer payment.
- Test a clearly invalid identifier.

Verify:

- Invalid state is understandable and does not expose internal errors.
- Page does not jump, freeze or horizontally overflow.

## 8. Public legal/support pages

Open at least Terms, Refund/Cancellation, Privacy and Support on each device.

Verify:

- Page is readable at default zoom.
- Footer/internal links are tappable.
- Changing language does not revert the body to Korean unexpectedly.
- Support email is visible and correctly spelled as `llumendestiny@gmail.com`.

## 9. Payment safety assertion

This is a required negative test while payment-provider approval is still HOLD.

Verify:

- The site does not permit an uncontrolled real customer charge.
- Any payment-ready/review UI remains behind the intended release gates.
- No test/mock completion endpoint is reachable as an ordinary public customer.
- No secret, API key, webhook secret or internal diagnostic output is shown in the browser.

Do not turn on `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED` for physical UX testing.

## 10. Rotation and interruption checks

On each device:

- Rotate portrait -> landscape -> portrait once on a form or result page.
- Background the browser and return.
- Open then dismiss the keyboard several times.
- Scroll rapidly through one long result/legal page.

Verify:

- Content does not remain permanently zoomed or offset.
- Sticky header recovers correctly.
- Form values are not unexpectedly erased.
- No duplicate submit/payment action occurs after resume.

## 11. Blocking defects

Treat any of the following as FAIL until corrected and retested:

- Page cannot be loaded or submitted.
- Core content is horizontally inaccessible.
- Required form field cannot be reached because of keyboard/browser UI.
- Language control becomes unusable.
- Guardian preview freezes or repeatedly mutates.
- Policy/refund link cannot be opened before the payment-ready step.
- Real payment can be charged before the external payment gate is approved.
- Internal secret, stack trace or credential is exposed.

Minor visual differences that do not affect comprehension, navigation, input, policy access or safety may be recorded as non-blocking polish items.

## Evidence table

| Device | OS | Browser | Date | Tester | Saju | Compatibility | Guardian | Legal/support | Payment safety | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| iPhone / iOS |  |  |  |  | HOLD | HOLD | HOLD | HOLD | HOLD | HOLD |
| Android |  |  |  |  | HOLD | HOLD | HOLD | HOLD | HOLD | HOLD |

## Release status update rule

Only after both physical-device rows are PASS:

1. Change `Physical-device UX verification` from HOLD to PASS in `V1_RELEASE_STATUS.md`.
2. Do not change `Public real payment` from HOLD unless the separate PG/KYC/sandbox/production credential chain is complete.
3. Keep consultation and face-reading excluded from V1 until a later explicit scope change.
