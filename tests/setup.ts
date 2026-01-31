import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Mock scrollIntoView
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = vi.fn();
}

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  value: MockResizeObserver,
  writable: true,
});

// Robust framer-motion mock
const mockMotionValue = (initial: any) => ({
  get: () => initial,
  set: vi.fn(),
  onChange: vi.fn(),
  on: vi.fn(),
  clearListeners: vi.fn(),
  getVelocity: () => 0,
  stop: vi.fn(),
  isAnimating: () => false,
  destroy: vi.fn(),
});

vi.mock('framer-motion', () => {
  const motionProxy = new Proxy(
    {},
    {
      get: (_target, key: string) => {
        if (key === 'custom') return (Tag: any) => Tag;
        return ({ children, ...props }: any) => {
          const Tag = key as any;
          return React.createElement(Tag, props, children);
        };
      },
    }
  );

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
    useScroll: vi.fn(() => ({
      scrollYProgress: mockMotionValue(0),
      scrollY: mockMotionValue(0),
      scrollXProgress: mockMotionValue(0),
      scrollX: mockMotionValue(0),
    })),
    useSpring: vi.fn((v) => (typeof v === 'object' ? v : mockMotionValue(v))),
    useMotionValue: vi.fn((v) => mockMotionValue(v)),
    useTransform: vi.fn(() => mockMotionValue(0)),
    useReducedMotion: vi.fn(() => false),
    useAnimation: vi.fn(() => ({
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn(),
      set: vi.fn(),
    })),
    useInView: vi.fn(() => true),
  };
});
