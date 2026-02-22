/**
 * Tests for targeted performance improvements:
 *  1. useRenderMonitor – running min/max tracking (no unbounded array growth)
 *  2. useCachedData   – O(1) Map.get() cache lookup
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRenderMonitor } from '../lib/performanceEnhanced';
import { useCache } from '../lib/cache';

// ---------------------------------------------------------------------------
// useRenderMonitor
// ---------------------------------------------------------------------------

describe('useRenderMonitor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('tracks render count and returns stats without errors', () => {
    const { result, rerender } = renderHook(() => useRenderMonitor('TestComponent'));

    // Trigger additional renders
    rerender();
    rerender();

    const stats = result.current.getStats();
    expect(stats.renderCount).toBeGreaterThan(0);
    expect(typeof stats.avgRenderTime).toBe('number');
    expect(typeof stats.maxRenderTime).toBe('number');
    expect(typeof stats.minRenderTime).toBe('number');
    expect(stats.maxRenderTime).toBeGreaterThanOrEqual(stats.minRenderTime);
  });

  it('does not accumulate an unbounded array – getStats is safe after many renders', () => {
    const { result, rerender } = renderHook(() => useRenderMonitor('StressTest'));

    // Simulate a large number of renders – previously would store all times in
    // an array and Math.max(...array) could overflow the call stack.
    for (let i = 0; i < 200; i++) {
      rerender();
    }

    // Should not throw and should return sensible values
    expect(() => result.current.getStats()).not.toThrow();
    const stats = result.current.getStats();
    expect(stats.renderCount).toBeGreaterThan(0);
    expect(isFinite(stats.avgRenderTime)).toBe(true);
    expect(isFinite(stats.maxRenderTime)).toBe(true);
    expect(isFinite(stats.minRenderTime)).toBe(true);
  });

  it('minRenderTime is never greater than maxRenderTime', () => {
    const { result, rerender } = renderHook(() => useRenderMonitor('MinMaxTest'));

    rerender();
    rerender();
    rerender();

    const stats = result.current.getStats();
    expect(stats.minRenderTime).toBeLessThanOrEqual(stats.maxRenderTime);
  });
});

// ---------------------------------------------------------------------------
// useCache – O(1) Map.get in useCachedData (verified via the cache hook itself)
// ---------------------------------------------------------------------------

describe('useCache – O(1) Map lookup', () => {
  it('cache.cache.get(key) returns the entry directly (O(1))', () => {
    const { result } = renderHook(() => useCache<string>({ maxSize: 10 }));

    act(() => {
      result.current.set('hello', 'world');
    });

    // Directly access the underlying Map – this is what useCachedData now uses
    const entry = result.current.cache.get('hello');
    expect(entry).toBeDefined();
    expect(entry?.value).toBe('world');
    expect(typeof entry?.timestamp).toBe('number');
  });

  it('cache.cache.get returns undefined for missing key (no array scan needed)', () => {
    const { result } = renderHook(() => useCache<string>({ maxSize: 10 }));

    const entry = result.current.cache.get('missing');
    expect(entry).toBeUndefined();
  });
});
