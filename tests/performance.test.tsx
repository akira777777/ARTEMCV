import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { useRef } from 'react';
import { 
  debounce, 
  useThrottleRAF, 
  isInViewport,
  requestIdle,
  preloadResource,
  preconnect
} from '../lib/performance';

describe('Performance Utilities', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays function execution', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous timeout on new call', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      vi.advanceTimersByTime(50);
      debouncedFn();
      vi.advanceTimersByTime(50);
      
      expect(fn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('isInViewport', () => {
    it('returns true for element in viewport', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          top: 100,
          left: 100,
          bottom: 200,
          right: 200,
        }),
      } as HTMLElement;

      // Mock window dimensions
      Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });

      expect(isInViewport(mockElement)).toBe(true);
    });

    it('returns false for element outside viewport', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          top: 700,
          left: 100,
          bottom: 800,
          right: 200,
        }),
      } as HTMLElement;

      Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });

      expect(isInViewport(mockElement)).toBe(false);
    });

    it('considers offset parameter', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          top: -50,
          left: 100,
          bottom: 50,
          right: 200,
        }),
      } as HTMLElement;

      Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });

      expect(isInViewport(mockElement)).toBe(false);
      expect(isInViewport(mockElement, 100)).toBe(true);
    });
  });

  describe('requestIdle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calls callback via setTimeout when requestIdleCallback not available', () => {
      const fn = vi.fn();
      const originalRIC = (window as typeof window & { requestIdleCallback?: typeof setTimeout }).requestIdleCallback;
      Object.defineProperty(window, 'requestIdleCallback', {
        value: undefined,
        writable: true,
        configurable: true
      });

      requestIdle(fn);
      vi.advanceTimersByTime(1);

      expect(fn).toHaveBeenCalled();

      // Restore
      if (originalRIC) {
        (window as typeof window & { requestIdleCallback?: typeof setTimeout }).requestIdleCallback = originalRIC;
      }
    });
  });

  describe('preconnect', () => {
    it('creates link element with correct attributes', () => {
      const appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => document.createElement('link'));
      
      preconnect('https://example.com', true);
      
      expect(appendChildSpy).toHaveBeenCalled();
      const linkElement = appendChildSpy.mock.calls[0][0] as HTMLLinkElement;
      expect(linkElement.rel).toBe('preconnect');
      expect(linkElement.href).toBe('https://example.com/');
      expect(linkElement.crossOrigin).toBe('anonymous');

      appendChildSpy.mockRestore();
    });
  });

  describe('preloadResource', () => {
    it('creates preload link for scripts', () => {
      const appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => document.createElement('link'));
      
      preloadResource('/script.js', 'script');
      
      const linkElement = appendChildSpy.mock.calls[0][0] as HTMLLinkElement;
      expect(linkElement.rel).toBe('preload');
      expect(linkElement.as).toBe('script');

      appendChildSpy.mockRestore();
    });

    it('creates preload link for fonts with crossorigin', () => {
      const appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => document.createElement('link'));
      
      preloadResource('/font.woff2', 'font', 'font/woff2');
      
      const linkElement = appendChildSpy.mock.calls[0][0] as HTMLLinkElement;
      expect(linkElement.rel).toBe('preload');
      expect(linkElement.as).toBe('font');
      expect(linkElement.type).toBe('font/woff2');
      expect(linkElement.crossOrigin).toBe('anonymous');

      appendChildSpy.mockRestore();
    });
  });
});

describe('Component Performance', () => {
  it('measures render count correctly', () => {
    let renderCount = 0;
    
    const TestComponent: React.FC = () => {
      renderCount++;
      return <div>Test</div>;
    };

    const { rerender } = render(<TestComponent />);
    expect(renderCount).toBe(1);

    rerender(<TestComponent />);
    expect(renderCount).toBe(2);
  });

  it('uses memo to prevent unnecessary re-renders', () => {
    const MemoComponent = React.memo<{ value: number }>(({ value }) => {
      return <div data-testid="value">{value}</div>;
    });

    const Parent: React.FC = () => {
      const [, setState] = React.useState(0);
      React.useEffect(() => {
        setState(1);
      }, []);
      return <MemoComponent value={42} />;
    };

    render(<Parent />);
    // Value should remain unchanged even after parent re-renders with same props
    expect(screen.getByTestId('value')).toHaveTextContent('42');
  });
});
