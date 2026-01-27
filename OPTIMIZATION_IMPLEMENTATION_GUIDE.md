# ARTEMCV Optimization Implementation Guide

**Quick Reference for Priority Optimizations**  
**Status**: Ready to Implement  
**Estimated Total Impact**: 50-65 KB bundle reduction + 20-30% performance gain

---

## 🎯 Phase 1: Critical Wins (Week 1)

### Phase 1a: Image Optimization [15-20 KB savings]

**Files to Create/Modify**:
- [ ] Create `services/imageOptimizer.ts`
- [ ] Update `components/Projects.tsx`
- [ ] Convert images to WebP format

**Key Implementation**:
```typescript
// services/imageOptimizer.ts - NEW FILE
export const OPTIMIZED_IMAGES = {
  barber: { webp: '/images/barber.webp', fallback: '/images/barber.jpg', width: 1200, height: 900 },
  dental: { webp: '/images/dental.webp', fallback: '/images/dental.jpg', width: 1200, height: 900 },
  game: { webp: '/images/game.webp', fallback: '/images/game.jpg', width: 1200, height: 900 }
};

export const generateSrcSet = (baseName: string): string => {
  const base = OPTIMIZED_IMAGES[baseName as keyof typeof OPTIMIZED_IMAGES];
  return `${base.webp}?w=400 400w, ${base.webp}?w=800 800w, ${base.webp}?w=1200 1200w`;
};
```

```tsx
// components/Projects.tsx - Add image component
const ProjectImage: React.FC<{ project: Project; idx: number }> = ({ project }) => (
  <picture>
    <source srcSet={`${project.image.webp}?w=800 800w`} type="image/webp" />
    <source srcSet={`${project.image.fallback}?w=800 800w`} type="image/jpeg" />
    <img
      loading="lazy"
      decoding="async"
      src={project.image.fallback}
      alt={project.title}
      width={1200}
      height={900}
      className="w-full h-full object-cover"
    />
  </picture>
);
```

**Image Conversion Commands**:
```bash
# Requires ImageMagick/cwebp
cwebp -q 80 public/barber.png -o public/images/barber.webp
cwebp -q 80 public/dental.png -o public/images/dental.webp
cwebp -q 80 public/game.png -o public/images/game.webp

# Or use Squoosh: https://squoosh.app/
```

---

### Phase 1b: CSS Consolidation [8-12 KB savings]

**File to Update**: `index.css`

**Key Changes**:
1. Move custom CSS to `@layer components`
2. Use `@apply` directives for Tailwind utilities
3. Remove duplicate styles

```css
/* BEFORE: 227 lines of custom CSS
AFTER: 150 lines with Tailwind @apply */

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
}
```

**Validation**:
```bash
npm run build
# Expected: Main bundle ~315-320 KB (down from 337 KB)
```

---

## 🚀 Phase 2: Code Architecture (Week 2)

### Phase 2a: Code Splitting Setup [25-35 KB lazy-loaded]

**Files to Create/Modify**:
- [ ] Create `components/ChatBotLazy.tsx`
- [ ] Update `App.tsx` for Suspense boundaries
- [ ] Update `vite.config.ts` for chunk strategy

**Implementation**:
```tsx
// components/ChatBotLazy.tsx - NEW FILE
import { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

const ChatBotComponent = lazy(() => import('./ChatBot'));

const FeatureLoader = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-pulse text-zinc-400">Loading AI Assistant...</div>
  </div>
);

export const ChatBotLazy: React.FC = () => (
  <ErrorBoundary>
    <Suspense fallback={<FeatureLoader />}>
      <ChatBotComponent />
    </Suspense>
  </ErrorBoundary>
);
```

```tsx
// App.tsx - Update imports
const ChatBotLazy = lazy(() => 
  import('./components/ChatBotLazy').then(m => ({ default: m.ChatBotLazy }))
);

// Add to App component JSX
<ErrorBoundary>
  <Suspense fallback={null}>
    <ChatBotLazy />
  </Suspense>
</ErrorBoundary>
```

**Update vite.config.ts**:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('react')) return 'vendor-react';
          if (id.includes('@google/genai')) return 'vendor-gemini';
          if (id.includes('framer-motion')) return 'vendor-framer';
        }
        if (id.includes('components/ChatBot')) return 'feature-chatbot';
      }
    }
  }
}
```

---

### Phase 2b: TypeScript Strict Mode [Quality + 1-2 KB]

**File to Update**: `tsconfig.json`

**Key Additions**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

**Verification**:
```bash
npm run type-check
# Should have 0 errors
```

---

## ⚡ Phase 3: Performance Enhancement (Week 3)

### Phase 3a: Component Memoization [20-30% runtime improvement]

**Files to Update**:
- [ ] `components/Projects.tsx` - memo ProjectCard
- [ ] `components/ContactSectionSecure.tsx` - useCallback handlers
- [ ] `components/About.tsx` - useMemo skill lists

**Implementation Pattern**:
```tsx
import { memo, useCallback, useMemo } from 'react';

const ProjectCard = memo(({ project, idx }: Props) => (
  // Component JSX
), (prev, next) => {
  return prev.project.id === next.project.id;
});

const ParentComponent = memo(() => {
  const handleChange = useCallback((value: string) => {
    // Handler logic
  }, []);
  
  const memoizedList = useMemo(() => {
    return PROJECTS.map(p => p.name);
  }, []);
  
  return // JSX
});
```

---

### Phase 3b: Enhanced Caching [50-70% repeated request improvement]

**File to Create**: `services/cacheManager.ts`

**Implementation Includes**:
- LRU eviction strategy
- Request deduplication
- localStorage persistence
- Hit rate tracking

```typescript
// services/cacheManager.ts - COMPREHENSIVE CACHE LAYER
// See COMPREHENSIVE_OPTIMIZATION_PLAN.md Section 2.3 for full code

export class CacheManager<T> {
  async get<R extends T>(
    key: string,
    fetcher: () => Promise<R>
  ): Promise<R> {
    // Check memory cache
    // Implement request deduplication
    // Fetch with LRU eviction
    // Persist to storage
  }
}
```

**Update GeminiService**:
```typescript
import { geminiCache } from './cacheManager';

static async generateBrandBible(mission: string): Promise<BrandBible> {
  return geminiCache.get(`brand-bible:${mission}`, async () => {
    // Existing implementation
  });
}
```

---

## 🔧 Phase 4: Build Optimization (Week 4)

### Phase 4a: Minification & Compression

**Update vite.config.ts**:
```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      dead_code: true,
      passes: 3
    },
    mangle: true
  }
}
```

### Phase 4b: Testing & Verification

**Checklist**:
```bash
# 1. Type checking
npm run type-check
# Expected: 0 errors

# 2. Build validation
npm run build
# Expected: 0 TS errors, Main: 280-300 KB

# 3. Bundle analysis
npm run build:analyze
# Open dist/stats.html to verify chunk strategy

# 4. Production preview
npm run preview
# Test all features work (ChatBot, images, forms)

# 5. Performance check
npm run preview
# Run Lighthouse audit (DevTools)
# Target: FCP <1.5s, LCP <2.0s
```

---

## 📊 Measurement & Tracking

### Before Optimization
```
Main Bundle: 337.12 KB
Gzipped: 107.09 KB
Build Time: 2.44s
FCP: ~1.8s
LCP: ~2.4s
```

### After Each Phase

**Phase 1 Target**:
- Main: 315-320 KB (-5%)
- Gzipped: 100-103 KB (-6%)

**Phase 2 Target**:
- Main: 280-300 KB (-20%)
- Gzipped: 85-92 KB (-25%)

**Phase 3 Target**:
- Build Time: 2.0s (-18%)
- Runtime Performance: +25%

**Phase 4 Target**:
- Main: 280-290 KB (-17-20%)
- Gzipped: 82-88 KB (-23-28%)

---

## 🔍 Debugging Guide

### Issue: Chunks not splitting as expected
```typescript
// Check vite.config.ts manualChunks
// Run: npm run build:analyze
// Verify dist/stats.html shows expected chunks
```

### Issue: Images not lazy loading
```tsx
// Verify loading="lazy" attribute
// Check DevTools Network tab - should defer non-critical images
// Enable slow 3G in DevTools to verify behavior
```

### Issue: TypeScript strict mode errors
```bash
# Find all violations
npm run type-check

# Common fixes:
# 1. Add explicit types to function params
# 2. Check null/undefined handling
# 3. Use optional chaining (?.) for nullish values
```

### Issue: Cache not persisting
```typescript
// Check localStorage availability
// Verify cache key uniqueness
// Check browser quota (usually 5-10 MB)
```

---

## 📚 Resources

- [Vite Performance Guide](https://vitejs.dev/)
- [React Lazy Loading](https://react.dev/reference/react/lazy)
- [Web Vitals](https://web.dev/vitals/)
- [TypeScript Strict Mode](https://www.typescriptlang.org/)

---

## 📝 Commit Strategy

Suggested git commits:

```bash
# Phase 1
git commit -m "perf: optimize images with WebP and lazy loading"
git commit -m "perf: consolidate CSS and remove duplication"

# Phase 2
git commit -m "refactor: implement code splitting for ChatBot"
git commit -m "chore: enable TypeScript strict mode"

# Phase 3
git commit -m "perf: add component memoization"
git commit -m "perf: implement advanced caching with LRU strategy"

# Phase 4
git commit -m "build: optimize minification and terser configuration"
git commit -m "test: verify all optimizations with production build"
```

---

## ✅ Sign-Off Checklist

- [ ] All optimizations implemented
- [ ] 0 TypeScript errors
- [ ] Build succeeds with no warnings
- [ ] Preview server loads all features
- [ ] ChatBot functionality verified
- [ ] Images lazy-load properly
- [ ] Cache hit rate > 70% for repeated requests
- [ ] Lighthouse score improved by 10+ points
- [ ] Bundle size matches targets
- [ ] Documentation updated
- [ ] All commits pushed to main

**Expected Outcome**: 50-65 KB bundle reduction + 20-30% performance improvement
