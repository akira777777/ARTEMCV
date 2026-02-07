import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyGradientShaderCard from '../components/LazyGradientShaderCard';

// Mock OptimizedGradientShaderCard to avoid canvas rendering issues
vi.mock('../components/OptimizedGradientShaderCard', () => ({
  default: () => <div data-testid="optimized-card">OptimizedGradientShaderCard</div>,
}));

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('LazyGradientShaderCard', () => {
  it('renders lazy loaded component', async () => {
    render(<LazyGradientShaderCard />);

    // Check if fallback is rendered initially (might happen very fast)
    // or wait for the lazy component to load
    await waitFor(() => {
      expect(screen.getByTestId('optimized-card')).toBeInTheDocument();
    });
  });
});
