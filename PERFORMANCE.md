# Performance Optimization Guide

This document outlines performance best practices and optimizations implemented in the ARTEMCV portfolio.

## Key Performance Optimizations

### 1. Component Memoization

All major components are wrapped with `React.memo()` to prevent unnecessary re-renders:

- ✅ `Hero`, `About`, `Footer`, `WorkGallery`, `Projects`
- ✅ `Navigation`, `SimpleTelegramChat`, `ScrollToTop`
- ✅ `CursorTrail`, `GradientShaderCard`, `InteractiveShowcase`
- ✅ `SkipLink`, `SpinningCube`, `ScrollProgress`

**Why:** React.memo prevents component re-renders when props haven't changed, reducing CPU usage and improving responsiveness.

### 2. Lazy State Initialization

The i18n system uses lazy initialization for language detection:

```typescript
const [lang, setLangState] = useState<Lang>(() => detect());
```

**Performance gain:** ~3.89x faster initialization (verified with benchmark)

**Why:** Calling `detect()` inside an arrow function ensures it only runs once on mount, not on every render.

### 3. Canvas Optimizations

The `GradientShaderCard` component uses several canvas optimization techniques:

- **Float32Array** for wave calculations (pre-allocated typed arrays)
- **Hoisted math calculations** (time multipliers computed once per frame)
- **Batched path drawing** (single `beginPath()`/`stroke()` call)
- **Context options**: `{ alpha: false, desynchronized: true }`

**Performance gain:** 39.52% faster rendering (verified with benchmark)

```typescript
// Pre-allocate typed arrays
const wavePartX = new Float32Array(xValues.length);
const wavePartY = new Float32Array(yValues.length);

// Hoist time calculations
const time20 = time * 20;
const time15 = time * 15;

// Batch all drawing operations
ctx.beginPath();
for (let i = 0; i < xValues.length; i++) {
  // ... all drawing operations
}
ctx.stroke(); // Single stroke call
```

### 4. Object Reuse Pattern

The `CursorTrail` component reuses trail point objects instead of creating new ones:

```typescript
// Reuse existing objects
for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
  const p = trail[i];
  const prev = trail[i - 1];
  p.x = prev.x;
  p.y = prev.y;
  p.opacity = 1 - (i / TRAIL_LENGTH);
}
```

**Performance gain:** 5% faster rendering, reduced GC pressure

**Why:** Mutating existing objects avoids garbage collection overhead from creating/destroying objects every frame.

### 5. Memoized Style Objects

Inline style objects are extracted to constants to prevent recreation:

```typescript
// ❌ Bad: Creates new object on every render
<div style={{ contain: 'layout style' }} />

// ✅ Good: Reuses same object reference
const BUTTON_STYLE = { contain: 'layout style' } as const;
<div style={BUTTON_STYLE} />
```

**Applied to:**
- `WorkGallery`: 2 style objects
- `SpinningCube`: 9 style objects

**Why:** React compares style objects by reference. New objects trigger unnecessary DOM updates.

### 6. Pre-calculated Values

Color hues and other constants are pre-calculated outside render:

```typescript
// CursorTrail
const HUES = Array.from({ length: TRAIL_LENGTH }, (_, i) => 
  160 + (i / TRAIL_LENGTH) * 100
);
```

**Why:** Avoid recalculating the same values every animation frame.

### 7. useMemo and useCallback

Expensive calculations and event handlers are memoized:

```typescript
// Memoize derived data
const categories = useMemo(() => {
  const tags = PROJECTS.flatMap(project => project.techStack);
  return ['All', ...Array.from(new Set(tags))];
}, []);

// Memoize callbacks
const handleChange = useCallback((e: React.ChangeEvent) => {
  setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
}, []);
```

**Why:** Prevents creating new function references and recalculating values on every render.

### 8. RequestAnimationFrame Throttling

All scroll and mouse handlers use requestAnimationFrame to throttle updates:

```typescript
const onScroll = () => {
  if (!ticking) {
    animationFrameId = requestAnimationFrame(updateParallax);
    ticking = true;
  }
};
```

**Why:** Ensures updates happen at most once per frame (60 FPS), preventing layout thrashing.

### 9. Intersection Observer

Images and animations only trigger when in viewport:

```typescript
const observer = new IntersectionObserver(
  ([entry]) => setIsInView(entry.isIntersecting),
  { rootMargin: '50px', threshold: 0 }
);
```

**Why:** Saves CPU/GPU by not animating off-screen elements.

### 10. Event Listener Optimization

All event listeners use passive mode where applicable:

```typescript
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('mousemove', handleMouseMove, { passive: true });
```

**Why:** Allows browser to optimize scrolling by not waiting for JavaScript to finish.

## Performance Benchmarks

Run benchmarks to verify optimizations:

```bash
# i18n lazy initialization
npx tsx benchmarks/i18n_perf.ts
# Expected: ~3.89x improvement

# Canvas optimization
npx tsx benchmarks/canvas_benchmark.ts
# Expected: ~39.52% improvement

# CursorTrail object reuse
npx tsx benchmarks/cursortrail_benchmark.ts
# Expected: ~5% improvement
```

## Best Practices Checklist

When adding new components:

- [ ] Wrap with `React.memo()` if it renders frequently
- [ ] Use `useMemo()` for expensive calculations
- [ ] Use `useCallback()` for event handlers passed as props
- [ ] Extract inline style objects to constants
- [ ] Use lazy initialization for expensive initial state
- [ ] Throttle scroll/mouse events with requestAnimationFrame
- [ ] Use IntersectionObserver for animations
- [ ] Add `passive: true` to event listeners when possible
- [ ] Prefer CSS animations over JavaScript when possible
- [ ] Use `will-change` CSS property sparingly (only for actively animating elements)

## Additional Performance Optimizations

### 11. Code Splitting Enhancement
- **Dynamic Imports**: Heavy components like `GradientShaderCard` are now lazy-loaded using `React.lazy()` to reduce initial bundle size
- **Benefits**: Improved initial load time and better resource allocation

### 12. Image Optimization
- **OptimizedImage Component**: Created a new component that provides:
  - WebP format support with fallback to original format
  - Responsive loading with `sizes` attribute
  - Lazy loading using Intersection Observer
  - Loading states and error handling
  - Asynchronous decoding for smoother loading
  - Priority loading for critical images
  - Placeholder visuals during loading
- **Implementation**: Applied to `SpotlightGallery` and `WorkGallery` components
- **Performance gain**: Reduced initial bundle size and improved loading performance

### 13. Advanced Mouse Movement Throttling
- **Enhanced Throttling**: Updated `GradientShaderCard` to use `requestAnimationFrame`-based throttling instead of time-based
- **Performance gain**: Reduced mouse event processing overhead while maintaining smooth interaction
- **Implementation**: Used animation frame scheduling to process only the latest mouse position per frame

### 14. Service Worker Caching
- **Offline Support**: Implemented service worker for caching static assets
- **Strategy**: Network-first with cache fallback for optimal freshness and performance
- **Cache Management**: Automatic cleanup of old caches to prevent storage bloat
- **Files Cached**: HTML, CSS, JavaScript, images, and other critical assets
- **Performance gain**: Faster subsequent loads, offline functionality, reduced bandwidth usage

### 15. Resource Preloading
- **Critical Assets**: Added preload directives for important images and fonts in `index.html`
- **DNS Prefetching**: Added DNS prefetch hints for external domains
- **Priority Loading**: Fonts and hero images are now preloaded for faster rendering

## Monitoring Performance

Use React DevTools Profiler to identify slow renders:

1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click record, interact with the app, stop recording
4. Review flame graph for slow components

Use Chrome DevTools Performance tab to identify:
- Long tasks (>50ms)
- Layout thrashing
- Excessive garbage collection
- Paint/composite bottlenecks

## Build Performance

Build optimization is handled by Vite:

```bash
npm run build
```

Key optimizations:
- Tree shaking (removes unused code)
- Minification (Terser)
- Code splitting (dynamic imports)
- Asset optimization (images, fonts)

## Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Performance](https://web.dev/performance/)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
