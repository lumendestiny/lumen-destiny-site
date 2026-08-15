# Lumen Destiny V1 launch checklist

Status values: TODO / BLOCKED / READY / VERIFIED

V1 scope source of truth: `V1_SCOPE.md`.
Face reading / physiognomy (관상) and 1:1 AI consultation are explicitly out of scope for V1 and are not launch blockers.

## 1. Core product
- [ ] Free Saju input works on desktop and mobile.
- [ ] Result page renders pillars, Ten Gods, hidden stems, relations and five elements without console errors.
- [ ] Wealth/year/month/today sections navigate correctly.
- [ ] Compatibility input and result flow works.
- [ ] Guardian archive, order, gift, campaigns, story, gallery, physical status and verification pages work.

## 2. Language
- [ ] Korean complete.
- [ ] English complete.
- [ ] Japanese complete.
- [ ] Tagalog complete.
- [ ] Vietnamese complete.
- [ ] Simplified Chinese complete.
- [ ] Selected language persists across result, compatibility and Guardian flows.
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
- [ ] `/api/health` returns ONLINE.
- [ ] Cloudflare Pages Functions included in production deployment.
- [ ] Production and preview environment variables are intentionally separated.
- [ ] No secret exists in GitHub, browser JS or HTML.
- [ ] D1 migrations applied in order and backed up before destructive changes.
- [ ] `0007_guardian_edition_slots.sql` applied before enabling paid Guardian issuance.
- [ ] `0008_guardian_checkout_sessions.sql` applied before enabling checkout.
- [ ] Error pages and 404 behavior checked.

## 5. Explicit V1 exclusions
- [x] Face reading / physiognomy (관상) is excluded from V1 navigation, sitemap, marketing copy and release gates.
- [x] 1:1 AI consultation is excluded from V1 navigation, sitemap, marketing copy and release gates.
- [ ] Reconsider either feature only as a later upgrade after a separate product decision.

## 6. Guardian database / issuance
- [ ] `GUARDIAN_DB` bound to production.
- [ ] All migrations including payment audit, edition slots and checkout sessions applied.
- [ ] Every sellable Guardian design has a stable `edition_key`.
- [ ] Basic/Personal edition limit 100 tested.
- [ ] Rare edition limit 5 tested.
- [ ] Legendary edition limit 1 tested.
- [ ] Issuance claims one `guardian_edition_slots` row before an order is marked issued.
- [ ] Two simultaneous attempts for the final slot cannot both succeed.
- [ ] Sold-out response returns `edition_sold_out` and never issues a serial above the limit.
- [ ] Duplicate issuance blocked.
- [ ] Verification page shows Guardian ID, intended public fields, edition serial and limit only.
- [ ] QR verification opens correct Guardian ID.

## 7. Payments
Payments are an independent launch gate. Free Saju/fortune/compatibility and non-paid Guardian browsing may launch while live payments remain disabled.

- [ ] Payment provider selected and explicitly approves the actual Lumen Destiny / Guardian business model.
- [ ] Merchant/business identity approved.
- [ ] Settlement bank account connected.
- [ ] `LUMEN_PAYMENT_PROVIDER` configured.
- [ ] `LUMEN_PAYMENT_ADAPTER_URL` uses HTTPS and points only to the intended payment adapter.
- [ ] `LUMEN_PAYMENT_ADAPTER_SECRET` stored only as a Cloudflare secret.
- [ ] Sandbox checkout implemented.
- [ ] Checkout API reads price from the Guardian server order and never trusts a browser amount.
- [ ] Checkout session is recorded before provider checkout creation.
- [ ] Provider checkout returns a valid HTTPS checkout URL.
- [ ] Provider-native webhook signature verification implemented in the adapter/provider layer.
- [ ] Browser return/redirect cannot issue Guardian.
- [ ] Server verifies Guardian ID, USD amount and currency.
- [ ] Duplicate event is idempotent.
- [ ] Payment audit events recorded.
- [ ] Checkout creation failure is recoverable without creating a paid Guardian.
- [ ] Payment success return opens the payment result page for the same Guardian ID.
- [ ] Pending state clearly tells the customer not to pay again.
- [ ] Issued state shows Guardian ID, serial and verification route.
- [ ] Failed/unknown state never displays a false payment success message.
- [ ] Payment result page is tested with delayed webhook delivery.
- [ ] Wrong amount and wrong currency are rejected.
- [ ] Sold-out race after payment has a documented support/refund path before launch.
- [ ] Refund/cancellation policy and technical flow decided before exposing refund controls.
- [ ] `LUMEN_PAYMENTS_ENABLED=true` only after all sandbox tests pass.

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
- [ ] Checkout creation failures can be detected.
- [ ] Payment webhook failures can be detected.
- [ ] Daily backup/export procedure for Guardian orders documented.
- [ ] Incident rollback procedure documented.
- [ ] Status page checked after each production deployment.

## 12. Release smoke test
- [ ] Clean browser: homepage → free Saju → result works.
- [ ] All six languages checked from input through result.
- [ ] Compatibility flow works.
- [ ] Guardian archive and personalization preview work.
- [ ] Guardian test order is created with correct server price and `edition_key`.
- [ ] If payments are enabled, checkout creation returns the configured provider and correct server amount.
- [ ] If payments are enabled, checkout session audit row exists for the Guardian order.
- [ ] If payments are enabled, valid sandbox webhook changes payment result from pending to issued.
- [ ] Verification shows the same issuance serial.
- [ ] Replaying the webhook does not allocate a second slot.
- [ ] Wrong amount and wrong currency are rejected.
- [ ] Final available slot is issued once; next attempt returns sold out.
- [ ] `/status.html` shows expected production states, including Checkout and Webhook separately.

## 13. Final production gate
Production launch is GO only when:
- Core V1 flows are VERIFIED on mobile and desktop.
- Six-language critical V1 flows are VERIFIED.
- Guardian issuance/verification is VERIFIED for the features exposed at launch.
- Payments, if enabled, show READY for Checkout and Webhook and pass sandbox, idempotency and final-slot tests.
- Privacy/terms/refund text matches actual behavior.
- No critical/major known defect remains.

If live payment approval is not ready, launch may proceed with payments visibly disabled while free Saju, fortune, compatibility and Guardian preview/archive features remain stable.
