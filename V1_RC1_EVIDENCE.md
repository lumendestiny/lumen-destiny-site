# Lumen Destiny V1 — Release Candidate 1 Evidence

Frozen: 2026-08-15

## RC identity

- Release candidate branch: `release/v1-rc1`
- Frozen commit: `1a0681f2ba8de00c0583dabc9c74fb974d73cd53`
- Default development branch: `main`
- Release posture: **CORE PRODUCT READY / REAL PAYMENT HOLD**

`release/v1-rc1` is the preserved rollback/reference point for the current V1 candidate. Do not move this branch merely to incorporate later documentation or polish. If product code changes after RC1, create and validate a later release candidate instead of silently redefining RC1.

## V1 public scope

Included:
- Free Saju / Four Pillars
- Fortune result pages
- Compatibility
- LUMEN GUARDIAN archive, personalization, gifting and verification
- Payment-ready Guardian flow with real customer payment fail-closed
- KO / EN / JA / TL / VI / ZH

Excluded from V1:
- Face reading / face-photo upload
- 1:1 AI consultation

## Evidence already PASS at the RC1 code state

Engineering/runtime evidence established before freezing RC1 includes:

- Production route smoke
- Core Saju + compatibility runtime journeys
- Free-reading private-input minimization runtime audit
- Six-language coverage
- Legal/support localization runtime audit
- Recovery/offline runtime audit
- Mobile static and rendered audits
- Guardian preview/personalization/gift journey audit
- Accessibility rendered audit, including reduced-motion behavior for Legendary Guardian media
- Security release audit
- Guardian D1 schema audit
- D1 bootstrap/backup validator self-test
- Flag integrity audit
- SEO release audit
- Payment-flow safety audit
- Sensitive Logging static audit
- Guardian admin dashboard runtime audit, including D1 Preflight UI and session-only Internal Secret handling

The latest Production Smoke after the privacy/logging hardening completed successfully before this evidence record was written.

## Payment safety posture

Real customer payment remains intentionally unavailable until external and operational evidence is complete.

Checkout is fail-closed:
- missing/unknown DB payment-control state is HOLD,
- payment-control must be explicitly `open`,
- an administrator cannot open payment-control before required PG/KYC/privacy/public-arm prerequisites,
- public checkout still requires its separate final arm,
- TEST MODE and production readiness requirements remain independent gates.

Do not enable `LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED` for UX testing or merely to clear a release gate.

## Manual / external HOLD gates

RC1 is **not** equivalent to paid commercial go-live. The remaining evidence must still be obtained outside repository-only automation:

1. Real iPhone/iOS physical-device verification.
2. Real Android/Chrome physical-device verification.
3. Authenticated Production D1 Preflight using the deployed Internal Secret; require schema/index safety and checkout control HOLD until cutover.
4. Real D1 export and non-production restore rehearsal where required by operations policy.
5. Final Guardian/payment retention and deletion/anonymization matrix.
6. Controlled deployed Cloudflare/Functions log review for sensitive-data hygiene.
7. One non-sensitive end-to-end privacy/deletion-request rehearsal through `llumendestiny@gmail.com`.
8. Payment-provider written business/category approval.
9. KYC/settlement approval.
10. Provider sandbox acceptance, webhook and refund mapping.
11. Production credentials/account activation.
12. Final go-live gates all green, then explicit public checkout arm as the last step.

## Physical-device evidence source

Use `PHYSICAL_DEVICE_RELEASE_CHECKLIST.md`. Do not mark the physical-device gate PASS from desktop emulation alone.

## Privacy evidence source

Use `PRIVACY_RELEASE_CHECKLIST.md` and `V1_DATA_INVENTORY.md`. Static/runtime engineering PASS must not be presented as proof of legal retention policy, deployed log hygiene or a completed deletion operation.

## Cutover rule

If any blocking defect appears during physical-device, D1, privacy, provider or sandbox validation:

- keep public real payment disabled,
- record the defect,
- fix on `main`,
- rerun the applicable automated/runtime audits,
- create a new release candidate branch rather than moving `release/v1-rc1`.

RC1 should remain a stable reference point for the verified V1 code state frozen on 2026-08-15.
