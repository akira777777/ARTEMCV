# Palette's Journal

## 2024-05-22 - [Initial Entry]
**Learning:** Initialized Palette's journal.
**Action:** Will document critical UX/a11y learnings here.

## 2025-01-31 - [Keyboard visibility for hover-only actions]
**Learning:** UI elements that only reveal themselves on hover (like the Barbershop project link in BentoGrid) are invisible to keyboard users even when focused.
**Action:** Use `group-focus-within:opacity-100` and `focus:opacity-100` to ensure keyboard accessibility for hidden interactive elements.

## 2024-05-23 - [Localized ARIA labels]
**Learning:** Hardcoded ARIA labels in a multilingual app break accessibility for non-English users as screen readers will announce labels in the wrong language.
**Action:** Always use translation keys for `aria-label`, `title`, and `alt` text to ensure a consistent accessible experience across all supported languages.

## 2026-02-04 - [Conversational Name Entry]
**Learning:** Replacing blocking browser interactions like `window.prompt` with inline conversational UI elements improves user immersion and maintains the app's modern aesthetic.
**Action:** Use inline form states or bot-driven message prompts for collecting user information instead of native browser dialogs.
