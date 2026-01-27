# ARTEMCV: AI Agent Instructions

## Architecture & Data Flow
- SPA on Vite: root layout in App.tsx; entry in index.tsx mounts <App /> to #root.
- Always-mounted sections: Header, Hero, About, Projects, Footer, ContactSection.
- Optional ChatBot: components/ChatBot.tsx, mount in App.tsx after Footer when enabling Gemini Q&A.
- AI layer: components never call Gemini directly; use services/geminiService.ts (static methods, typed responses).
- Content source of truth: constants.tsx (PROJECTS, SKILLS). Define new types in types.ts; components map arrays.
- Contact form → serverless: ContactSection posts to api/send-telegram.ts (Vercel). Client hint uses VITE_TELEGRAM_CHAT_ID; server requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.

## Conventions & Patterns
- Tailwind only for styling; no CSS Modules or styled-components. Dark theme by default; high-contrast, rounded UI, subtle glow.
- i18n: i18n.tsx + LanguageSwitcher.tsx handle language toggling; keep copy centralized.
- Error boundaries: components/ErrorBoundary.tsx available; wrap interactive areas when adding new features.
- AI request hygiene: services/chatCacheManager.ts dedups duplicate questions; rate limiting guards 429; services/imageCacheManager.ts caches image outputs.

## Environment & Secrets
- Vite inlines only import.meta.env.VITE_*; set VITE_API_KEY for Gemini (ChatBot only) and VITE_TELEGRAM_CHAT_ID for client hint.
- Serverless (Vercel): TELEGRAM_BOT_TOKEN (secret), TELEGRAM_CHAT_ID (destination). ChatBot does not require serverless.
- Fallbacks in vite.config.ts map GEMINI_API_KEY and API_KEY, but prefer VITE_API_KEY to avoid surprises.

## Workflows
- Dev: npm run dev (fresh dev server). If cache issues, use npm run dev:clean.
- Build: npm run build; Preview: npm run preview (serverless routes unavailable here).
- Enable ChatBot: import and render ChatBot in App.tsx; ensure VITE_API_KEY is set; Gemini calls go through geminiService.

## Integration Examples
- Add project: append to PROJECTS[] in constants.tsx; Projects.tsx auto-renders cards (id, title, description, techStack, liveLink, githubLink, image).
- New AI feature: add a static method in geminiService.ts → define types in types.ts → create a component using the method → wire in App.tsx.
- Telegram contact: use api/send-telegram.ts for submissions; includes validation, honeypot anti-spam, and 12s timeout; available only in serverless env.

## Gotchas
- Source of truth is package.json (React 19), not README.
- Avoid parallel Gemini requests that exceed quotas; use provided caching/rate limiting.
- In preview mode serverless functions won’t run; test contact delivery on a deployed preview in Vercel.
