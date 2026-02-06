## 2024-05-22 - Canvas Particle Batching
**Learning:** Standard "draw line per connection" loops in Canvas are too slow for React components in this architecture. Batching lines by opacity steps (e.g., 10 discrete buckets) reduces draw calls by ~48% and boosts performance by ~32%.
**Action:** Always refactor particle connection lines to use discrete opacity buckets + Path2D batching (or batched moveTo/lineTo) instead of individual `ctx.stroke()` calls.
