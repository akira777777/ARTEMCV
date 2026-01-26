
# Brand Identity Generator & Fullstack Portfolio

A modern React-based application that serves as a professional portfolio while providing an AI-powered Brand Identity Generator.

## Features
- **Brand Bible Generator**: Enter a mission statement, and get a complete identity including palette, fonts, and AI-generated logos.
- **Fullstack Portfolio**: Showcases key projects with tech stack details and live links.
- **AI Chatbot**: Gemini-powered assistant to answer questions about the portfolio or design.
- **Dark/Light Theme**: Smooth transitions between themes.
- **Image Generation**: Integrated high-quality image generation using `gemini-3-pro-image-preview`.

## Setup
1. **API Key**: Ensure you have a valid Google Gemini API key.
2. **Environment Variable**: Set `API_KEY` in your environment.
3. **Install Dependencies**: `npm install`
4. **Run Dev Server**: `npm run dev`

## Technologies Used
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)
- **Animations**: Tailwind transitions, CSS Keyframes
- **Icons/UI**: Custom SVG icons and Plus Jakarta Sans typography

## Deployment
This app is ready to be deployed on Vercel or Netlify. Ensure the `API_KEY` environment variable is added to your provider's dashboard.
