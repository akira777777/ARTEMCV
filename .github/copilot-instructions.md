AI Coding Guide — ARTEMCV

Architecture & Entry Points
- React 19 + TypeScript on Vite; Tailwind-style utility classes dominate.
- Entry [index.tsx](index.tsx) mounts `<App />` into `#root`; keep [index.html](index.html) consistent if changing mount points.
- Current homepage wires portfolio only: [App.tsx](App.tsx) renders `Header`, `Hero`, `About`, `Projects`, `Footer`. `ChatBot` and `BrandGenerator` exist but are not mounted.

Commands & Dev Workflow
- Dev: `npm run dev` (forces Vite fresh start), Clean dev: `npm run dev:clean` (runs dev-server.js), Prod preview: `npm run dev:prod` → build then preview.
- Build: `npm run build`; Preview static build locally: `npm run preview`.

Environment & API Keys
- Gemini key sources are unified in [vite.config.ts](vite.config.ts): maps `VITE_API_KEY`/`GEMINI_API_KEY`/`API_KEY` into both `process.env.*` and `import.meta.env.VITE_API_KEY` via `define`.
- [services/geminiService.ts](services/geminiService.ts) reads `import.meta.env.VITE_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY` and throws if missing.
- For local dev, create `.env` with `VITE_API_KEY=...` then `npm run dev`. For Vercel/Netlify, set `VITE_API_KEY` in project env.

AI Integration (GeminiService)
- Centralized wrapper for Gemini models: `gemini-3-pro-preview` (JSON brand bible & vision), `gemini-3-pro-image-preview` (image generation), `gemini-2.5-flash-image` (image editing), `gemini-3-flash-preview` (chat with `googleSearch`).
- JSON responses are parsed from `response.text`; validate schemas when adjusting prompts or types.
- Image responses are extracted from `response.candidates[0].content.parts[].inlineData` (base64 → `data:image/png;base64,...`).

Brand Generator (components/BrandGenerator.tsx)
- Flow: submit triggers parallel `generateBrandBible()` + abstract placeholder, then launches six logo synth tasks: `primary`, `mono`, `simplified`, `grayscale`, `sec1`, `sec2` using selected aspect ratio.
- Vision Sync: drop an image → base64 → `analyzeVision()` to prefill mission.
- Edit: `editImage()` mutates last image for a key with an edit prompt; per-key loading flags and inline cinematic skeleton animations.
- To enable in UI, import and render `<BrandGenerator />` (currently not wired into App).

Chatbot (components/ChatBot.tsx)
- Local `messages` state; requests reuse history as Gemini `parts`. Displays grounding sources as external links.
- Floating panel toggled by `isOpen`; scroll anchoring via `chatRef`. To enable, uncomment import and `<ChatBot />` in [App.tsx](App.tsx).

Data & Types
- Portfolio content in [constants.tsx](constants.tsx) (`PROJECTS`, `SKILLS`); extend lists rather than hard-coding in components.
- Shared types in [types.ts](types.ts) (`BrandBible`, `ImageSize`, `ChatMessage`, etc.); add new payloads here to keep components and services aligned.

Styling & Conventions
- Tailwind utilities control layout/typography; high-contrast dark theme, rounded “capsule” shapes, and inline keyframes (Hero/BrandGenerator). Match this aesthetic when adding views.
- Components are presentational with minimal props; share cross-cutting state via `App` instead of duplicating service calls.

Gotchas & Notes
- README lists React 18, but actual versions are React 19 (see [package.json](package.json)).
- If API calls fail, verify env key mapping via [vite.config.ts](vite.config.ts) and that `VITE_API_KEY` is set at build time (Vite only inlines `import.meta.env.VITE_*`).

Examples
- Add a new AI feature: create a method in `GeminiService`, define return types in `types.ts`, call from a new component, and ensure `VITE_API_KEY` is available.
- Wire Brand Generator: import component in [App.tsx](App.tsx) and render it in `main`; keep aspect ratio selection consistent with `selectedRatio`.