# ARTEMCV: AI Agent Instructions

## Big picture
- Root app is a Vite SPA: [index.tsx](../index.tsx) mounts [App.tsx](../App.tsx) into `#root`.
- Main sections are always mounted: [components/Header.tsx](../components/Header.tsx), [components/Hero.tsx](../components/Hero.tsx), [components/About.tsx](../components/About.tsx), [components/Projects.tsx](../components/Projects.tsx), [components/Footer.tsx](../components/Footer.tsx), [components/ContactSection.tsx](../components/ContactSection.tsx).
- Content is data-driven from [constants.tsx](../constants.tsx) (`PROJECTS`, `SKILLS`) with types in [types.ts](../types.ts).
- Optional AI overlay UI (render after Footer) in [components/AIChatOverlay.tsx](../components/AIChatOverlay.tsx) uses Google GenAI directly.
- Separate Next.js app lives in [portfolio-next/](../portfolio-next/) (own [portfolio-next/package.json](../portfolio-next/package.json)); follow its app router structure under [portfolio-next/app/](../portfolio-next/app/).

## Conventions & patterns
- Styling is Tailwind utility-only; dark, high-contrast, rounded UI with subtle glow.
- i18n via [i18n.tsx](../i18n.tsx) and `useI18n().t(key)`; supported `en|ru|cs` from `localStorage('lang')` or `navigator.language`.
- Interactive/AI areas should be wrapped with [components/ErrorBoundary.tsx](../components/ErrorBoundary.tsx).
- Components map arrays from [constants.tsx](../constants.tsx); avoid hardcoded content in JSX.

## Workflows (root app)
- Dev: `npm run dev` (force) or `npm run dev:clean` (via [dev-server.js](../dev-server.js)).
- Build/preview: `npm run build`, `npm run preview`; `npm run dev:prod` = build+preview.

## Integrations & env
- Vite only inlines `VITE_*`: use `VITE_API_KEY` for Gemini and `VITE_TELEGRAM_CHAT_ID` as client hint.
- Serverless Telegram relay: [api/send-telegram.ts](../api/send-telegram.ts) expects `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` on Vercel.
- Preview mode: serverless routes are unavailable; test Telegram on deployed Vercel preview.

## AI guardrails & caching
- Prefer cached responses to reduce 429s; avoid parallel bursts.

## Examples
- Add a project: append to `PROJECTS[]` in [constants.tsx](../constants.tsx); UI auto-renders in [components/Projects.tsx](../components/Projects.tsx).
- Add Gemini feature: extend [components/AIChatOverlay.tsx](../components/AIChatOverlay.tsx), update [types.ts](../types.ts), wire into [App.tsx](../App.tsx).
