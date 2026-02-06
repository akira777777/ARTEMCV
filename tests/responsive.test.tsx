import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useWindowSize, useIsMobile } from '../lib/hooks';

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
  window.dispatchEvent(new Event('resize'));
};

describe('Responsive Design Hooks', () => {
  beforeEach(() => {
    // Reset to default dimensions
    mockWindowDimensions(1024, 768);
  });

  describe('useWindowSize', () => {
    it('returns current window dimensions', () => {
      const TestComponent: React.FC = () => {
        const { width, height } = useWindowSize();
        return (
          <div>
            <span data-testid="width">{width}</span>
            <span data-testid="height">{height}</span>
          </div>
        );
      };

      mockWindowDimensions(1200, 800);
      render(<TestComponent />);

      expect(screen.getByTestId('width')).toHaveTextContent('1200');
      expect(screen.getByTestId('height')).toHaveTextContent('800');
    });

    it('updates dimensions on resize', async () => {
      const TestComponent: React.FC = () => {
        const { width, height } = useWindowSize();
        return (
          <div>
            <span data-testid="width">{width}</span>
            <span data-testid="height">{height}</span>
          </div>
        );
      };

      render(<TestComponent />);
      
      mockWindowDimensions(800, 600);
      
      // Wait for debounced resize handler
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(screen.getByTestId('width')).toHaveTextContent('800');
      expect(screen.getByTestId('height')).toHaveTextContent('600');
    });
  });

  describe('useIsMobile', () => {
    it('returns false for desktop viewport', () => {
      const TestComponent: React.FC = () => {
        const isMobile = useIsMobile();
        return <span data-testid="is-mobile">{isMobile ? 'true' : 'false'}</span>;
      };

      mockWindowDimensions(1024, 768);
      render(<TestComponent />);

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    });

    it('returns true for mobile viewport', () => {
      const TestComponent: React.FC = () => {
        const isMobile = useIsMobile();
        return <span data-testid="is-mobile">{isMobile ? 'true' : 'false'}</span>;
      };

      mockWindowDimensions(375, 667);
      render(<TestComponent />);

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
    });

    it('respects custom breakpoint', () => {
      const TestComponent: React.FC = () => {
        const isMobile = useIsMobile(1024);
        return <span data-testid="is-mobile">{isMobile ? 'true' : 'false'}</span>;
      };

      mockWindowDimensions(1023, 768);
      render(<TestComponent />);

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
    });
  });
});

describe('Responsive Layout', () => {
  it('renders mobile navigation on small screens', () => {
    mockWindowDimensions(375, 667);
    
    const MobileNav: React.FC = () => (
      <nav className="md:hidden" aria-label="Mobile navigation">
        <button>Menu</button>
      </nav>
    );

    const DesktopNav: React.FC = () => (
      <nav className="hidden md:block" aria-label="Desktop navigation">
        <a href="#home">Home</a>
      </nav>
    );

    const Navigation: React.FC = () => {
      const isMobile = useIsMobile();
      return isMobile ? <MobileNav /> : <DesktopNav />;
    };

    render(<Navigation />);
    
    expect(screen.getByRole('navigation', { name: /mobile/i })).toBeInTheDocument();
  });

  it('renders desktop navigation on large screens', () => {
    mockWindowDimensions(1024, 768);
    
    const MobileNav: React.FC = () => (
      <nav className="md:hidden" aria-label="Mobile navigation">
        <button>Menu</button>
      </nav>
    );

    const DesktopNav: React.FC = () => (
      <nav className="hidden md:block" aria-label="Desktop navigation">
        <a href="#home">Home</a>
      </nav>
    );

    const Navigation: React.FC = () => {
      const isMobile = useIsMobile();
      return isMobile ? <MobileNav /> : <DesktopNav />;
    };

    render(<Navigation />);
    
    expect(screen.getByRole('navigation', { name: /desktop/i })).toBeInTheDocument();
  });
});
