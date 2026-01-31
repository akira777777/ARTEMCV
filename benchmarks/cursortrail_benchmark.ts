
import { performance } from 'perf_hooks';

// Mock TrailPoint
interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
}

const TRAIL_LENGTH = 12;

function runCurrent() {
  const trail: TrailPoint[] = Array(TRAIL_LENGTH).fill(null).map(() => ({
    x: 0,
    y: 0,
    opacity: 0,
  }));

  const frames = 10000;
  const start = performance.now();

  for (let f = 0; f < frames; f++) {
    const currentX = Math.random() * 1000;
    const currentY = Math.random() * 1000;

    // Update trail positions (Current way: creating new objects)
    for (let i = trail.length - 1; i > 0; i--) {
      trail[i] = {
        x: trail[i - 1].x,
        y: trail[i - 1].y,
        opacity: 1 - (i / TRAIL_LENGTH),
      };
    }
    trail[0] = { x: currentX, y: currentY, opacity: 1 };

    // Simulate drawing
    for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i];
        const hue = 160 + (i / TRAIL_LENGTH) * 100;
        const alpha = point.opacity * 0.6;
        const color = `hsla(${hue}, 70%, 60%, ${alpha})`;
    }
  }

  const end = performance.now();
  return end - start;
}

function runOptimized() {
  const trail: TrailPoint[] = Array(TRAIL_LENGTH).fill(null).map(() => ({
    x: 0,
    y: 0,
    opacity: 0,
  }));

  // Pre-calculate color strings part (hue is constant for each index)
  const hueStrings = Array(TRAIL_LENGTH).fill(0).map((_, i) => 160 + (i / TRAIL_LENGTH) * 100);

  const frames = 10000;
  const start = performance.now();

  for (let f = 0; f < frames; f++) {
    const currentX = Math.random() * 1000;
    const currentY = Math.random() * 1000;

    // Update trail positions (Optimized: Reusing objects)
    for (let i = trail.length - 1; i > 0; i--) {
      const p = trail[i];
      const prev = trail[i - 1];
      p.x = prev.x;
      p.y = prev.y;
      p.opacity = 1 - (i / TRAIL_LENGTH);
    }
    const p0 = trail[0];
    p0.x = currentX;
    p0.y = currentY;
    p0.opacity = 1;

    // Simulate drawing
    for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i];
        const hue = hueStrings[i];
        const alpha = point.opacity * 0.6;
        // In real drawing we might still need the template literal,
        // but let's see if pre-calculating hue helps.
        const color = `hsla(${hue}, 70%, 60%, ${alpha})`;
    }
  }

  const end = performance.now();
  return end - start;
}

console.log('Running CursorTrail benchmarks...');
const currentDur = runCurrent();
console.log(`Current: ${currentDur.toFixed(2)}ms`);

const optimizedDur = runOptimized();
console.log(`Optimized: ${optimizedDur.toFixed(2)}ms`);

console.log(`Improvement: ${(currentDur - optimizedDur).toFixed(2)}ms (${((currentDur - optimizedDur) / currentDur * 100).toFixed(2)}%)`);
