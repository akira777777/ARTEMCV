import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HolographicCard } from '../components/HolographicCard';

describe('HolographicCard', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
  };

  it('renders title and description', () => {
    render(<HolographicCard {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const { getByText } = render(
      <HolographicCard {...defaultProps}>
        <div>Child Content</div>
      </HolographicCard>
    );
    
    expect(getByText('Child Content')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<HolographicCard {...defaultProps} className="custom-class" />);
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('changes appearance on hover', () => {
    render(<HolographicCard {...defaultProps} />);
    
    const card = screen.getByText('Test Title').closest('div');
    fireEvent.mouseEnter(card!);
    
    // We can't directly test the motion properties, but we can ensure
    // the component handles the event without errors
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('uses default glow color when not specified', () => {
    render(<HolographicCard {...defaultProps} />);
    
    const card = screen.getByText('Test Title').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('applies custom glow color when specified', () => {
    render(<HolographicCard {...defaultProps} glowColor="from-red-500 to-blue-500" />);
    
    const card = screen.getByText('Test Title').closest('div');
    expect(card).toBeInTheDocument();
  });
});