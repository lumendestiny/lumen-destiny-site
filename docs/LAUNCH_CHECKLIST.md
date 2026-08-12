# Lumen Destiny launch checklist

Status values: TODO / BLOCKED / READY / VERIFIED

## 1. Core product
- [ ] Free Saju input works on desktop and mobile.
- [ ] Result page renders pillars, Ten Gods, hidden stems, relations and five elements without console errors.
- [ ] Wealth/year/month/today sections navigate correctly.
- [ ] Compatibility input and result flow works.
- [ ] 1:1 consultation preview works even when AI is disabled.
- [ ] Guardian archive, order, gift, campaigns, story, gallery, physical status and verification pages work.

## 2. Language
- [ ] Korean complete.
- [ ] English complete.
- [ ] Japanese complete.
- [ ] Tagalog complete.
- [ ] Vietnamese complete.
- [ ] Selected language persists across result, compatibility, consultation and Guardian flows.
- [ ] Dynamic messages do not fall back to Korean unexpectedly.

## 3. Mobile / browser QA
- [ ] Android Chrome at 100% zoom.
- [ ] iPhone Safari.
- [ ] Desktop Chrome/Edge/Safari.
- [ ] Sticky header/language/navigation do not cover form content.
- [ ] Navigation active state is correct.
- [ ] No horizontal overflow except intentional mobile nav scroll.
- [ ] Forms do not trigger unusable auto-zoom.

## 4. API / Cloudflare
- [ ] /api/health returns ONLINE.
- [ ] Cloudflare Pages Functions included in production deployment.
- [ ] Production and preview environment variables are intentionally separated.
- [ ] No secret exists in GitHub, browser JS or HTML.
- [ ] D1 migrations applied in order and backed up before destructive changes.
- [ ] Error pages and 404 behavior checked.

## 5. AI consultation
- [ ] OPENAI_API_KEY stored as Cloudflare secret.
- [ ] LUMEN_AI_ENABLED=true only after smoke testing.
- [ ] Model and token limit chosen.
- [ ] Rate limit verified.
- [ ] Korean/English/Japanese/Tagalog/Vietnamese answers tested.
- [ ] High-stakes medical/legal/financial questions remain non-deterministic and appropriately qualified.
- [ ] Consultation storage remains disabled unless explicit policy and consent are added.

## 6. Guardian database / issuance
- [ ] GUARDIAN_DB bound to production.
- [ ] All migrations including payment audit applied.
- [ ] Edition limits tested for 100 / 5 / 1 scarcity tiers.
- [ ] Duplicate issuance blocked.
- [ ] Verification page shows only intended public fields.
- [ ] QR verification opens correct Guardian ID.

## 7. Payments
- [ ] Payment provider selected.
- [ ] Merchant/business identity approved.
- [ ] Settlement bank account connected.
- [ ] Sandbox checkout implemented.
- [ ] Provider-native webhook signature verification implemented.
- [ ] Browser redirect cannot issue Guardian.
- [ ] Server verifies Guardian ID, USD amount and currency.
- [ ] Duplicate event is idempotent.
- [ ] Payment audit events recorded.
- [ ] Refund/cancellation policy and technical flow decided before exposing refund controls.
- [ ] LUMEN_PAYMENTS_ENABLED=true only after all sandbox tests pass.

## 8. Guardian gifting / campaigns
- [ ] Gift sender/recipient fields tested.
- [ ] Campaign ID and target date persist correctly.
- [ ] Exam campaign dates checked against official sources before promotion.
- [ ] D-100/D-50/D-30/D-7 calculations verified around timezone/date boundaries.
- [ ] Social sharing metadata reviewed.
- [ ] Claims do not imply Guardian caused exam, career or financial outcomes.

## 9. Success stories / Physical Guardian
- [ ] Story consent separated from submission.
- [ ] Evidence upload uses private storage, not public URLs.
- [ ] Evidence retention/deletion policy finalized.
- [ ] Personal identifiers are redacted before publication.
- [ ] Only approved stories appear publicly.
- [ ] Physical card selection criteria published or internally documented.
- [ ] Shipping address requested only after selection.
- [ ] Shipping status workflow tested.

## 10. Legal / customer communication
- [ ] Terms finalized for digital content and payments.
- [ ] Privacy policy matches actual production data flows.
- [ ] Refund/cancellation disclosure visible before payment.
- [ ] Customer support email monitored.
- [ ] Guardian is described as symbolic/entertainment/encouragement content, not guaranteed outcomes.
- [ ] Marketing testimonials are factual, consented and not presented as causal proof.

## 11. Analytics / operations
- [ ] Privacy-conscious analytics decision made.
- [ ] Error monitoring chosen.
- [ ] Payment webhook failures can be detected.
- [ ] Daily backup/export procedure for Guardian orders documented.
- [ ] Incident rollback procedure documented.
- [ ] Status page checked after each production deployment.

## 12. Final production gate
Production launch is GO only when:
- Core flows are VERIFIED on mobile and desktop.
- Five-language critical flows are VERIFIED.
- AI, if enabled, is READY on /status.html and smoke-tested.
- Payments, if enabled, pass sandbox and webhook tests.
- Privacy/terms/refund text matches actual behavior.
- No critical/major known defect remains.

If payment or AI is not ready, launch may proceed with those features visibly disabled while free Saju/compatibility/Guardian preview features remain stable.
