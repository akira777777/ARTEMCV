import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RenderOptimizer, LazyRender, FPSMonitor } from '../components/RenderOptimizer';

// Mock requestIdleCallback
global.requestIdleCallback = vi.fn((cb) => {
  return setTimeout(cb, 1) as unknown as number;
});
global.cancelIdleCallback = vi.fn((id) => {
  clearTimeout(id);
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(private callback: any) {}

  trigger(entries: any[]) {
    this.callback(entries);
  }
}

describe('RenderOptimizer', () => {
  beforeEach(() => {
    // @ts-ignore
    global.IntersectionObserver = MockIntersectionObserver;
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
    
    expect(await screen.findByText('Test Content')).toBeInTheDocument();
  });

  it('shows fallback when shouldRender is false', () => {
    render(
      <RenderOptimizer shouldRender={false} fallback={<div>Fallback</div>}>
        <div>Test Content</div>
      </RenderOptimizer>
    );
    
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  it('handles different priorities', () => {
    render(
      <RenderOptimizer priority="low" fallback={<div>Loading...</div>}>
        <div>Test Content</div>
      </RenderOptimizer>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('LazyRender', () => {
  beforeEach(() => {
    // @ts-ignore
    global.IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows fallback initially', () => {
    render(
      <LazyRender fallback={<div>Loading...</div>}>
        <div>Visible Content</div>
      </LazyRender>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children when element becomes visible', async () => {
    let intersectCallback: any;

    // Override the mock for this specific test to capture the callback
    global.IntersectionObserver = vi.fn(function(cb) {
      intersectCallback = cb;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    }) as any;

    render(
      <LazyRender fallback={<div>Loading...</div>}>
        <div>Visible Content</div>
      </LazyRender>
    );
    
    // Simulate intersection
    intersectCallback([{ isIntersecting: true }]);
    
    expect(await screen.findByText('Visible Content')).toBeInTheDocument();
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