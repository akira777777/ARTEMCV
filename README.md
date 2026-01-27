
# Portfolio & Contact

A modern React-based portfolio with a Telegram-powered contact form.

## Features
- **Portfolio**: Showcases key projects with tech stack details and live links.
- **Contact Form → Telegram**: Submissions go directly to your Telegram via bot.
- **Dark/Light Theme**: Smooth theme transitions.

## Setup
1) **Install dependencies**: `npm install`
2) **Env (.env)**
	- `VITE_TELEGRAM_CHAT_ID=<your_chat_id>` (optional on client; used as hint)
	- For ChatBot (if mounted): `VITE_API_KEY=<gemini_key>`
3) **Run dev**: `npm run dev`

## Technologies Used
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Integrations**: Telegram Bot API for contact delivery
- **Animations**: Tailwind transitions, CSS Keyframes
- **UI**: Custom SVG icons and Plus Jakarta Sans typography

## Deployment (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables** (Project Settings → Environment Variables):
	- `TELEGRAM_BOT_TOKEN` (secret, required for /api/send-telegram)
	- `TELEGRAM_CHAT_ID` (destination chat/channel)
	- `VITE_TELEGRAM_CHAT_ID` (optional client hint)
	- `VITE_API_KEY` (only if ChatBot is enabled)

## Serverless function for Telegram
- Endpoint: `/api/send-telegram` (see `api/send-telegram.ts`)
- Runs only in serverless environment (not available in `npm run preview`).
- Validates input, honeypot anti-spam, 12s timeout, returns JSON with error details on failure.

### Useful Scripts
- Dev (fresh): `npm run dev`
- Clean dev: `npm run dev:clean`
- Build: `npm run build`
- Preview build: `npm run preview`

## Troubleshooting
- **Telegram delivery**: In production, set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. On local preview, serverless functions are unavailable.
- **ChatBot**: Needs `VITE_API_KEY` (Gemini). 429/401 errors surface in the widget text.

## Deployment checklist (Vercel)
1) **Connect repo**: Vercel → Import project → pick this repo.
2) **Env (Project Settings → Environment Variables)**:
	- `TELEGRAM_BOT_TOKEN` (required, secret)
	- `TELEGRAM_CHAT_ID` (required)
	- `VITE_TELEGRAM_CHAT_ID` (optional client hint)
	- `VITE_API_KEY` (only if enabling ChatBot)
3) **Build settings**: Framework Vite; Build `npm run build`; Output `dist`.
4) **Deploy**: Trigger build; verify dist/stats.html if you want bundle view.
5) **Smoke test**: Open preview URL, submit contact form (serverless function live), check success/error banners.
