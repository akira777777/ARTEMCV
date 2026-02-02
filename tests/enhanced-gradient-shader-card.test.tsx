import React from 'react';
import { render, screen } from '@testing-library/react';
import EnhancedGradientShaderCard from '../components/EnhancedGradientShaderCard';

describe('EnhancedGradientShaderCard', () => {
  test('renders without crashing', () => {
    render(<EnhancedGradientShaderCard />);
    
    // Since this is a canvas-based component, we mainly check if the container renders
    const canvasContainer = screen.getByRole('img');
    expect(canvasContainer).toBeInTheDocument();
  });

  test('applies custom className when provided', () => {
    const customClass = 'test-class';
    render(<EnhancedGradientShaderCard className={customClass} />);
    
    const canvasContainer = screen.getByRole('img');
    expect(canvasContainer).toHaveClass(customClass);
  });
});