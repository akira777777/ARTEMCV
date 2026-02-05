import { performance } from 'perf_hooks';

const iterations = 10000;
const position = 1;

function generatePaths(position: number) {
  return Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));
}

const start = performance.now();
for (let i = 0; i < iterations; i++) {
  generatePaths(position);
  generatePaths(-position);
}
const end = performance.now();

console.log(`Total time for ${iterations * 2} path generations: ${(end - start).toFixed(2)}ms`);
console.log(`Average time per generation: ${((end - start) / (iterations * 2)).toFixed(4)}ms`);
