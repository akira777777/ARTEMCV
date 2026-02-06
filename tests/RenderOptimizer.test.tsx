import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RenderOptimizer, LazyRender, FPSMonitor } from '../components/RenderOptimizer';

// Mock requestIdleCallback
global.requestIdleCallback = vi.fn((cb) => {
  return 123;
global.requestIdleCallback = vi.fn((cb: IdleRequestCallback) => {
  return setTimeout(cb, 1) as unknown as number;
});
global.cancelIdleCallback = vi.fn((id: number) => {
  clearTimeout(id);
});

describe('RenderOptimizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when shouldRender is true', async () => {
    render(
      <RenderOptimizer shouldRender={true} priority="high">
        <div>Test Content</div>
      </RenderOptimizer>
    );
    
    // High priority should render immediately
    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('shows fallback when shouldRender is false', () => {
    render(
      <RenderOptimizer shouldRender={false} fallback={<div>Fallback</div>}>
        <div>Test Content</div>
      </RenderOptimizer>
    );
    
    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('handles different priorities', async () => {
    render(
      <RenderOptimizer priority="high" fallback={<div>Loading...</div>}>
        <div>Test Content</div>
      </RenderOptimizer>
    );
    
    // High priority renders immediately
    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });
});

describe('LazyRender', () => {
  beforeEach(() => {
    // Mock IntersectionObserver that triggers immediately
    global.IntersectionObserver = class MockIntersectionObserver {
      constructor(private callback: IntersectionObserverCallback) {}
      
      observe(element: Element) {
        // Immediately trigger intersection
        setTimeout(() => {
          this.callback(
            [{ isIntersecting: true, target: element }] as IntersectionObserverEntry[],
            this as unknown as IntersectionObserver
          );
        }, 0);
      }
      
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows fallback initially and renders children when visible', async () => {
    render(
      <LazyRender fallback={<div>Loading...</div>}>
        <div>Visible Content</div>
      </LazyRender>
    );
    
    // Should eventually show children after intersection
    await waitFor(() => {
      expect(screen.getByText('Visible Content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('FPSMonitor', () => {
  beforeEach(() => {
    // Set environment to development for FPS monitor to render
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('does not render in production', () => {
    process.env.NODE_ENV = 'production';
    
    render(<FPSMonitor />);
    
    // FPS monitor should not render in production
    const fpsElements = screen.queryAllByText(/FPS:/);
    expect(fpsElements.length).toBe(0);
  });

  it('renders in development', () => {
    process.env.NODE_ENV = 'development';
    
    render(<FPSMonitor />);
    
    // FPS monitor should render in development
    const fpsElement = screen.queryByText(/FPS:/);
    expect(fpsElement).toBeInTheDocument();
  });
});
