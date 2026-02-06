import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloatingParticleCanvas } from '../components/FloatingParticleCanvas';

// Mock canvas context
const mockCanvasContext = {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  fill: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  setTransform: vi.fn(),
  getLineDash: vi.fn(),
  setLineDash: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
};

// Mock canvas element
HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCanvasContext as any);
HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  right: 800,
  bottom: 600,
  x: 0,
  y: 0,
  toJSON: () => {}
  toJSON: () => ({}),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    canvas: ({ children, ...props }: any) => <canvas {...props} data-testid="particle-canvas">{children}</canvas>,
  },
}));

describe('FloatingParticleCanvas', () => {
  it('renders without crashing', () => {
    const { container } = render(<FloatingParticleCanvas />);
    const canvas = container.querySelector('canvas') || container.querySelector('[data-testid="particle-canvas"]');
    expect(canvas).toBeInTheDocument();
  });

  it('accepts custom particle count', () => {
    const { container } = render(<FloatingParticleCanvas particleCount={50} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('responds to mouse movement', async () => {
    const { container } = render(<FloatingParticleCanvas interactionRadius={100} />);
    const canvas = container.querySelector('canvas');
    
    if (canvas) {
      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
    }
    
    await waitFor(() => {
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });
});
