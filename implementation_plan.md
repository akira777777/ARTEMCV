# Implementation Plan — Work Section Improvement

## Goal
Improve the `Work` section UX/UI, localization consistency, and accessibility in `SpotlightGallery` based on the current visual issues.

## Scope
1. Refine visual hierarchy and readability in featured project area.
2. Remove hardcoded text and fully localize sidebar/navigation labels.
3. Improve accessibility: button semantics, ARIA labels, keyboard navigation.
4. Update tests affected by localization and label changes.
5. Validate changes with typecheck/tests.

## Files to Update
- `components/SpotlightGallery.tsx`
- `i18n.tsx`
- `tests/spotlight-gallery.test.tsx`
- `task.md` (progress log)
- `walkthrough.md` (final verification summary)

## Execution Steps
1. Add missing i18n keys for all sidebar and thumbnail labels in EN/RU/CS.
2. Refactor `SpotlightGallery` to consume i18n keys and improve overlays/contrast.
3. Add keyboard left/right handling and explicit `type="button"`.
4. Update tests to match new localized labels and counter rendering.
5. Run `npm run test:run -- tests/spotlight-gallery.test.tsx` and `npm run typecheck`.

## Success Criteria
- No hardcoded UI strings remain in `SpotlightGallery`.
- Better readability of featured card content on bright images.
- Carousel usable by keyboard and screen readers.
- Targeted tests and typecheck pass.