import { performance } from 'perf_hooks';

// Simulate the cache logic without React hooks for benchmarking in Node
class CacheSimulator {
  constructor(persistence) {
    this.persistence = persistence;
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
  }

  saveToPersistence() {
    if (!this.persistence) return;

    const start = performance.now();
    try {
      const data = {
        entries: Array.from(this.cache.entries()).map(([key, entry]) => entry),
        stats: this.stats
      };

      const serialized = JSON.stringify(data);
      // Simulating heavy I/O or just the CPU cost of stringify
      // In a real browser this would be localStorage.setItem
    } catch (e) {
      console.error(e);
    }
    return performance.now() - start;
  }

  set(key, value) {
    this.cache.set(key, { key, value, timestamp: Date.now() });
    return this.saveToPersistence();
  }
}

async function runBenchmark() {
  console.log('--- Cache Persistence Benchmark (Baseline) ---');

  const cache = new CacheSimulator(true);

  // Fill cache with some data
  console.log('Filling cache with 10,000 entries...');
  for (let i = 0; i < 10000; i++) {
    cache.cache.set(`key_${i}`, { data: 'some random data value '.repeat(10) });
  }

  console.log('Measuring cost of a single "set" operation with synchronous persistence:');

  let totalTime = 0;
  const iterations = 100;

  for (let i = 0; i < iterations; i++) {
    totalTime += cache.set('new_key', { data: 'new data' });
  }

  const avgTime = totalTime / iterations;
  console.log(`Average time per set: ${avgTime.toFixed(4)} ms`);
  console.log(`Total blocking time for ${iterations} operations: ${totalTime.toFixed(4)} ms`);
}

runBenchmark();
