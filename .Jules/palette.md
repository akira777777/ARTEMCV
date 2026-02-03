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

## 2025-02-10 - [Conversational Onboarding]
**Learning:** Using `window.prompt` for user data collection is jarring and breaks the immersive feel of modern chat interfaces.
**Action:** Replace blocking browser prompts with inline, conversational UI steps within the chat flow to maintain user engagement and aesthetic consistency.
