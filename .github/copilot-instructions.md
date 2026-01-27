# ARTEMCV: AI Agent Instructions

## Architecture
- SPA on Vite: [App.tsx](App.tsx) root; [index.tsx](index.tsx) mounts to #root.
- Always-mounted: [components/Header.tsx](components/Header.tsx), [components/Hero.tsx](components/Hero.tsx), [components/About.tsx](components/About.tsx), [components/Projects.tsx](components/Projects.tsx), [components/Footer.tsx](components/Footer.tsx), [components/ContactSection.tsx](components/ContactSection.tsx).
- Optional ChatBot: [components/ChatBot.tsx](components/ChatBot.tsx) (render after Footer); Gemini calls via [services/geminiService.ts](services/geminiService.ts) only.
- Content source: [constants.tsx](constants.tsx) (`PROJECTS`, `SKILLS`); types in [types.ts](types.ts).

## Patterns
- Styling: Tailwind utilities only; dark theme, high contrast, rounded UI, subtle glow.
- i18n: [i18n.tsx](i18n.tsx) with `useI18n().t(key)`; languages `en|ru|cs`; detect from `localStorage('lang')` or `navigator.language`.
- Error boundaries: use [components/ErrorBoundary.tsx](components/ErrorBoundary.tsx) for interactive/AI areas.
- Data mapping: components map arrays from `constants.tsx`; avoid hardcoding content in components.

## Environment
- Vite inlines only `VITE_*`. Set `VITE_API_KEY` (Gemini, for ChatBot) and `VITE_TELEGRAM_CHAT_ID` (client hint).
- Serverless (Vercel): `TELEGRAM_BOT_TOKEN` (secret), `TELEGRAM_CHAT_ID` (destination) for [api/send-telegram.ts](api/send-telegram.ts).
- Fallbacks: [vite.config.ts](vite.config.ts) maps `VITE_API_KEY|GEMINI_API_KEY|API_KEY` to both `process.env.*` and `import.meta.env.VITE_API_KEY`; prefer `VITE_API_KEY`.

## Workflows
- Dev: `npm run dev` (use `npm run dev:clean` if cache misbehaves).
- Build/Preview: `npm run build`, `npm run preview` (serverless routes unavailable in preview).
- Enable ChatBot: import + render in [App.tsx](App.tsx); ensure `VITE_API_KEY` present.

## AI Guardrails
- Chat cache: [services/chatCacheManager.ts](services/chatCacheManager.ts) — TTL 30 days, max 100 entries, key = simple hash of message; silent on errors.
- Image cache: [services/imageCacheManager.ts](services/imageCacheManager.ts) — expiry 7 days, total size ≤ ~50MB, key = `btoa(prompt|style|ratio)`; auto-evicts oldest; handles quota.
- Rate limiting intent: avoid parallel bursts; reuse cached responses/images to mitigate 429.

## Serverless Contact
- Endpoint: [api/send-telegram.ts](api/send-telegram.ts) (`POST` only); honeypot `hp`; required `name|email|message` with email regex.
- Timeout: 12s via `AbortController`; returns 504 on timeout; 500 if env misconfigured; 405 for non-POST.
- HTML escaped payload; `parse_mode='HTML'`; `disable_web_page_preview=true`.

## Quick Examples
- Add project: append to `PROJECTS[]` in [constants.tsx](constants.tsx); UI auto-renders in [components/Projects.tsx](components/Projects.tsx).
- Use i18n: `const { t } = useI18n();` → `t('header.contact')` in components.
- Gemini feature: add static method in [services/geminiService.ts](services/geminiService.ts), define types in [types.ts](types.ts), create component, wire in [App.tsx](App.tsx).

## Gotchas
- Source of truth: [package.json](package.json) (React 19).
- Preview mode: serverless functions don’t run; test Telegram on deployed Vercel preview.
