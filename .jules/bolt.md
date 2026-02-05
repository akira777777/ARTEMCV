## 2025-01-31 - [Image Optimization Anomaly]
**Learning:** Found that some existing .webp files were significantly larger (5-7x) than their .png counterparts, likely due to improper conversion parameters (possibly lossless or extremely high quality/low compression).
**Action:** Always verify generated asset sizes after conversion and use standard quality targets (e.g., 75-80) for web assets.

## 2025-01-31 - [Code Splitting Below-the-Fold]
**Learning:** Implementing React.lazy for below-the-fold components (WorkGallery, About) reduced the initial main bundle size by ~22KB, improving Time to Interactive.
**Action:** Identify large components that are not needed for the initial viewport and lazy load them.

## 2025-01-31 - [Centralized Content for i18n Efficiency]
**Learning:** Moving hardcoded UI strings to a centralized `constants.tsx` and using translation keys directly in the data structure allows for cleaner components and prevents redundant translation calls in loops.
**Action:** Prefer passing translation keys in data objects over pre-translating them at the component level.

## 2025-05-15 - [Route-based Code Splitting]
**Learning:** Heavy 3D components like the car configurator in Detailing Hub significantly bloat the main entry bundle (~10.5% of total size). Moving them to lazy-loaded routes improves the Time to Interactive (TTI) and initial load speed of the landing page.
**Action:** Use `React.lazy` for complex sub-pages to defer the loading of heavy dependencies like Three.js and specialized models until they are actually needed.

## 2026-02-01 - [Canvas Batching with Pool Density]
**Learning:** When using a particle pool with a swap-to-delete strategy (moving last active particle to the current index), batching by index can cause 1-frame ghosting because the index now points to a different object.
**Action:** Always batch by object reference or re-run the batching logic after all pool mutations are complete for the frame. Pre-calculating color strings for discrete alpha steps further reduces hot-path overhead.

## 2026-02-02 - [Centralized Capability Detection]
**Learning:** Redundant feature detection (like WebP support) in common components (OptimizedImage) scales resource usage linearly with the number of instances. Centralizing this in a utility with a cached promise reduces resource allocation to $O(1)$.
**Action:** Move all browser capability checks to a centralized utility (e.g., `lib/utils.ts`) and use a cached promise to avoid redundant DOM operations and base64 decoding.

## 2026-02-03 - [Synchronous Initialization from Capability Cache]
**Learning:** Even with a cached promise for capability detection, using it in `useEffect` or `then()` triggers an extra re-render for every component instance upon mounting. For common components like images, this results in O(N) redundant renders.
**Action:** Provide a synchronous getter for cached capability checks (e.g., `getWebPSupportSync()`). Use this in `useState` or during the initial render to avoid "mount -> check -> re-render" cycles entirely.
