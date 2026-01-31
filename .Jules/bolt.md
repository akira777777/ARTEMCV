## 2025-01-31 - [Image Optimization Anomaly]
**Learning:** Found that some existing .webp files were significantly larger (5-7x) than their .png counterparts, likely due to improper conversion parameters (possibly lossless or extremely high quality/low compression).
**Action:** Always verify generated asset sizes after conversion and use standard quality targets (e.g., 75-80) for web assets.

## 2025-01-31 - [Code Splitting Below-the-Fold]
**Learning:** Implementing React.lazy for below-the-fold components (WorkGallery, About) reduced the initial main bundle size by ~22KB, improving Time to Interactive.
**Action:** Identify large components that are not needed for the initial viewport and lazy load them.

## 2025-01-31 - [Centralized Content for i18n Efficiency]
**Learning:** Moving hardcoded UI strings to a centralized `constants.tsx` and using translation keys directly in the data structure allows for cleaner components and prevents redundant translation calls in loops.
**Action:** Prefer passing translation keys in data objects over pre-translating them at the component level.
