# Lumen Destiny — Mobile Header / Language Bar UI Spec

Updated: 2026-08-12

## Supported widths
Primary manual review widths:
- 320px
- 360px
- 390px
- 430px

Secondary review widths:
- 768px tablet portrait
- 900px compact desktop/tablet landscape

## Header composition
The sticky header contains two rows on <=900px:
1. Brand + flag language bar
2. Horizontal navigation

The whole header remains one sticky unit at top: 0. The language bar must never scroll away separately from the brand/navigation.

## Brand + language row
- Brand must remain visible and must not wrap.
- Five language flags remain on the same row as the brand.
- Flags may horizontally scroll if an unusually narrow browser/font environment cannot fit them.
- Do not stack the language bar below the brand at <=520px; that previously caused header-height collisions.
- Minimum flag touch target is approximately 31–38px depending on viewport.
- Active language receives a visible selected state.

## Navigation row
- Navigation stays on one horizontal row.
- Horizontal scrolling is allowed.
- Navigation items must never compress until labels overlap.
- Active/current item should be scrolled into view by the existing service-shell behavior.

## Sticky/header collision rules
- `.fortune-header` must use `height:auto` because mobile content is taller than the legacy `.site-header` fixed height.
- Header must not cover page content due to an incorrect fixed height.
- No separate sticky offset should be hard-coded for the language bar.
- Avoid additional fixed-position bars at the top unless their combined offset is explicitly managed.

## Overflow rules
At 320px and above:
- no page-level horizontal scrollbar caused by header or result panels;
- flag controls may scroll inside their own language container;
- navigation may scroll inside its own row;
- images/canvas stay within content width;
- action buttons wrap rather than overflow.

## Regression checklist
For each 320/360/390/430px width:
1. Load Korean.
2. Switch EN / JP / TL / VI.
3. Scroll down: brand, flags and nav remain visible as one sticky header.
4. Confirm no flag is clipped vertically.
5. Confirm the nav can be swiped horizontally.
6. Open Guardian pages and confirm the longer Guardian navigation remains usable.
7. Confirm page content begins below the actual auto-height header and is not hidden underneath it.
8. Rotate portrait/landscape and repeat a language switch.

## Implementation note
The canonical mobile layout rules are in `service-shell.css`. Do not reintroduce the previous <=520px `flex-direction: column` rule for `.brand-language-stack` without redesigning the sticky header height model.