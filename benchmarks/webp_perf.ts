
import { performance } from 'perf_hooks';

// Mock Image class to simulate browser behavior
class MockImage {
  static instances = 0;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  height = 0;
  private _src = '';

  constructor() {
    MockImage.instances++;
  }

  set src(value: string) {
    this._src = value;
    // Simulate async loading
    setTimeout(() => {
      this.height = 2; // WebP supported
      if (this.onload) this.onload();
    }, 0);
  }

  get src() {
    return this._src;
  }
}

// @ts-ignore
global.Image = MockImage;
// @ts-ignore
global.window = {};

// Current (Old) implementation logic
async function runOldDetection(count: number) {
  const start = performance.now();
  const promises = [];

  for (let i = 0; i < count; i++) {
    promises.push(new Promise<boolean>((resolve) => {
      const img = new MockImage();
      img.onload = img.onerror = () => {
        resolve(img.height === 2);
      };
      img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }));
  }

  await Promise.all(promises);
  const end = performance.now();
  return { time: end - start, instances: MockImage.instances };
}

// New (Optimized) implementation logic
let isWebPSupportedCached: boolean | null = null;
let webPSupportPromiseCached: Promise<boolean> | null = null;

function checkWebPSupportOptimized(): Promise<boolean> {
  if (isWebPSupportedCached !== null) return Promise.resolve(isWebPSupportedCached);
  if (webPSupportPromiseCached) return webPSupportPromiseCached;

  webPSupportPromiseCached = new Promise((resolve) => {
    const img = new MockImage();
    img.onload = img.onerror = () => {
      isWebPSupportedCached = img.height === 2;
      resolve(isWebPSupportedCached);
    };
    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });

  return webPSupportPromiseCached;
}

async function runOptimizedDetection(count: number) {
  const start = performance.now();
  const promises = [];

  for (let i = 0; i < count; i++) {
    promises.push(checkWebPSupportOptimized());
  }

  await Promise.all(promises);
  const end = performance.now();
  return { time: end - start, instances: MockImage.instances };
}

async function run() {
  const count = 100;
  console.log(`Running benchmarks with ${count} detection calls...`);

  // Reset instances count
  MockImage.instances = 0;
  const oldResult = await runOldDetection(count);
  console.log(`Old Implementation:`);
  console.log(`- Time: ${oldResult.time.toFixed(2)}ms`);
  console.log(`- Image Instances: ${oldResult.instances}`);

  // Reset for optimized run
  MockImage.instances = 0;
  isWebPSupportedCached = null;
  webPSupportPromiseCached = null;

  const optimizedResult = await runOptimizedDetection(count);
  console.log(`\nOptimized Implementation:`);
  console.log(`- Time: ${optimizedResult.time.toFixed(2)}ms`);
  console.log(`- Image Instances: ${optimizedResult.instances}`);

  const timeSavings = oldResult.time - optimizedResult.time;
  const instanceSavings = oldResult.instances - optimizedResult.instances;

  console.log(`\nResults:`);
  console.log(`- Time Improvement: ${timeSavings.toFixed(2)}ms (${((timeSavings / oldResult.time) * 100).toFixed(2)}%)`);
  console.log(`- Resource Reduction: ${instanceSavings} Image instances avoided (${((instanceSavings / oldResult.instances) * 100).toFixed(2)}%)`);
}

run();
