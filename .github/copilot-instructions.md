# ARTEMCV: AI Coding Guide

## System Architecture

**Tech Stack:** React 19 + TypeScript on Vite + Tailwind CSS + Google Gemini API (`@google/genai`)

**Core Pattern:**
- Single-page React app: [App.tsx](App.tsx) is the root layout. Entry [index.tsx](index.tsx) mounts `<App />` into `#root`.
- **Main components** (always visible): `Header`, `Hero`, `About`, `Projects`, `Footer`.
- **Optional features** (self-contained, currently not mounted): `BrandGenerator`, `ChatBot`. Enable by importing and rendering in [App.tsx](App.tsx).
- **AI layer:** All Gemini API calls go through [services/geminiService.ts](services/geminiService.ts) (static methods). Components never touch the API directly.
- **Shared data:** Portfolio content in [constants.tsx](constants.tsx) (`PROJECTS`, `SKILLS`). New types go to [types.ts](types.ts).

## Critical Developer Workflows

### Local Development Commands
```bash
npm run dev          # Fresh Vite dev server (--force flag)
npm run dev:clean    # Runs dev-server.js (custom Node watcher)
npm run build        # Production Vite build
npm run preview      # Serve static dist/ locally
```

### Enabling AI Features in UI
1. **BrandGenerator.tsx** → Import in [App.tsx](App.tsx), render in `<main>`.
2. **ChatBot.tsx** → Import in [App.tsx](App.tsx), render after `<Footer />`. Creates floating toggle button.
Both are fully functional; just need mounting in the component tree.

## Environment & API Keys (Critical)

**Setup:**
- **Local:** Create `.env` with `VITE_API_KEY=your_gemini_key`, then `npm run dev`.
- **Vercel:** Add `VITE_API_KEY` in Project Settings → Environment Variables.
- **Why:** [vite.config.ts](vite.config.ts) inlines `VITE_*` vars at build time. Triple fallback: `VITE_API_KEY` → `GEMINI_API_KEY` → `API_KEY`.
- [geminiService.ts](services/geminiService.ts) checks fallback chain at runtime; throws if all missing.

**Critical:** Vite only inlines `import.meta.env.VITE_*`. Setting `API_KEY` or `GEMINI_API_KEY` alone won't work unless mapped in vite.config.ts.

## AI Service Layer (GeminiService)

| Method | Model | Purpose | Returns |
|--------|-------|---------|---------|
| `generateBrandBible(mission)` | gemini-3-pro-preview | Full brand identity (palette, fonts, 6 logo prompts) | BrandBible |
| `analyzeVision(base64Image)` | gemini-3-pro-preview | Extract mission & keywords from image | { mission, keywords[] } |
| `generateBrandImage(prompt, size, style, ratio)` | gemini-3-pro-image-preview | Generate logo/mark | Base64 image string |
| `editImage(base64, editPrompt)` | gemini-2.5-flash-image | Refine generated image | Base64 image string |
| `chat(messages, signal?)` | gemini-3-flash-preview + googleSearch | Q&A with web grounding | { text, sources[] } |
| `generateAbstractPlaceholder(size, ratio)` | gemini-3-pro-image-preview | Quick visual placeholder | Base64 image string |

**Response Patterns:**
- JSON: Parse from `response.text`, validate schema, cast to [types.ts](types.ts) interface.
- Images: Extract from `response.candidates[0]?.content?.parts[]?.inlineData.data` (base64), prepend `data:image/png;base64,`.

## Component Deep Dives

### BrandGenerator (components/BrandGenerator.tsx)
**Flow:**
1. User submits mission → trigger parallel `generateBrandBible()` + `generateAbstractPlaceholder()`.
2. Show abstract placeholder immediately (UX win).
3. Once Bible ready, launch 6 parallel logo tasks (primary, mono, simplified, grayscale, sec1, sec2) respecting `selectedRatio`.
4. Vision mode: Drop image → base64 → `analyzeVision()` → prefill mission.
5. Edit mode: Click image → type edit prompt → `editImage()` mutates that key.

**State Management:** Fully local (mission, bible, images, loadingImages, selectedRatio, editMode). No Redux/Context.

### ChatBot (components/ChatBot.tsx)
**Design:**
- Local `messages: { role, text, sources? }[]` state.
- Each request includes full history as Gemini `parts` (stateful conversation).
- Web search grounding: Gemini returns source URIs; ChatBot displays them as clickable links.
- Floating panel toggled by `isOpen`; scroll anchors latest message via `chatRef`.

## Data & Extensibility

**Portfolio:** Extend [constants.tsx](constants.tsx)—don't hard-code in components.
- `PROJECTS[]` → Project card array (id, title, description, techStack, liveLink, githubLink, image path).
- `SKILLS[]` → Skill categories (name, items[]).

**Example:** Add project → append to `PROJECTS[]` → [Projects.tsx](components/Projects.tsx) auto-renders (it maps the array).

## Styling & Aesthetic

- **Framework:** Tailwind CSS utilities only. NO styled-components, CSS modules.
- **Theme:** High-contrast dark mode by default. Smooth transitions on theme toggle.
- **Shapes:** Rounded capsule buttons (`rounded-full`), subtle borders (`border-gray-700`), soft glows.
- **Animations:** Inline `<style>` keyframes for cinematic effects (BrandGenerator skeleton load, Hero parallax). Prefer CSS over Framer Motion for weight.
- **Typography:** Plus Jakarta Sans (imported in [index.css](index.css)); Google Fonts fallbacks in [tailwind.config.js](tailwind.config.js).

**When adding features:** Match the minimalist dark aesthetic; use high contrast, rounded shapes, subtle animations.

## Testing & Debugging

**Build Verification:**
- `npm run build` → Check `dist/` folder exists and is NOT empty.
- `npm run preview` → Serves static build; validates Vite env inlining and asset paths.

**API Issues:**
- Missing key: DevTools Console shows `Missing Gemini API key...` → Verify `.env` (local) or Vercel env vars.
- Empty images: Gemini safety classifier may block prompt → Rephrase or add "professional logo, white background".
- 429 rate limit: Don't launch 6 parallel image tasks repeatedly → Stagger or add delays.

## Known Quirks

1. README says React 18, but [package.json](package.json) has React 19. Use package.json as source of truth.
2. Vite inlines only `VITE_*` at build time. Triple fallback in vite.config.ts handles `GEMINI_API_KEY` and `API_KEY`, but always set `VITE_API_KEY`.
3. If `generateBrandBible()` returns `{}`, schema validation failed in Gemini API. Check prompt in method + Gemini logs.
4. BrandGenerator aspect ratios: 8 predefined options. Pass `selectedRatio` consistently to image generation.

## Quick Recipes

**Add AI feature:**
1. Static method in GeminiService (call Gemini, return typed response).
2. Types in [types.ts](types.ts).
3. React component (local state, call method).
4. Wire in [App.tsx](App.tsx), ensure `.env` has `VITE_API_KEY`.

**Extend portfolio:**
Add object to `PROJECTS[]` in [constants.tsx](constants.tsx) → [Projects.tsx](components/Projects.tsx) auto-renders.

**Update theme colors:**
Modify [tailwind.config.js](tailwind.config.js) or pull dynamically from BrandGenerator API response.
