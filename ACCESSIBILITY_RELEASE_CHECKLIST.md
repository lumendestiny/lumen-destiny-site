# Lumen Destiny — Accessibility Release Checklist

Updated: 2026-08-12

## Shared requirements
- Every public page must expose a usable `main` landmark.
- Shared shell inserts a keyboard-visible “skip to main content” link.
- Links, buttons, inputs, selects and textareas must show a visible `:focus-visible` outline.
- Language flag buttons expose accessible language names and `aria-pressed` state.
- Current navigation item uses `aria-current="page"` where applicable.
- Keyboard navigation must work without horizontal page overflow.
- Important information must not rely on color alone.
- Images carrying meaning require useful alt text; decorative images use empty alt text.
- Forms require visible or programmatically associated labels/instructions.
- Validation errors must be readable text, not only border/color changes.
- Recovery/offline notices must be understandable in all supported languages.

## Motion
- Respect `prefers-reduced-motion: reduce`.
- Any future animated Legendary Guardian must have a reduced-motion/static fallback.

## Mobile + zoom
Test at:
- 320px
- 360px
- 390px
- 430px
- browser zoom 200%

Confirm:
- header remains usable
- language buttons remain reachable
- Guardian navigation is horizontally scrollable inside its own area
- buttons and form fields do not clip
- long translated strings wrap correctly
- focus outline is not hidden behind sticky header

## Keyboard smoke test
On Home, Result, Compatibility, Consult, Guardian, Guardian Order and Verify:
1. Reload page.
2. Press Tab; skip link must appear.
3. Activate skip link; focus/viewport must move to main content.
4. Tab through language buttons, navigation and primary actions.
5. Use Enter/Space on buttons.
6. Confirm no keyboard trap.

## Release rule
Accessibility is not considered complete only because these CSS/ARIA helpers exist. Complete this checklist against the deployed production candidate before final public launch.