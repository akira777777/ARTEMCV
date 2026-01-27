
# Brand Identity Generator & Portfolio

A modern React-based portfolio with an AI-powered Brand Identity Generator.

## Features
- **Brand Bible Generator (code-ready)**: Enter a mission statement to generate identity (palette, fonts, AI logos). Component exists but is not mounted by default.
- **Portfolio**: Showcases key projects with tech stack details and live links.
- **AI Chatbot (code-ready)**: Gemini-powered assistant for Q&A. Component exists but is not mounted by default.
- **Dark/Light Theme**: Smooth theme transitions.
- **Image Generation**: High-quality generation via `gemini-3-pro-image-preview`.

## Setup
1. **API Key**: Prepare a valid Google Gemini API key.
2. **Environment Variable**: Prefer `VITE_API_KEY`. Local dev: create `.env` with `VITE_API_KEY=...`.
3. **Install Dependencies**: `npm install`
4. **Run Dev Server**: `npm run dev`

## Technologies Used
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)
- **Animations**: Tailwind transitions, CSS Keyframes
- **UI**: Custom SVG icons and Plus Jakarta Sans typography

## Deployment (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_API_KEY` in Vercel Project Settings → Environment Variables.
- **Env Mapping**: [vite.config.ts](vite.config.ts) maps `VITE_API_KEY`/`GEMINI_API_KEY`/`API_KEY` into both `process.env.*` and `import.meta.env.VITE_API_KEY` for the build.

### Enabling AI Features in UI
- **ChatBot**: Uncomment import and render in [App.tsx](App.tsx) to enable the floating assistant panel.
- **Brand Generator**: Import and render `<BrandGenerator />` in [App.tsx](App.tsx) (e.g., in `main`) or add routing if desired.

### Useful Scripts
- Dev (fresh): `npm run dev`
- Clean dev: `npm run dev:clean`
- Build: `npm run build`
- Preview build: `npm run preview`

## Troubleshooting
- **Missing key**: If you see `Missing Gemini API key. Set VITE_API_KEY for Vite builds.` (from [services/geminiService.ts](services/geminiService.ts)), add `VITE_API_KEY` in Vercel → Project Settings → Environment Variables, redeploy; for local dev create `.env` with `VITE_API_KEY=...`.
- **Build-time injection check**: In browser devtools, verify `import.meta.env.VITE_API_KEY` exists. Vite inlines only `VITE_*` at build time. Mapping is defined in [vite.config.ts](vite.config.ts).
- **401 Unauthorized**: Invalid/missing key or disabled API. Rotate the Gemini API key, ensure the Google project has GenAI access, and redeploy so Vite picks up the variable.
- **429 Rate limit**: Too many requests. Avoid launching heavy parallel image jobs repeatedly; the Brand Generator fires six image tasks. Add delays, reduce image size, or stagger calls. Consider a server proxy with retry/backoff for production.
- **Empty image response**: If `response.candidates[0].content.parts[].inlineData` is absent, the request may be blocked by safety filters. Adjust prompt style, ensure white background requirement, and retry.
- **Env mismatch between README and code**: Prefer `VITE_API_KEY`. `API_KEY` and `GEMINI_API_KEY` are mapped by [vite.config.ts](vite.config.ts) but may not exist on Vercel unless you set them. Use `VITE_API_KEY` to keep things consistent.
