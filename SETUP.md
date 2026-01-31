# AstraDev Portfolio

Full Stack developer portfolio featuring Jules Engineer's work and expertise.
## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development (Recommended: use preview for testing)
```bash
# Build and test production build
npm run dev:prod

# Or use dev server with forced cache clear
npm run dev:clean

# Regular dev (may have caching issues)
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## ✨ Features

- **Modern Stack**: React 19 + TypeScript + Vite 7.3.1
- **Animations**: Framer Motion for smooth, performant animations
- **Styling**: Tailwind CSS with custom utilities
- **Responsive**: Mobile-first, fully responsive design
- **Fast**: Optimized builds, production-ready
- **Personalized**: Content in Russian (Jules Engineer's portfolio)
## 📊 Performance

- **Bundle Size**: 325.73 KB (103.29 KB gzipped)
- **Build Time**: ~1.6s
- **Modules**: 391 modules optimized
- **CSS**: 41.53 KB (7.76 KB gzipped)

## 🔧 Tech Stack

- **Frontend**: React 19.2.3, TypeScript 5.8.2
- **Build**: Vite 7.3.1
- **Styling**: Tailwind CSS 3.4.17, PostCSS 8.4.49
- **Animation**: Framer Motion 11.18.2
- **API**: Google Gemini AI integration

## 📝 Scripts

- `npm run dev` - Start dev server (use `--force` flag to clear cache)
- `npm run dev:clean` - Dev server with automatic cache clearing
- `npm run dev:prod` - Build and test production version locally
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## ✅ Known Issues & Solutions

### Dev Server Caching Issue (Fixed with Vite 7.3.1)
If you experience old code being served in dev mode:
```bash
# Use production preview instead
npm run dev:prod

# Or clear cache and restart
npm run dev:clean

# Or use dev with forced cache clear
npm run dev -- --force
```

## 🌐 Deployment

The site is production-ready and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

Build output is in the `dist/` directory after running `npm run build`.

## 📧 Contact

- **Portfolio**: This site
- **GitHub**: [akira777777](https://github.com/akira777777)
- **Email**: Check the portfolio contact section

---

**Last Updated**: January 2026  
**Vite Version**: 7.3.1  
**React Version**: 19.2.3
