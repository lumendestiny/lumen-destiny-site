# Lumen Destiny — Google Play closed test 14-day plan

## Current state
- Package: `com.lumendestiny.app`
- Track: Closed testing / Alpha
- Release: `Lumen Destiny V1 Closed Test`
- Tester email list prepared: 21 accounts
- Google Play review: submitted; waiting for review completion
- Production-access requirement shown in Play Console: at least 12 testers opted in and remain in closed testing for at least 14 days

## Start condition
The 14-day period should be treated as started only after:
1. Google Play finishes review and the closed-test release is available.
2. The tester opt-in link is active.
3. At least 12 testers have actually opted in using the registered Google account.

Do not count email-list membership alone as participation.

## Tester instructions
1. Open the Google Play closed-test opt-in link with the same Google account registered as a tester.
2. Select Join / Become a tester.
3. Install Lumen Destiny from the Google Play install link.
4. Launch the app and test the main V1 flows.
5. Stay opted in for the full 14-day period; do not leave the testing program.
6. Report any crash, blank screen, broken button, layout issue, login issue, or confusing flow.

## V1 smoke-test flows
- App launch and relaunch
- Account sign-in / direct email login where enabled
- Language switching
- Saju / Four Pillars input and result flow
- Compatibility flow
- Guardian / talisman navigation exposed in V1
- Privacy policy / terms / support links
- Android back navigation
- Keyboard and form usability
- Background / foreground recovery
- Wi-Fi / mobile-data transition
- No unexpected permission prompts

## 14-day operations checklist
### Day 0 — release available
- [ ] Confirm Play Console status is no longer under review
- [ ] Confirm closed-test release is published/available
- [ ] Copy tester opt-in link
- [ ] Send the link to all 21 registered testers
- [ ] Ask testers to use the exact registered Google account

### Day 1
- [ ] Verify at least 12 testers opted in
- [ ] Keep a buffer target of 15+ opted-in testers
- [ ] Ask testers to install and open the app
- [ ] Collect immediate blocker reports

### Day 3
- [ ] Reconfirm opt-in count remains at least 12
- [ ] Triage crashes, blank screens, login blockers, and navigation blockers first
- [ ] Avoid unnecessary closed-test release replacement unless a blocker requires it

### Day 7
- [ ] Midpoint opt-in check
- [ ] Summarize tester feedback by severity: blocker / major / minor / suggestion
- [ ] Confirm no tester is accidentally leaving the program

### Day 10
- [ ] Reconfirm 12+ continuous participants
- [ ] Prepare production-access answers from actual test findings and fixes

### Day 14+
- [ ] Confirm Play Console marks the 14-day requirement complete
- [ ] Confirm 12+ testers are still opted in
- [ ] Apply for production access only after Play Console enables it
- [ ] Preserve tester feedback summary and release notes for the application

## Feedback template
- Device model:
- Android version:
- App language:
- Screen / feature:
- What happened:
- Expected behavior:
- Can reproduce: Yes / No
- Screenshot or screen recording available: Yes / No
- Severity: Blocker / Major / Minor / Suggestion

## Release safety
- Keep the Android upload keystore private and backed up.
- Reuse package `com.lumendestiny.app` for every future Android release.
- Reuse the existing upload key for future Play updates.
- Do not commit signing secrets or keystore files to GitHub.
