<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# JULES Portfolio

**Modern Full-Stack Developer Portfolio with Interactive Design**

[![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://ai.studio/apps/drive/1Mc19lc1MymRczbhBJqCkLSam8B9dkyZI) • [Setup Guide](SETUP.md)

</div>

## 📋 Summary

A high-performance, motion-rich portfolio website showcasing full-stack development expertise. Features a multilingual interface (English, Russian, Czech), interactive 3D elements, Telegram chat integration, and a responsive design system built with React 19 and Tailwind CSS.

**Key Highlights:**
- 🎨 **Interactive Design**: 3D card effects, parallax scrolling, cursor trails, and magnetic buttons
- 🌍 **Multilingual**: Supports English, Russian, and Czech with dynamic language switching
- 📱 **Responsive**: Mobile-first design with optimized layouts for all screen sizes
- ⚡ **Performance**: Optimized bundle size (103.29 KB gzipped), lazy loading, and reduced motion support
- 💬 **Real-time Chat**: Telegram bot integration for direct communication
- ♿ **Accessible**: WCAG compliant with skip links, ARIA labels, and keyboard navigation

## ✨ Features

### Core Sections
- **Hero Section**: Interactive 3D card deck with mouse parallax effects and statistics showcase
- **Work Gallery**: Featured projects with detailed case studies, tech stacks, and live demos
- **About**: Services offered and comprehensive technical expertise listing
- **Contact**: Secure contact form with Telegram API integration and form validation
- **Chat Widget**: Real-time Telegram messaging with expandable interface

### Technical Features
- **Internationalization (i18n)**: Context-based translation system with localStorage persistence
- **Error Boundaries**: Graceful error handling with detailed fallback UI
- **Animation System**: Framer Motion with reduced motion detection
- **Scroll Features**: Progress indicator, smooth scroll navigation, and scroll-to-top
- **Security**: Input sanitization, rate limiting, and honeypot spam protection
- **SEO**: Optimized meta tags, semantic HTML, and accessibility features

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akira777777/ARTEMCV.git
   cd ARTEMCV
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional for Telegram features)
   ```bash
   cp .env.example .env.local
   # Add your VITE_TELEGRAM_CHAT_ID if using Telegram integration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:5173](http://localhost:5173)

### Alternative Development Commands
```bash
# Dev server with cache clearing (recommended for consistent results)
npm run dev:clean

# Build and preview production version locally
npm run dev:prod

# Run tests
npm run test

# Type checking
npm run typecheck
```

## 🏗️ Project Structure

```
ARTEMCV/
├── components/          # React components
│   ├── Hero.tsx        # Hero section with 3D effects
│   ├── WorkGallery.tsx # Project showcase
│   ├── About.tsx       # Services and tech stack
│   ├── ContactSectionSecure.tsx
│   ├── SimpleTelegramChat.tsx
│   └── ...             # Other UI components
├── api/                # Vercel serverless functions
│   └── send-telegram.ts
├── lib/                # Utility functions and hooks
├── public/             # Static assets (images, projects)
├── i18n.tsx            # Internationalization config
├── constants.tsx       # Projects and skills data
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.4 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.1.18
- **Animation**: Framer Motion 12.29.2
- **Icons**: Lucide React 0.563.0

### Backend & Deployment
- **Serverless**: Vercel Functions (@vercel/node)
- **API Integration**: Telegram Bot API
- **Hosting**: Vercel (configured with vercel.json)

### Development Tools
- **Testing**: Vitest 4.0.18 with Testing Library
- **Linting**: TypeScript compiler
- **Package Manager**: npm / pnpm

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

Output is in `dist/` directory:
- **Bundle Size**: ~103 KB gzipped
- **Build Time**: ~1.6s
- **Optimized**: Tree-shaking, minification, code splitting

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 🌐 Internationalization

The site supports three languages:
- **English** (default)
- **Russian** (Русский)
- **Czech** (Čeština)

Language detection priority:
1. User selection (stored in localStorage)
2. Browser language (`navigator.language`)
3. Default fallback (English)

Add new translations in `i18n.tsx` under the `translations` object.

## 📊 Performance Metrics

- **Bundle Size**: 325.73 KB (103.29 KB gzipped)
- **CSS**: 41.53 KB (7.76 KB gzipped)
- **Lighthouse Score**: Optimized for performance, accessibility, and SEO
- **Core Web Vitals**: LCP, FID, and CLS optimized

## 🔐 Environment Variables

Create `.env.local` for local development:

```env
# Optional: Telegram chat ID for contact form
VITE_TELEGRAM_CHAT_ID=your_chat_id

# Vercel serverless function needs these (set in Vercel dashboard):
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
ALLOWED_ORIGINS=https://yourdomain.com
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:clean` | Dev server with cache clearing |
| `npm run dev:prod` | Build and preview production locally |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run typecheck` | Check TypeScript types |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 📧 Contact

- **Portfolio**: [Live Demo](https://ai.studio/apps/drive/1Mc19lc1MymRczbhBJqCkLSam8B9dkyZI)
- **GitHub**: [@akira777777](https://github.com/akira777777)
- **Email**: Available through the portfolio contact form

---

**Built with ❤️ using React 19 + TypeScript + Vite**