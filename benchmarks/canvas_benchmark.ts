
import { performance } from 'perf_hooks';

// Mock Canvas Context
class MockCtx {
  callCount = 0;

  beginPath() { this.callCount++; }
  stroke() { this.callCount++; }
  moveTo(x: number, y: number) { this.callCount++; }
  lineTo(x: number, y: number) { this.callCount++; }
  arc(x: number, y: number, r: number, sa: number, ea: number) { this.callCount++; }

  reset() { this.callCount = 0; }
}

const w = 800;
const h = 600;
const gridSize = 40;
const frames = 1000;

function runUnbatched(ctx: MockCtx) {
  let time = 0;
  for (let f = 0; f < frames; f++) {
    time += 0.01;
    // Unbatched: beginPath/stroke inside loop (as per prompt description)
    for (let x = 0; x < w; x += gridSize) {
      for (let y = 0; y < h; y += gridSize) {
        const wave = Math.sin((x + time * 20) * 0.02) * 3 + Math.cos((y + time * 15) * 0.02) * 3;

        ctx.beginPath();
        // MoveTo is implicit in arc if start? Or strictly following prompt snippet
        // Prompt snippet:
        // ctx.beginPath();
        // ctx.arc(x, y + wave, 2, 0, Math.PI * 2);
        // ctx.stroke();

        ctx.arc(x, y + wave, 2, 0, Math.PI * 2);
        ctx.stroke();

        if (x + gridSize < w) {
           // Assuming these also need stroke if unbatched?
           // Or just appended to previous?
           // The prompt snippet cuts off.
           // I'll assume only the circle was unbatched in the bad version.
           // But for fairness let's keep the lines as is (batched or unbatched? likely unbatched if logic is bad)
        }
      }
    }
  }
}

function runCurrent(ctx: MockCtx) {
  let time = 0;
  for (let f = 0; f < frames; f++) {
    time += 0.01;

    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize) {
      for (let y = 0; y < h; y += gridSize) {
        const wave = Math.sin((x + time * 20) * 0.02) * 3 + Math.cos((y + time * 15) * 0.02) * 3;

        ctx.moveTo(x + 2, y + wave);
        ctx.arc(x, y + wave, 2, 0, Math.PI * 2);

        if (x + gridSize < w) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + gridSize, y + Math.sin((y + time * 20) * 0.02) * 3);
        }

        if (y + gridSize < h) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos((x + time * 20) * 0.02) * 3, y + gridSize);
        }
      }
    }
    ctx.stroke();
  }
}

function runOptimized(ctx: MockCtx) {
  let time = 0;
  // Pre-allocation of arrays to avoid GC?
  // JS arrays are dynamic.
  // Dimensions
  const cols = Math.ceil(w / gridSize);
  const rows = Math.ceil(h / gridSize);

  // We need to match the loops exactly:
  // x = 0, 40, 80 ... < w.
  // xIndices: 0, 1, ...

  const xValues = [];
  for (let x = 0; x < w; x += gridSize) xValues.push(x);

  const yValues = [];
  for (let y = 0; y < h; y += gridSize) yValues.push(y);

  const wavePartX = new Float32Array(xValues.length);
  const lineDispX = new Float32Array(xValues.length);
  const wavePartY = new Float32Array(yValues.length);
  const lineDispY = new Float32Array(yValues.length);

  for (let f = 0; f < frames; f++) {
    time += 0.01;

    // Precompute X values
    const time20 = time * 20;
    const time15 = time * 15;

    for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        wavePartX[i] = Math.sin((x + time20) * 0.02) * 3;
        lineDispX[i] = Math.cos((x + time20) * 0.02) * 3;
    }

    // Precompute Y values
    for (let i = 0; i < yValues.length; i++) {
        const y = yValues[i];
        wavePartY[i] = Math.cos((y + time15) * 0.02) * 3;
        lineDispY[i] = Math.sin((y + time20) * 0.02) * 3;
    }

    ctx.beginPath();

    for (let i = 0; i < xValues.length; i++) {
      const x = xValues[i];
      const wx = wavePartX[i];
      // const ldx = lineDispX[i]; // used in inner loop for vertical lines? No, vertical lines check (y+gridSize < h) and use X dependent offset.

      const hasNextX = (x + gridSize < w);

      for (let j = 0; j < yValues.length; j++) {
        const y = yValues[j];
        const wy = wavePartY[j];

        const wave = wx + wy;

        ctx.moveTo(x + 2, y + wave);
        ctx.arc(x, y + wave, 2, 0, Math.PI * 2);

        if (hasNextX) {
            // lineDispY is needed here: sin((y + time * 20) * 0.02) * 3
            // which is lineDispY[j]
            ctx.moveTo(x, y);
            ctx.lineTo(x + gridSize, y + lineDispY[j]);
        }

        if (y + gridSize < h) {
            // lineDispX is needed here: cos((x + time * 20) * 0.02) * 3
            // which is lineDispX[i]
            ctx.moveTo(x, y);
            ctx.lineTo(x + lineDispX[i], y + gridSize);
        }
      }
    }
    ctx.stroke();
  }
}

const ctx1 = new MockCtx();
const ctx2 = new MockCtx();
const ctx3 = new MockCtx();

console.log('Running benchmarks...');

const start1 = performance.now();
runUnbatched(ctx1);
const end1 = performance.now();
console.log(`Unbatched (Prompt code): ${(end1 - start1).toFixed(2)}ms, Calls: ${ctx1.callCount}`);

const start2 = performance.now();
runCurrent(ctx2);
const end2 = performance.now();
console.log(`Current Code (Already Batched): ${(end2 - start2).toFixed(2)}ms, Calls: ${ctx2.callCount}`);

const start3 = performance.now();
runOptimized(ctx3);
const end3 = performance.now();
console.log(`Optimized (Hoisted Math): ${(end3 - start3).toFixed(2)}ms, Calls: ${ctx3.callCount}`);

const improvement = (end2 - start2) - (end3 - start3);const percent = (improvement / (end2 - start2)) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}ms (${percent.toFixed(2)}%)`);
