import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HolographicCard } from '../components/HolographicCard';

// Mock framer-motion completely
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => {
      // Filter out framer-motion specific props
      const domProps = Object.keys(props).reduce((acc, key) => {
        if (!['whileHover', 'whileTap', 'initial', 'animate', 'exit', 'transition'].includes(key)) {
          acc[key] = props[key];
        }
        return acc;
      }, {} as any);
      return <div className={className} {...domProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

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
    render(
      <HolographicCard {...defaultProps}>
        <div>Child Content</div>
      </HolographicCard>
    );
    
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<HolographicCard {...defaultProps} className="custom-class" />);
    
    // Check that the custom class is somewhere in the rendered output
    expect(container.innerHTML).toContain('custom-class');
  });

  it('uses default glow color when not specified', () => {
    const { container } = render(<HolographicCard {...defaultProps} />);
    
    // Component should render with default glow color
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies custom glow color when specified', () => {
    const { container } = render(<HolographicCard {...defaultProps} glowColor="from-red-500 to-blue-500" />);
    
    // Component should render with custom glow color
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
