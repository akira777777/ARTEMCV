# Palette's Journal

## 2024-05-22 - [Initial Entry]
**Learning:** Initialized Palette's journal.
**Action:** Will document critical UX/a11y learnings here.

## 2025-01-31 - [Keyboard visibility for hover-only actions]
**Learning:** UI elements that only reveal themselves on hover (like the Barbershop project link in BentoGrid) are invisible to keyboard users even when focused.
**Action:** Use `group-focus-within:opacity-100` and `focus:opacity-100` to ensure keyboard accessibility for hidden interactive elements.

## 2025-05-15 - [Skip-to-Content and Global Hydration]
**Learning:** Long single-page applications with many interactive elements can be frustrating for keyboard users without a "Skip to Content" link. Additionally, production-only hydration errors (like missing globals in SSR/Hydration) can break the entire UI experience.
**Action:** Always implement a `SkipLink` for long pages and verify hydration consistency in production builds. Ensure all global constants used in components are properly initialized or guarded for SSR.
