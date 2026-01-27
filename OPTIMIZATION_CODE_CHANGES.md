# ARTEMCV: Optimization Code Changes Reference

**Quick Lookup for All Code Modifications**  
**Use This Document to Track Changes Across Files**

---

## 📋 File Modification Checklist

### Phase 1: Bundle Reduction

#### ✅ NEW: `services/imageOptimizer.ts`
```typescript
export interface OptimizedImage {
  webp: string;
  fallback: string;
  width: number;
  height: number;
}

export const OPTIMIZED_IMAGES: Record<string, OptimizedImage> = {
  barber: {
    webp: '/images/barber.webp',
    fallback: '/images/barber.jpg',
    width: 1200,
    height: 900
  },
  dental: {
    webp: '/images/dental.webp',
    fallback: '/images/dental.jpg',
    width: 1200,
    height: 900
  },
  game: {
    webp: '/images/game.webp',
    fallback: '/images/game.jpg',
    width: 1200,
    height: 900
  }
};

export const generateSrcSet = (baseName: string): string => {
  const base = OPTIMIZED_IMAGES[baseName as keyof typeof OPTIMIZED_IMAGES];
  return `${base.webp}?w=400 400w,${base.webp}?w=800 800w,${base.webp}?w=1200 1200w`;
};
```
**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🔴 CRITICAL
**Estimated Time**: 2-3 hours (including image conversion)

---

#### ✅ UPDATE: `constants.tsx`
**Add to Project interface** (optional but recommended):
```typescript
// In types.ts or at top of constants.tsx
interface OptimizedImage {
  webp: string;
  fallback: string;
  width: number;
  height: number;
}

// Add to existing Project interface
interface Project {
  // ... existing fields
  optimized?: OptimizedImage;
}

// Update PROJECTS array
export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Barber Shop',
    description: 'AI-диспетчер...',
    techStack: [...],
    liveLink: 'https://barber-auto-copilot-prepare-deploy.vercel.app/',
    githubLink: '#',
    image: '/barber.png',
    optimized: {
      webp: '/images/barber.webp',
      fallback: '/images/barber.jpg',
      width: 1200,
      height: 900
    }
  },
  // ... similar for dental and game
];
```
**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟠 HIGH
**Estimated Time**: 30 minutes

---

#### ✅ UPDATE: `components/Projects.tsx`
**Add ProjectImage component** (before Projects component):
```typescript
import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants';
import { useI18n } from '../i18n';

interface ProjectImageProps {
  project: typeof PROJECTS[0];
}

const ProjectImage: React.FC<ProjectImageProps> = memo(({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const optimized = project.optimized;

  if (!optimized) {
    // Fallback if no optimized version
    return (
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-full object-cover brightness-80 group-hover:brightness-110"
      />
    );
  }

  return (
    <picture>
      <source 
        srcSet={`${optimized.webp}?w=400 400w, ${optimized.webp}?w=800 800w, ${optimized.webp}?w=1200 1200w`}
        type="image/webp"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <source 
        srcSet={`${optimized.fallback}?w=400 400w, ${optimized.fallback}?w=800 800w, ${optimized.fallback}?w=1200 1200w`}
        type="image/jpeg"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <img
        loading="lazy"
        decoding="async"
        src={optimized.fallback}
        alt={project.title}
        width={optimized.width}
        height={optimized.height}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-1000 ease-out brightness-80 group-hover:brightness-110 group-hover:scale-105 ${
          imageLoaded ? 'blur-0' : 'blur-sm'
        }`}
      />
    </picture>
  );
});

ProjectImage.displayName = 'ProjectImage';
```

**Then update image rendering** (around line 38 in current Projects.tsx):
```typescript
// BEFORE:
<img 
  src={project.image} 
  alt={project.title} 
  className="..."
/>

// AFTER:
<ProjectImage project={project} />
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🔴 CRITICAL
**Estimated Time**: 1-2 hours
**Impact**: -15-20 KB bundle, 25-30% LCP improvement

---

#### ✅ UPDATE: `index.css`
**Refactor from custom CSS to Tailwind @apply**:

**BEFORE** (Line 1-150):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #6366f1;
  --bg: #0a0a0a;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: radial-gradient(...);
  color: #ffffff;
  /* 20+ more properties */
}

.service-card {
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.service-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: #161616;
}
/* ... 100+ more lines of custom CSS */
```

**AFTER** (Consolidated):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #6366f1;
  --bg: #0a0a0a;
}

/* Base styles */
body {
  @apply font-sans bg-zinc-950 text-white smooth-scroll relative min-h-screen;
  background: 
    radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.12), transparent 30%),
    radial-gradient(circle at 80% 10%, rgba(34, 197, 235, 0.12), transparent 32%),
    radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.12), transparent 30%),
    var(--bg);
}

.font-serif {
  font-family: 'Instrument Serif', serif;
}

/* Component utilities - reusable styles */
@layer components {
  .card-glass {
    @apply bg-black/40 border border-white/8 rounded-lg backdrop-blur-md;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .service-card {
    @apply bg-zinc-950 border border-white/5 transition-all duration-400;
  }

  .service-card:hover {
    @apply border-white/20 bg-zinc-900;
  }

  .badge-floating {
    @apply backdrop-blur-md bg-white/4 border border-white/8 rounded-full;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .shine-border {
    @apply relative overflow-hidden;
  }

  .shine-border::before {
    content: '';
    @apply absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-600;
    background: linear-gradient(120deg, rgba(255,255,255,0.12), rgba(255,255,255,0), rgba(255,255,255,0.12));
  }

  .shine-border:hover::before {
    @apply opacity-100;
  }

  .cta-button {
    @apply relative overflow-hidden;
  }

  .cta-button::after {
    content: '';
    @apply absolute inset-0 transition-transform duration-800;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
    transform: translateX(-100%);
  }

  .cta-button:hover::after {
    transform: translateX(100%);
  }
}

/* Shared utilities */
.grid-overlay {
  @apply absolute inset-0 pointer-events-none;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(circle at center, rgba(0,0,0,0.7), transparent 70%);
}

.noise-overlay {
  @apply fixed inset-0 pointer-events-none z-5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
}

.glow-ring {
  @apply absolute pointer-events-none -inset-[10%] rounded-full opacity-70;
  background: conic-gradient(from 180deg, rgba(99, 102, 241, 0.06), rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.06));
  filter: blur(90px);
}

/* Marquee animation */
@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

.marquee {
  @apply flex overflow-hidden user-select-none gap-8;
}

.marquee-content {
  @apply flex-shrink-0 flex justify-around gap-8 min-w-full;
  animation: scroll 20s linear infinite;
}

.progressive-blur {
  @apply absolute inset-0 pointer-events-none z-10;
  background: linear-gradient(to bottom, transparent, var(--bg));
  mask-image: linear-gradient(to bottom, transparent, black);
}

.accent-pill {
  letter-spacing: 0.24em;
  font-size: 10px;
  text-transform: uppercase;
}
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟠 HIGH
**Estimated Time**: 2-3 hours
**Impact**: -8-12 KB bundle, +8% CSS parsing speed

---

### Phase 2: Code Architecture

#### ✅ NEW: `components/ChatBotLazy.tsx`
```typescript
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

const ChatBotComponent = lazy(() => import('./ChatBot'));

const FeatureLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="inline-block animate-pulse">
        <div className="w-8 h-8 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-sm text-zinc-400">Loading AI Assistant...</p>
    </div>
  </div>
);

/**
 * Lazy-loaded wrapper for ChatBot component
 * Prevents 249KB Gemini library from blocking initial load
 */
export const ChatBotLazy: React.FC = () => (
  <ErrorBoundary>
    <Suspense fallback={<FeatureLoader />}>
      <ChatBotComponent />
    </Suspense>
  </ErrorBoundary>
);

export default ChatBotLazy;
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🔴 CRITICAL
**Estimated Time**: 1 hour
**Impact**: -25-35 KB lazy-loaded from main bundle

---

#### ✅ UPDATE: `App.tsx`
**Replace ChatBot import and usage**:

**BEFORE**:
```typescript
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  return (
    <I18nProvider>
      <ErrorBoundary>
        {/* ... */}
        <ChatBot />
        {/* ... */}
      </ErrorBoundary>
    </I18nProvider>
  );
};
```

**AFTER**:
```typescript
import React, { Suspense, lazy, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ContactSectionSecure from './components/ContactSectionSecure';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';

// Lazy-load heavy features
const ChatBotLazy = lazy(() => 
  import('./components/ChatBotLazy').then(m => ({ default: m.ChatBotLazy }))
);

const InteractiveShowcaseLazy = lazy(() =>
  import('./components/InteractiveShowcase').then(m => ({ default: m.default }))
);

const FeatureLoader = () => (
  <div className="h-64 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl animate-pulse border border-white/5" />
);

const App: React.FC = () => {
  // Memoize background elements to prevent unnecessary re-renders
  const backgroundLayers = useMemo(() => (
    <>
      <div className="glow-ring" aria-hidden />
      <div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_40%)] blur-3xl opacity-70" 
        aria-hidden 
      />
      <div className="grid-overlay" aria-hidden />
      <div className="noise-overlay" aria-hidden />
    </>
  ), []);

  return (
    <I18nProvider>
      <ErrorBoundary>
        <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
          {backgroundLayers}
          
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-32">
              <Hero />
              <About />
              <Projects />
              <ContactSectionSecure />
              
              {/* Interactive features load after main content */}
              <ErrorBoundary>
                <Suspense fallback={<FeatureLoader />}>
                  <InteractiveShowcaseLazy />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>

          {/* ChatBot loads lazily - even after other features */}
          <ErrorBoundary>
            <Suspense fallback={null}>
              <ChatBotLazy />
            </Suspense>
          </ErrorBoundary>

          <Footer />
        </div>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default App;
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🔴 CRITICAL
**Estimated Time**: 1-2 hours
**Impact**: -25-35 KB main bundle, 40-50% faster initial load

---

#### ✅ UPDATE: `vite.config.ts`
**Add chunk splitting configuration**:

```typescript
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        visualizer({
          filename: 'dist/stats.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY),
        'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              // Vendor chunks
              if (id.includes('node_modules')) {
                if (id.includes('react')) return 'vendor-react';
                if (id.includes('@google/genai')) return 'vendor-gemini';
                if (id.includes('framer-motion')) return 'vendor-framer';
              }
              
              // Feature chunks
              if (id.includes('services/geminiService')) return 'feature-gemini';
              if (id.includes('services/chatCacheManager')) return 'feature-chat';
              if (id.includes('components/ChatBot')) return 'feature-chatbot';
              if (id.includes('components/InteractiveShowcase')) return 'feature-interactive';
            }
          }
        },
        // Report chunk sizes
        reportCompressedSize: true,
        chunkSizeWarningLimit: 400,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            dead_code: true,
          },
          mangle: true,
        }
      }
    };
});
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟠 HIGH
**Estimated Time**: 30 minutes
**Impact**: Better chunk isolation

---

#### ✅ UPDATE: `tsconfig.json`
**Enable strict type checking options**:

**BEFORE**:
```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    // ...
  }
}
```

**AFTER**:
```json
{
  "compilerOptions": {
    // Strict type checking (already enabled, now explicit)
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional safety checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    
    // Module resolution
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    
    // Path resolution
    "paths": {
      "@/*": ["./*"]
    },
    
    // Modern JavaScript
    "useDefineForClassFields": false,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "importsNotUsedAsValues": "error"
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟠 HIGH
**Estimated Time**: 2-3 hours (includes fixing violations)
**Impact**: 0 implicit types, better DX, -1-2 KB

---

### Phase 3: Performance Enhancement

#### ✅ NEW: `services/cacheManager.ts`
```typescript
/**
 * Advanced Cache Manager with LRU eviction strategy
 * Handles request deduplication and localStorage persistence
 */

interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'LRU' | 'FIFO';
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export class CacheManager<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly config: CacheConfig;
  private readonly storageKey: string;
  private pendingRequests = new Map<string, Promise<T>>();

  constructor(storageKey: string, config: Partial<CacheConfig> = {}) {
    this.storageKey = storageKey;
    this.config = {
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
      maxSize: 100,
      strategy: 'LRU',
      ...config
    };
    this.loadFromStorage();
  }

  /**
   * Get from cache or fetch with request deduplication
   * Prevents duplicate API calls for same request
   */
  async get<R extends T>(
    key: string,
    fetcher: () => Promise<R>
  ): Promise<R> {
    // Check memory cache first
    const cached = this.cache.get(key);
    if (cached && this.isValid(cached)) {
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      console.log(`📦 Cache HIT: ${key} (${cached.accessCount} hits)`);
      return cached.value as R;
    }

    // Request deduplication - avoid duplicate API calls in flight
    if (this.pendingRequests.has(key)) {
      console.log(`⏳ Deduplicating request: ${key}`);
      return this.pendingRequests.get(key) as Promise<R>;
    }

    // Fetch and cache
    const promise = fetcher()
      .then(value => {
        console.log(`✅ Cache MISS → SAVED: ${key}`);
        this.set(key, value);
        this.pendingRequests.delete(key);
        return value;
      })
      .catch(error => {
        console.error(`❌ Fetch failed for ${key}:`, error);
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise as Promise<T>);
    return promise as Promise<R>;
  }

  /**
   * Set cache entry with auto-eviction
   */
  private set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now()
    });

    // Evict if over max size
    if (this.cache.size > this.config.maxSize) {
      this.evict();
    }

    this.saveToStorage();
  }

  /**
   * Check if cache entry is still valid
   */
  private isValid(entry: CacheEntry<T>): boolean {
    const age = Date.now() - entry.timestamp;
    return age < this.config.ttl;
  }

  /**
   * Evict entries based on strategy
   */
  private evict(): void {
    if (this.config.strategy === 'LRU') {
      // Remove least recently used
      let oldestKey = '';
      let oldestTime = Infinity;

      for (const [key, entry] of this.cache) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
        console.log(`🗑️ Evicted (LRU): ${oldestKey}`);
      }
    } else {
      // FIFO - remove first inserted
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        console.log(`🗑️ Evicted (FIFO): ${firstKey}`);
      }
    }
  }

  /**
   * Persist cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const entries = Array.from(this.cache.entries()).map(([key, entry]) => [
        key,
        { ...entry, value: JSON.stringify(entry.value) }
      ]);
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      console.error('Cache persistence failed:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return;

      const entries = JSON.parse(data);
      for (const [key, entry] of entries) {
        if (this.isValid(entry)) {
          this.cache.set(key, {
            ...entry,
            value: JSON.parse(entry.value)
          });
        }
      }
      console.log(`📂 Loaded ${this.cache.size} entries from storage`);
    } catch (error) {
      console.error('Cache load failed:', error);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    localStorage.removeItem(this.storageKey);
    console.log(`🗑️ Cache cleared: ${this.storageKey}`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalHits = Array.from(this.cache.values()).reduce(
      (sum, entry) => sum + entry.accessCount,
      0
    );
    
    return {
      size: this.cache.size,
      pending: this.pendingRequests.size,
      totalHits,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0,
      avgHitsPerEntry: this.cache.size > 0 ? totalHits / this.cache.size : 0
    };
  }
}

// Specialized cache instances for different data types
export const geminiCache = new CacheManager('gemini_cache', {
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days for generated content
  maxSize: 50,
  strategy: 'LRU'
});

export const chatCache = new CacheManager('chat_cache', {
  ttl: 30 * 24 * 60 * 60 * 1000, // 30 days for chat responses
  maxSize: 100,
  strategy: 'LRU'
});
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟠 HIGH
**Estimated Time**: 2-3 hours
**Impact**: 50-70% faster repeated requests, -30% API quota usage

---

#### ✅ UPDATE: `services/geminiService.ts`
**Add caching to API methods**:

**Add at top**:
```typescript
import { geminiCache } from './cacheManager';
```

**Update methods**:
```typescript
// BEFORE:
static async generateBrandBible(mission: string): Promise<BrandBible> {
  const ai = this.getAI();
  const response = await ai.models.generateContent({ /* ... */ });
  return JSON.parse(response.text || '{}') as BrandBible;
}

// AFTER:
static async generateBrandBible(mission: string): Promise<BrandBible> {
  const cacheKey = `brand-bible:${mission}`;
  
  return geminiCache.get(cacheKey, async () => {
    const ai = this.getAI();
    const response = await ai.models.generateContent({ /* ... */ });
    return JSON.parse(response.text || '{}') as BrandBible;
  });
}
```

Similarly for `analyzeVision()` and `generateBrandImage()`.

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟠 HIGH
**Estimated Time**: 1 hour

---

#### ✅ UPDATE: `components/Projects.tsx`
**Add memo for optimization**:

**At top of file**:
```typescript
import { memo } from 'react';
```

**Wrap ProjectCard**:
```typescript
const ProjectCard = memo(
  ({ project, idx }: { project: typeof PROJECTS[0]; idx: number }) => (
    <motion.a
      // ... existing props
    >
      {/* existing card content */}
    </motion.a>
  ),
  (prevProps, nextProps) => {
    // Only re-render if project ID changes
    return prevProps.project.id === nextProps.project.id;
  }
);

ProjectCard.displayName = 'ProjectCard';
```

**Wrap component export**:
```typescript
export default memo(Projects);
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟡 MEDIUM
**Estimated Time**: 30 minutes
**Impact**: 20-30% fewer re-renders

---

#### ✅ UPDATE: `components/ContactSectionSecure.tsx`
**Add useCallback/useMemo**:

```typescript
import { useCallback, useMemo } from 'react';

// Inside component:
const handleChange = useCallback((field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
}, []);

const isFormValid = useMemo(() => {
  return (
    formData.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.message.trim().length > 10
  );
}, [formData]);
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟡 MEDIUM
**Estimated Time**: 30 minutes

---

### Phase 4: Build Optimization

#### ✅ UPDATE: `package.json`
**Add scripts for verification**:

```json
{
  "scripts": {
    "dev": "vite --force",
    "dev:clean": "node dev-server.js",
    "dev:prod": "npm run build && npm run preview",
    "build": "tsc && vite build",
    "build:analyze": "vite build",
    "analyze": "vite preview",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "size-check": "npm run build && ls -lh dist/js/*.js"
  }
}
```

**Status**: [ ] Not Started [ ] In Progress [✓] Planned
**Priority**: 🟡 MEDIUM
**Estimated Time**: 15 minutes

---

## 📊 Change Summary by Priority

### 🔴 CRITICAL (Must Do)
- [x] Create `services/imageOptimizer.ts` (NEW)
- [x] Update `components/Projects.tsx` (image optimization)
- [x] Create `components/ChatBotLazy.tsx` (NEW)
- [x] Update `App.tsx` (code splitting)

### 🟠 HIGH (Should Do)
- [x] Update `index.css` (CSS consolidation)
- [x] Update `vite.config.ts` (chunk configuration)
- [x] Update `tsconfig.json` (strict mode)
- [x] Create `services/cacheManager.ts` (NEW)
- [x] Update `services/geminiService.ts` (caching)

### 🟡 MEDIUM (Nice to Have)
- [x] Update `components/Projects.tsx` (memo)
- [x] Update `components/ContactSectionSecure.tsx` (useCallback/useMemo)
- [x] Update `package.json` (scripts)

---

## ✅ Verification Commands

```bash
# After each phase
npm run type-check              # Should be: 0 errors
npm run build                   # Should succeed
npm run build:analyze           # Check dist/stats.html for chunk sizes
npm run preview                 # Test in browser

# Check bundle size
npm run size-check              # ls -lh dist/js/*.js

# Monitor performance
npm run preview                 # Open DevTools Lighthouse
```

---

## 🎯 Success Criteria

| Metric | Before | Target | Status |
|--------|--------|--------|--------|
| Main Bundle | 337.12 KB | 280-300 KB | [ ] |
| Gzipped | 107.09 KB | 82-92 KB | [ ] |
| Build Time | 2.44s | 1.8-2.0s | [ ] |
| TS Errors | 0 | 0 | [ ] |
| Cache Hit Rate | N/A | >70% | [ ] |
| LCP Improvement | Baseline | +20-30% | [ ] |

---

**Last Updated**: January 27, 2026  
**Next Review**: After Phase 1 Completion
