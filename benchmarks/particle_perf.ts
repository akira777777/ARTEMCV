
import { performance } from 'perf_hooks';

class MockCtx {
  callCount = 0;
  fillStyle = '';

  beginPath() { this.callCount++; }
  fill() { this.callCount++; }
  moveTo(x: number, y: number) { this.callCount++; }
  arc(x: number, y: number, r: number, sa: number, ea: number) { this.callCount++; }
}

const MAX_PARTICLES = 150;
const COLORS = [
  'rgba(14, 165, 233',
  'rgba(16, 185, 129',
  'rgba(245, 158, 11',
  'rgba(139, 92, 246'
];

interface OldParticle {
  x: number; y: number; vx: number; vy: number; radius: number; color: string; life: number; maxLife: number;
}

function runOld(frames: number) {
  const ctx = new MockCtx();
  let particles: OldParticle[] = [];

  for (let f = 0; f < frames; f++) {
    // Create new particles
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: 400, y: 300, vx: Math.random() - 0.5, vy: Math.random() - 0.5,
        radius: 2, color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 100, maxLife: 100
      });
    }

    // Update and draw
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life--;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = (p.life / p.maxLife) * 0.8;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}, ${alpha * 0.3})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}, ${alpha})`;
      ctx.fill();
    }
  }
  return ctx.callCount;
}

function runNew(frames: number) {
  const ctx = new MockCtx();
  const pool = new Array(MAX_PARTICLES).fill(null).map(() => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, radius: 0, colorIdx: 0, life: 0, maxLife: 0
  }));

  for (let f = 0; f < frames; f++) {
    // Create particles from pool
    let created = 0;
    for (let i = 0; i < MAX_PARTICLES && created < 2; i++) {
      if (!pool[i].active) {
        const p = pool[i];
        p.active = true; p.x = 400; p.y = 300;
        p.vx = Math.random() - 0.5; p.vy = Math.random() - 0.5;
        p.radius = 2; p.colorIdx = Math.floor(Math.random() * COLORS.length);
        p.life = 100; p.maxLife = 100;
        created++;
      }
    }

    // Update and batch
    const ALPHA_STEPS = 4;
    const batches: number[][][] = COLORS.map(() => new Array(ALPHA_STEPS).fill(null).map(() => []));

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = pool[i];
      if (!p.active) continue;
      p.x += p.vx; p.y += p.vy; p.life--;
      if (p.life <= 0) { p.active = false; continue; }
      const alphaIdx = Math.min(Math.floor((p.life / p.maxLife) * ALPHA_STEPS), ALPHA_STEPS - 1);
      batches[p.colorIdx][alphaIdx].push(i);
    }

    // Draw batches
    for (let c = 0; c < COLORS.length; c++) {
      const baseColor = COLORS[c];
      for (let a = 0; a < ALPHA_STEPS; a++) {
        const indices = batches[c][a];
        if (indices.length === 0) continue;
        const alpha = (a + 1) / ALPHA_STEPS * 0.8;

        ctx.beginPath();
        ctx.fillStyle = `${baseColor}, ${alpha * 0.3})`;
        for (const idx of indices) {
          const p = pool[idx];
          ctx.moveTo(p.x + p.radius * 2, p.y);
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        }
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `${baseColor}, ${alpha})`;
        for (const idx of indices) {
          const p = pool[idx];
          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }
  }
  return ctx.callCount;
}

const frames = 2000;
console.log(`Running particle benchmarks for ${frames} frames...`);

const startOld = performance.now();
const callsOld = runOld(frames);
const endOld = performance.now();
console.log(`Old System: ${(endOld - startOld).toFixed(2)}ms, Draw Calls: ${callsOld}`);

const startNew = performance.now();
const callsNew = runNew(frames);
const endNew = performance.now();
console.log(`New System: ${(endNew - startNew).toFixed(2)}ms, Draw Calls: ${callsNew}`);

const timeImprovement = ((endOld - startOld) - (endNew - startNew)) / (endOld - startOld) * 100;
const callReduction = (callsOld - callsNew) / callsOld * 100;

console.log(`\nResults:`);
console.log(`Time Improvement: ${timeImprovement.toFixed(2)}%`);
console.log(`Draw Call Reduction: ${callReduction.toFixed(2)}%`);
