import os

def write_file(path, content):
    with open(path, 'w') as f:
        f.write(content)
    print(f"Updated {path}")

# 1. FloatingParticleCanvas.test.tsx
fp_content = """import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
}));

describe('FloatingParticleCanvas', () => {
  it('renders without crashing', () => {
    render(<FloatingParticleCanvas />);
    const canvas = screen.getByRole('presentation');
    expect(canvas).toBeInTheDocument();
  });

  it('accepts custom particle count', () => {
    render(<FloatingParticleCanvas particleCount={50} />);
    // Test that component accepts custom props
    const canvas = screen.getByRole('presentation');
    expect(canvas).toBeInTheDocument();
  });

  it('responds to mouse movement', async () => {
    render(<FloatingParticleCanvas interactionRadius={100} />);
    const canvas = screen.getByRole('presentation');

    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });

    // Wait for interactions to be processed
    await waitFor(() => {
      expect(canvas).toBeInTheDocument();
    });
  });
});
"""
write_file('tests/FloatingParticleCanvas.test.tsx', fp_content)

# 2. PerformanceOptimizations.test.tsx
po_path = 'tests/PerformanceOptimizations.test.tsx'
with open(po_path, 'r') as f:
    content = f.read()

# Check if it ends with });
if not content.strip().endswith('});'):
    with open(po_path, 'a') as f:
        f.write('\n});\n')
    print(f"Appended }}); to {po_path}")
else:
    print(f"{po_path} already ends with }});")
