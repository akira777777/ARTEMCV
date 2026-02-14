import React from 'react';
import { render, screen } from '@testing-library/react';
import OptimizedGradientShaderCard from '../components/OptimizedGradientShaderCard';

describe('OptimizedGradientShaderCard', () => {
  test('renders without crashing', () => {
    render(<OptimizedGradientShaderCard />);

    // Since this is a canvas-based component, we mainly check if the container renders
    const canvasContainer = screen.getByRole('img');
    expect(canvasContainer).toBeInTheDocument();
  });

  // OptimizedGradientShaderCard does NOT accept className prop in my implementation?
  // Enhanced accepted it. Optimized implementation I wrote:
  // const OptimizedGradientShaderCard: React.FC = () => { ... }
  // It does NOT accept props.
  // So I skip className test.
});
