
import { performance } from 'perf_hooks';

const ITERATIONS = 1000000;
const TEST_EMAIL = "test@example.com";

function benchmark() {
  console.log(`Running benchmark with ${ITERATIONS} iterations...`);

  // Baseline: Regex defined inside the function
  const startBaseline = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailPattern.test(TEST_EMAIL);
  }
  const endBaseline = performance.now();
  const baselineDuration = endBaseline - startBaseline;
  console.log(`Baseline (Inside Loop): ${baselineDuration.toFixed(2)}ms`);

  // Optimized: Regex defined outside (hoisted)
  const emailPatternHoisted = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const startOptimized = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    emailPatternHoisted.test(TEST_EMAIL);
  }
  const endOptimized = performance.now();
  const optimizedDuration = endOptimized - startOptimized;
  console.log(`Optimized (Hoisted): ${optimizedDuration.toFixed(2)}ms`);

  const improvement = baselineDuration - optimizedDuration;
  const improvementPercent = (improvement / baselineDuration) * 100;
  console.log(`Improvement: ${improvement.toFixed(2)}ms (${improvementPercent.toFixed(2)}%)`);
}

benchmark();
