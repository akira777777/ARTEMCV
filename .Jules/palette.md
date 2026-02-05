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

## 2025-02-12 - [Conversational Name Entry]
**Learning:** Replacing blocking `window.prompt` with an inline conversational UI in chat components improves user immersion and maintains a consistent design language.
**Action:** Implement a state-based name capture flow where the initial bot message and input placeholder adapt based on whether the user's name is known.

## 2025-02-12 - [Nested Main Landmarks]
**Learning:** Redundant `<main>` tags in page components that are already wrapped in a layout with a `<main>` tag cause duplicate ID violations and landmark confusion for screen readers.
**Action:** Use React Fragments `<>` in page-level components when they are wrapped in a layout that already provides the primary semantic landmark.
