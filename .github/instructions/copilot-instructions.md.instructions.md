AI coding guide for this repo

- Stack and run

  - React 19 + TypeScript on Vite; Tailwind-style classes dominate styling. Scripts: `npm run dev`, `npm run build`, `npm run preview` (see package.json). No tests configured.
  - Google Gemini API key is required; frontend code reads `process.env.API_KEY` inside the Gemini service, so ensure the key is injected into the Vite build (e.g., env var exposure or `define` shim) before expecting API calls to work.
- App structure

  - Entry at index.tsx mounts `<App />` into the `root` element; keep index.html in sync if changing mount points.
  - App state is minimal: theme toggle adds/removes the `dark` class on `document.documentElement`, and `activeTab` switches between the portfolio view and the Identity Lab generator (App.tsx).
  - Header controls tab switching; theme prop is plumbed but currently unused. Stick to this pattern if extending nav behavior (components/Header.tsx).
- Data and content

  - Portfolio data lives in constants.tsx (`PROJECTS`, `SKILLS`) and is rendered by Projects/About; extend these lists instead of hard-coding in components.
  - Shared types (Theme, Project, BrandBible, chat message shapes) are centralized in types.ts; add new API payloads here for consistency.
- Gemini integration (services/geminiService.ts)

  - Single service wraps all Gemini calls; reuse it for new AI features to keep API key handling centralized.
  - Models in use: `gemini-3-pro-preview` for JSON brand bibles, `gemini-3-pro-image-preview` for logo synthesis and placeholders, `gemini-2.5-flash-image` for edits, `gemini-3-flash-preview` with googleSearch tool for chat.
  - Responses that are expected to be JSON are parsed from `response.text`; defensive checks are minimal, so validate schemas when changing prompts.
- Brand Generator flow (components/BrandGenerator.tsx)

  - On submit: clears prior state, requests brand bible and abstract placeholder in parallel; then kicks off image generation for six logo variants keyed as `primary`, `mono`, `simplified`, `grayscale`, `sec1`, `sec2`.
  - Image generation is per-key with loading flags; editing uses `editImage` against the last saved base64 for that key.
  - Aspect ratios are user-selectable; keep new image requests aligned with `selectedRatio`. Placeholder animations and keyframes are defined inline at the bottom of the component.
  - Vision Sync uploads an image, base64-encodes it, and sends it to `analyzeVision` to prefill the mission text.
- Chatbot (components/ChatBot.tsx)

  - Chat history is tracked locally; requests reuse existing messages as `parts` for `GeminiService.chat`. Grounding sources (if present) are surfaced as outbound links.
  - UI is a floating panel toggled by `isOpen`; keep scroll anchoring by updating the `chatRef` logic if modifying the DOM.
- UI and styling conventions

  - Tailwind utility classes drive layout/typography; custom animations live inline (Hero marquee, BrandGenerator keyframes). Preserve the high-contrast dark theme and rounded “capsule” shapes when adding sections.
  - Components favor presentational logic with minimal props; share new cross-cutting state through App rather than duplicating service calls.
- Deployment and envs

  - App is static-build ready (Vercel/Netlify). Expose the Gemini key to Vite builds via `VITE_API_KEY` (preferred) or a `define` shim; Vite only inlines `import.meta.env.VITE_*` at build-time.
  - Runtime access: services/geminiService.ts currently reads `process.env.API_KEY`; either switch to `import.meta.env.VITE_API_KEY` in code or map `API_KEY` → `VITE_API_KEY` using `define` in `vite.config.ts` or your deploy provider’s env rewrite.
  - Provider notes: Vercel/Netlify → add `VITE_API_KEY` in project env UI; local dev → `.env` with `VITE_API_KEY=...` then `npm run dev`.

If any section feels thin or you need more specifics (e.g., how to expose API_KEY in your deploy target), tell me and I’ll refine this guide.
