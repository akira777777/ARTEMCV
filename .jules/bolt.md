## 2025-05-15 - [Centralized WebP Detection]
**Learning:** Redundant DOM operations in small, frequently used components (like `OptimizedImage`) can accumulate significant overhead. Centralizing asynchronous checks (like feature detection) using a cached promise pattern ensures that the browser only performs the check once, reducing CPU and memory pressure.
**Action:** Always check if feature detection logic can be centralized in a utility or a singleton service rather than placing it in a component's `useEffect`.
