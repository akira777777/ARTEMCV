import { performance } from 'perf_hooks';

// Mock browser environment
const localStorageMock = {
  getItem: (key: string) => {
    // Simulate some cost for synchronous I/O
    for(let i=0; i<100; i++) {}
    return null;
  },
  setItem: () => {}
};

const navigatorMock = {
  language: 'en-US'
};

// Set globals
(global as any).localStorage = localStorageMock;
Object.defineProperty(global, 'navigator', {
  value: navigatorMock,
  writable: true,
  configurable: true
});

type Lang = 'en' | 'ru' | 'cs';

// The logic from i18n.tsx
function detect(): Lang {
  const fromStorage = localStorage.getItem('lang') as Lang | null;
  if (fromStorage && ['en','ru','cs'].includes(fromStorage)) return fromStorage;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith('cs')) return 'cs';
  if (nav.startsWith('ru')) return 'ru';
  return 'en';
}

function simulateReRenders(iterations: number, mode: 'eager' | 'lazy') {
  let state: Lang | undefined;

  // Mock useState
  const useState = (initial: any) => {
    // React initializes state only once (simulated here)
    if (state === undefined) {
      if (typeof initial === 'function') state = initial();
      else state = initial;
    }
    return [state, () => {}];
  };

  const start = performance.now();

  // Initial Render (Mount)
  if (mode === 'eager') {
      const val = detect(); // Eagerly executed
      useState(val);
  } else {
      useState(detect); // Passed as function
  }

  // Re-renders
  for (let i = 0; i < iterations; i++) {
    if (mode === 'eager') {
      // In eager mode, detect() is called every time BEFORE useState
      const val = detect();
      useState(val);
    } else {
      // In lazy mode, detect is passed, but useState doesn't call it on re-render
      useState(detect);
    }
  }

  return performance.now() - start;
}

const ITERATIONS = 1_000_000;
console.log(`Running ${ITERATIONS} iterations...`);

const eagerTime = simulateReRenders(ITERATIONS, 'eager');
console.log(`Eager Initialization (detect()): ${eagerTime.toFixed(2)}ms`);

const lazyTime = simulateReRenders(ITERATIONS, 'lazy');
console.log(`Lazy Initialization (detect): ${lazyTime.toFixed(2)}ms`);

const improvement = eagerTime / lazyTime;
console.log(`Improvement: ${improvement.toFixed(2)}x faster`);
