
# Portfolio & Contact

A modern React-based portfolio with a Telegram-powered contact form.

## Features
- **Portfolio**: Showcases key projects with tech stack details and live links.
- **Contact Form → Telegram**: Submissions go directly to your Telegram via bot.
- **Dark/Light Theme**: Smooth theme transitions.

## Setup
1. **Telegram Chat ID**: Add to `.env` → `VITE_TELEGRAM_CHAT_ID=your_chat_id`.
2. **Install Dependencies**: `npm install`
3. **Run Dev Server**: `npm run dev`

## Technologies Used
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Integrations**: Telegram Bot API for contact delivery
- **Animations**: Tailwind transitions, CSS Keyframes
- **UI**: Custom SVG icons and Plus Jakarta Sans typography

## Deployment (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_TELEGRAM_CHAT_ID` in Vercel Project Settings → Environment Variables.

### Useful Scripts
- Dev (fresh): `npm run dev`
- Clean dev: `npm run dev:clean`
- Build: `npm run build`
- Preview build: `npm run preview`

## Troubleshooting
- **Telegram delivery**: Ensure `VITE_TELEGRAM_CHAT_ID` is set and the bot token in code is valid. Message errors will surface in the form UI.
