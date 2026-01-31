# ARTEMCV: AI Agent Instructions

## Architecture Overview

**Vite SPA + Vercel Serverless Hybrid**

- Root app: [index.tsx](../index.tsx) → [App.tsx](../App.tsx) mounts to `#root`
- Always-mounted sections: [Navigation](../components/Navigation.tsx) + [Hero](../components/Hero.tsx) + [About](../components/About.tsx) + [WorkGallery](../components/WorkGallery.tsx) + [ContactSectionSecure](../components/ContactSectionSecure.tsx) + [Footer](../components/Footer.tsx)
- Optional overlay (rendered after Footer): [AIChatOverlay](../components/AIChatOverlay.tsx) integrates Google GenAI (chat, image generation, Veo video animation)
- Data-driven content: [constants.tsx](../constants.tsx) exports `PROJECTS[]` and `SKILLS[]` arrays; components map from these to avoid hardcoded JSX

**Critical data flow:**
1. User language preference → [i18n.tsx](../i18n.tsx) context → all components use `useI18n().t(key)`
2. Form submissions (contact) → [ContactSectionSecure.tsx](../components/ContactSectionSecure.tsx) → either direct Telegram API (client-side) or [api/send-telegram.ts](../api/send-telegram.ts) serverless (Vercel)
3. AI interactions → [AIChatOverlay.tsx](../components/AIChatOverlay.tsx) uses @google/genai SDK directly with `VITE_API_KEY`

## Conventions & Patterns

**Styling:** Tailwind only (no CSS-in-JS); dark theme (`bg-black`, `text-white`), high contrast, rounded corners, subtle gradients and glows. Reference: [components/Hero.tsx](../components/Hero.tsx) for gradient text, [components/About.tsx](../components/About.tsx) for service card hover states.

**Internationalization:** 
- Context-based via `useI18n()` hook
- Supports: `en | ru | cs` (Czech)
- Detection order: localStorage → navigator.language → default English
- Add translation keys in [i18n.tsx](../i18n.tsx) `translations` object for all three languages

**Error handling:** Wrap interactive features (AI, forms) in [ErrorBoundary](../components/ErrorBoundary.tsx); shows fallback UI with error details in `<details>` expand

**Component structure:** Named exports for main sections (`export const SectionName`), default exports for smaller UI components. Use React.memo() for expensive renders (e.g., [Projects.tsx](../components/Projects.tsx))

**Type safety:** All data shapes in [types.ts](../types.ts) (e.g., `Project`, `NavItem`); no loose `any` types

## Critical Workflows

**Development (prefer these over plain `npm run dev`):**
- `npm run dev:clean` — clears Vite cache, runs dev server (use for cache issues)
- `npm run dev:prod` — builds then previews (closest to production)
- `npm run build` → `npm run preview` — explicit build + preview

**Testing:**
- `npm run test` — Vitest watch mode
- `npm run test:run` — single run

**Environment variables:**
- Vite inlines only `VITE_*` prefix (rest are stripped)
- `VITE_API_KEY` (or `GEMINI_API_KEY`, `API_KEY` fallback) — required for AI features
- `VITE_TELEGRAM_CHAT_ID` — optional client-side hint; [send-telegram.ts](../api/send-telegram.ts) can override
- `.env.local` is git-ignored; set locally or in Vercel dashboard

**Telegram integration:**
- Client-side: [ContactSectionSecure.tsx](../components/ContactSectionSecure.tsx) sends directly to Telegram API (requires bot token in Vercel env)
- Fallback: `/api/send-telegram` serverless endpoint on Vercel (preferred for secrets)
- HTML escaping: use `escapeHtml()` utility to prevent Telegram parse errors
- Honeypot field (`hp`) silently succeeds if filled (spam bot detection)

## Integration Points & External APIs

**Google Gemini (via @google/genai):**
- Chat with vision (image upload & analysis)
- Image generation (1K/2K/4K, configurable aspect ratios)
- Veo video generation from images + text prompts
- Models: `gemini-3-pro-preview`, `gemini-3-pro-image-preview`, `veo-3.1-fast-generate-preview`
- Streaming supported; handle token limits and 429 (rate limit) gracefully

**Telegram Bot API:**
- Endpoint: `https://api.telegram.org/bot{TOKEN}/sendMessage`
- Parse mode: HTML (use `escapeHtml()` before sending)
- Rate: ~30 msgs/sec per chat

## File Organization

- `components/` — React UI components (one per file)
- `lib/` — Utilities ([hooks.ts](../lib/hooks.ts) exports `useReducedMotion()`, `useMousePosition()`, `useScrollProgress()`)
- `api/` — Vercel serverless functions (TypeScript)
- `public/` — Static assets (images, project screenshots)
- `tests/` — Vitest test files
- `constants.tsx` — Single source of truth for `PROJECTS[]`, `SKILLS[]`

## Common Patterns

**Adding a project:**
1. Append to `PROJECTS[]` in [constants.tsx](../constants.tsx) with new `Project` object
2. Place screenshot in `public/` (e.g., `public/projectname.png`)
3. [WorkGallery.tsx](../components/WorkGallery.tsx) auto-renders via `.map()`

**Adding a feature to AI overlay:**
1. New tab button in [AIChatOverlay.tsx](../components/AIChatOverlay.tsx) header
2. Extend `Tab` type, add state for new tab mode
3. Call `ai.models.generateContent()` or `generateVideos()` with appropriate model
4. Handle streaming, errors, display results

**Form submissions:**
- Validate in component before fetch
- Use `AbortController` with 12s timeout to prevent hangs
- Return JSON response; expect serverless to use same format
- On success, clear form + show success toast
- Honeypot + rate-limit check (10s throttle) on client

## Performance Notes

- Lazy image loading in [WorkGallery.tsx](../components/WorkGallery.tsx): `loading="lazy"`, `decoding="async"`
- Framer Motion for animations (already imported in some components)
- Scroll-driven effects use `requestAnimationFrame` (e.g., [Hero.tsx](../components/Hero.tsx) mouse parallax)
- Avoid re-renders: `useCallback`, `useMemo`, `React.memo()` for expensive sections
- AI response caching recommended to reduce Gemini token usage
