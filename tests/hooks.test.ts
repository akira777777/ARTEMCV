
import { renderHook } from '@testing-library/react';
import { useReducedMotion, useWindowSize } from '../lib/hooks';
import { describe, it, expect, vi } from 'vitest';

describe('useReducedMotion', () => {
  it('should return false by default if matchMedia returns false', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true if matchMedia returns true', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});

describe('useWindowSize', () => {
  it('should return current window size', () => {
    // Set initial size
    (window as any).innerWidth = 1024;
    (window as any).innerHeight = 768;

    const { result } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: 1024, height: 768 });
  });
});
