# Lumen Destiny V1 — Manual Verification Evidence

Updated: 2026-08-15

Purpose: retain human/runtime evidence for release flags that must never be set from static CI alone.

## Rule
A flag may be changed to `true` only after the corresponding deployed-production-candidate test is completed and the evidence below is recorded. Static CI passing is necessary but not sufficient.

## 1. Mobile UX — `LUMEN_MOBILE_UX_VERIFIED`
Record:
- test date/time
- deployed commit SHA
- device/browser
- widths tested: 320 / 360 / 390 / 430px
- portrait + landscape result
- KO / EN / JA / TL / VI / ZH language switch result
- header: brand + six-language bar remain one row; language area scrolls internally when needed
- navigation horizontal scroll result
- no page-level horizontal overflow
- no duplicated/clipped/moved flags
- Guardian order/verify result

Evidence/result:
- Date: 2026-08-15
- Commit: 99dd46b5e67c0ad2eed743c3f3fea7b07797a4be (latest observed mobile compatibility layout checkpoint)
- Devices: Samsung Galaxy / Android mobile browser, portrait screenshots supplied by operator
- Result: HOLD — partial real-device evidence recorded, not a full release PASS
- Notes:
  - Home hero/header/language bar was visually reviewed on a real Samsung Galaxy and iteratively adjusted.
  - Compatibility intro/form/header was visually reviewed on the same real-device class and mobile wrapping was corrected.
  - Latest GitHub push checks observed after the compatibility wrapping fix include successful Security Release Audit and Site Route Audit; no failure conclusion was present in the inspected latest-run response.
  - Still required before PASS: full Android interaction journey (form input, keyboard/native controls, result page, Guardian order/verify, rotation/resume), a real iPhone/iOS journey, and the remaining language/device checks listed above.

## 2. Six-language runtime — `LUMEN_I18N_VERIFIED`
Verify on production candidate:
- Home
- Saju result
- Compatibility input/result
- Guardian archive/order/gift/verify/payment-result states
- Privacy / Terms / Refund / Support / 404

Languages: KO / EN / JA / TL / VI / ZH.
No page may silently fall back to Korean when another language is selected unless explicitly documented.

Evidence/result:
- Date:
- Commit:
- Result: HOLD
- Notes:

## 3. Accessibility — `LUMEN_ACCESSIBILITY_VERIFIED`
Verify:
- keyboard-only navigation
- visible skip link and focus indicator
- form labels/errors readable without color alone
- 200% browser zoom
- reduced-motion OS/browser preference
- no keyboard trap
- sticky header does not hide focused controls

Evidence/result:
- Date:
- Commit:
- Browser/OS:
- Result: HOLD
- Notes:

## 4. Recovery UX — `LUMEN_RECOVERY_UX_VERIFIED`
Force/verify:
- invalid route → localized 404 recovery
- offline/network failure
- API timeout/error
- malformed/invalid Guardian ID
- payment cancelled/failed/pending states
- retry/back routes preserve safe state where practical
- user-facing errors do not expose request bodies, tokens or secrets

Evidence/result:
- Date:
- Commit:
- Result: HOLD
- Notes:

## 5. SEO / public sharing — `LUMEN_SEO_VERIFIED`
Verify deployed responses:
- robots.txt
- sitemap.xml
- canonical public URLs
- paused consultation absent from sitemap and noindexed
- internal/admin/test pages noindexed and crawler-blocked
- title/description/OG metadata on primary public pages
- shared Guardian/gift links resolve correctly on mobile messenger/browser

Evidence/result:
- Date:
- Commit:
- Result: HOLD
- Notes:

## 6. Guardian customer journey — `LUMEN_GUARDIAN_JOURNEY_VERIFIED`
Run end-to-end in all six languages where applicable:
- discover → select → personalize → review → checkout
- success / failed / cancelled / pending
- duplicate webhook/idempotency
- last-item/sold-out race
- issuance exactly once
- verification QR/URL
- gift recipient path
- refund requested/completed/failed
- support links and policies reachable

Do not mark verified until the real selected PG sandbox/provider mapping is tested.

Evidence/result:
- Date:
- Commit:
- Provider/sandbox:
- Result: HOLD
- Notes:

## 7. Backup / recovery — `LUMEN_BACKUP_RECOVERY_VERIFIED`
Verify:
- current production commit recorded
- last known-good rollback identified
- D1 export/backup produced using current Cloudflare-supported method
- backup contains order/payment/refund/issuance state
- restoration rehearsal completed against NON-production D1 only
- payment emergency disable procedure tested/understood
- Cloudflare/provider account recovery method verified
- secret-rotation procedure understood

Evidence/result:
- Date:
- Commit:
- Backup reference (non-secret):
- Restore rehearsal target:
- Result: HOLD
- Notes:

## Release discipline
Only after a section result is explicitly PASS should its matching Cloudflare environment flag be set to `true`. Then call the authenticated `/api/admin/go-live-gate` and confirm that the corresponding blocker disappears. Never set flags merely to make the dashboard green.
