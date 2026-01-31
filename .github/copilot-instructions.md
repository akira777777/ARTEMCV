# ARTEMCV: AI Agent Instructions

## Architecture Overview

**Vite SPA + Vercel Serverless Hybrid**

- Root app: [index.tsx](../index.tsx) → [App.tsx](../App.tsx) mounts to `#root`
- Always-mounted sections: [Navigation](../components/Navigation.tsx) + [Hero](../components/Hero.tsx) + [About](../components/About.tsx) + [WorkGallery](../components/WorkGallery.tsx) + [ContactSectionSecure](../components/ContactSectionSecure.tsx) + [Footer](../components/Footer.tsx)
- Data-driven content: [constants.tsx](../constants.tsx) exports `PROJECTS[]` and `SKILLS[]` arrays; components map from these to avoid hardcoded JSX

**Critical data flow:**
1. User language preference → [i18n.tsx](../i18n.tsx) context → all components use `useI18n().t(key)`
2. Form submissions (contact) → [ContactSectionSecure.tsx](../components/ContactSectionSecure.tsx) → [api/send-telegram.ts](../api/send-telegram.ts) on Vercel
   - Sends to Telegram for notification
   - Stores in Neon PostgreSQL (if DATABASE_URL set) for analytics
3. Analytics queries → [api/analytics.ts](../api/analytics.ts) protected endpoint with ANALYTICS_API_KEY
4. Scroll detection → [Navigation.tsx](../components/Navigation.tsx) auto-detects active section based on viewport position

## Conventions & Patterns

**Styling:** Tailwind only (no CSS-in-JS); dark theme (`bg-black`, `text-white`), high contrast, rounded corners, subtle gradients and glows. Reference: [components/Hero.tsx](../components/Hero.tsx) for gradient text, [components/About.tsx](../components/About.tsx) for service card hover states.

**Internationalization:** 
- Context-based via `useI18n()` hook
- Supports: `en | ru | cs` (Czech)
- Detection order: localStorage → navigator.language → default English
- Add translation keys in [i18n.tsx](../i18n.tsx) `translations` object for all three languages

**Error handling:** Wrap interactive features (forms) in [ErrorBoundary](../components/ErrorBoundary.tsx); shows fallback UI with error details in `<details>` expand

**Component structure:** Named exports for main sections (`export const SectionName`), default exports for smaller UI components. Use React.memo() for expensive renders (e.g., [WorkGallery.tsx](../components/WorkGallery.tsx))

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
- `VITE_TELEGRAM_CHAT_ID` — optional client-side hint; [send-telegram.ts](../api/send-telegram.ts) can override
- `.env.local` is git-ignored; set locally or in Vercel dashboard

**Telegram integration:**
- Endpoint: `/api/send-telegram` serverless on Vercel (preferred for secrets)
- HTML escaping: use `escapeHtml()` utility to prevent Telegram parse errors
- Honeypot field (`hp`) silently succeeds if filled (spam bot detection)
- Parse mode: HTML for formatted messages

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

**Form submissions:**
- Validate in component before fetch
- Use `AbortController` with 12s timeout to prevent hangs
- Return JSON response; expect serverless to use same format
- On success, clear form + show success toast
- Honeypot + rate-limit check (10s throttle) on client

## Performance Notes

- Lazy image loading in [WorkGallery.tsx](../components/WorkGallery.tsx): `loading="lazy"`, `decoding="async"`
- Scroll-driven effects use `requestAnimationFrame` (e.g., [Hero.tsx](../components/Hero.tsx) mouse parallax)
- Avoid re-renders: `useCallback`, `useMemo`, `React.memo()` for expensive sections
- Serverless function optimized: reduced cognitive complexity, extracted helper functions, optimized request handling

## Neon PostgreSQL Integration

**Optional but recommended:** Store contact submissions and analytics in Neon PostgreSQL (serverless, free tier available).

**Setup:**
1. Create account at [neon.tech](https://neon.tech)
2. Set `DATABASE_URL` environment variable
3. Run `npm run db:migrate` to create tables
4. Submissions auto-stored; query via `/api/analytics` endpoint

**Key Files:**
- [lib/db.ts](../lib/db.ts) - Connection pool & query execution
- [lib/contact-db.ts](../lib/contact-db.ts) - High-level database operations
- [api/analytics.ts](../api/analytics.ts) - Protected analytics endpoint
- [scripts/migrate.ts](../scripts/migrate.ts) - Schema initialization
- [NEON_SETUP.md](../NEON_SETUP.md) - Comprehensive setup guide

**Database Schema:**
- `contact_submissions` - Form submissions with metadata
- `contact_analytics` - Daily statistics (honeypot catches, rate limits)
- `contact_audit_log` - Status change audit trail

**Security:**
- Input validation & HTML escaping
- Rate limiting (5 req/60s per IP)
- Honeypot bot detection
- Protected analytics endpoint with API key
