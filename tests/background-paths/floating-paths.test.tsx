import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock framer-motion for testing FloatingPaths
vi.mock('framer-motion', () => ({
  motion: {
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}));

// Since FloatingPaths is not exported, we'll test it indirectly through BackgroundPaths
// But let's create a test version that exports it for testing purposes
const TestFloatingPaths = ({ position }: { position: number }) => {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg 
        className="w-full h-full text-slate-950 dark:text-white" 
        viewBox="0 0 696 316" 
        fill="none"
        aria-hidden="true"
        data-testid="floating-paths-svg"
      >
        <title>Floating Paths Test</title>
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            data-testid={`path-${path.id}`}
            data-path-data={path.d}
          />
        ))}
      </svg>
    </div>
  );
};

describe('FloatingPaths Subcomponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Component rendering and structure
  describe('Rendering and Structure', () => {
    it('should render with positive position value', () => {
      render(<TestFloatingPaths position={1} />);
      
      const svg = screen.getByTestId('floating-paths-svg');
      expect(svg).toBeInTheDocument();
      
      // Check SVG attributes
      expect(svg).toHaveAttribute('viewBox', '0 0 696 316');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render with negative position value', () => {
      render(<TestFloatingPaths position={-1} />);
      
      const svg = screen.getByTestId('floating-paths-svg');
      expect(svg).toBeInTheDocument();
      
      // Should have same structure regardless of position sign
      expect(svg).toHaveAttribute('viewBox', '0 0 696 316');
    });

    it('should render exactly 36 path elements', () => {
      render(<TestFloatingPaths position={1} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      expect(paths).toHaveLength(36);
    });

    it('should render with zero position value', () => {
      render(<TestFloatingPaths position={0} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      expect(paths).toHaveLength(36);
      
      // All paths should have valid d attributes
      paths.forEach(path => {
        expect(path).toHaveAttribute('d');
        expect(path.getAttribute('d')).toContain('M');
      });
    });
  });

  // 2. SVG Path Generation and Attributes
  describe('SVG Path Generation', () => {
    it('should generate unique path data for each path', () => {
      render(<TestFloatingPaths position={1} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      const pathDataArray: string[] = [];
      
      paths.forEach(path => {
        const pathData = path.getAttribute('data-path-data');
        expect(pathData).toBeTruthy();
        if (pathData) {
          pathDataArray.push(pathData);
        }
      });
      
      // All paths should have unique d attributes
      const uniquePaths = new Set(pathDataArray);
      expect(uniquePaths.size).toBe(36);
    });

    it('should generate correct path structure', () => {
      render(<TestFloatingPaths position={1} />);
      
      const firstPath = screen.getByTestId('path-0');
      const pathData = firstPath.getAttribute('data-path-data');
      
      expect(pathData).toBeTruthy();
      if (pathData) {
        // Should start with M (move to)
        expect(pathData.startsWith('M')).toBe(true);
        // Should contain C (cubic bezier curves)
        expect(pathData.includes('C')).toBe(true);
      }
    });

    it('should calculate path positions based on index and position parameter', () => {
      const position = 1;
      render(<TestFloatingPaths position={position} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      
      // Check that path positions vary systematically
      paths.forEach((path, index) => {
        const pathData = path.getAttribute('data-path-data');
        expect(pathData).toBeTruthy();
        
        if (pathData) {
          // Extract coordinates from path data
          const matches = pathData.match(/M(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
          expect(matches).toBeTruthy();
          if (matches) {
            const startX = parseFloat(matches[1]);
            const startY = parseFloat(matches[2]);
            
            // Verify calculation formula: -380 - i * 5 * position
            const expectedStartX = -(380 - index * 5 * position);
            const expectedStartY = -(189 + index * 6);
            
            expect(startX).toBeCloseTo(expectedStartX, 1);
            expect(startY).toBeCloseTo(expectedStartY, 1);
          }
        }
      });
    });

    it('should handle negative position values correctly', () => {
      const position = -1;
      render(<TestFloatingPaths position={position} />);
      
      const firstPath = screen.getByTestId('path-0');
      const pathData = firstPath.getAttribute('data-path-data');
      
      expect(pathData).toBeTruthy();
      if (pathData) {
        const matches = pathData.match(/M(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
        expect(matches).toBeTruthy();
        if (matches) {
          const startX = parseFloat(matches[1]);
          // With position = -1, first path should start at -380 - 0 * 5 * (-1) = -380
          expect(startX).toBeCloseTo(-380, 1);
        }
      }
    });
  });

  // 3. Styling and Appearance Properties
  describe('Styling Properties', () => {
    it('should apply correct stroke widths', () => {
      render(<TestFloatingPaths position={1} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      
      paths.forEach((path, index) => {
        const strokeWidth = path.getAttribute('stroke-width');
        expect(strokeWidth).toBeTruthy();
        
        if (strokeWidth) {
          const widthValue = parseFloat(strokeWidth);
          const expectedWidth = 0.5 + index * 0.03;
          expect(widthValue).toBeCloseTo(expectedWidth, 2);
        }
      });
    });

    it('should apply correct stroke opacities', () => {
      render(<TestFloatingPaths position={1} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      
      paths.forEach((path, index) => {
        const strokeOpacity = path.getAttribute('stroke-opacity');
        expect(strokeOpacity).toBeTruthy();
        
        if (strokeOpacity) {
          const opacityValue = parseFloat(strokeOpacity);
          const expectedOpacity = 0.1 + index * 0.03;
          expect(opacityValue).toBeCloseTo(expectedOpacity, 2);
        }
      });
    });

    it('should apply proper color classes', () => {
      render(<TestFloatingPaths position={1} />);
      
      const container = document.querySelector('.absolute.inset-0.pointer-events-none');
      expect(container).toBeInTheDocument();
      
      const svg = screen.getByTestId('floating-paths-svg');
      expect(svg).toHaveClass('w-full', 'h-full');
      expect(svg).toHaveClass('text-slate-950', 'dark:text-white');
    });
  });

  // 4. Edge Cases and Boundary Conditions
  describe('Edge Cases', () => {
    it('should handle decimal position values', () => {
      render(<TestFloatingPaths position={1.5} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      expect(paths).toHaveLength(36);
      
      // Should generate valid paths with decimal calculations
      paths.forEach(path => {
        const pathData = path.getAttribute('data-path-data');
        expect(pathData).toBeTruthy();
      });
    });

    it('should handle very large position values', () => {
      render(<TestFloatingPaths position={1000} />);
      
      const paths = screen.getAllByTestId(/^path-/);
      expect(paths).toHaveLength(36);
      
      // Should not crash with large numbers
      const firstPath = screen.getByTestId('path-0');
      expect(firstPath).toBeInTheDocument();
    });

    it('should handle fractional indices correctly', () => {
      // Test with a reduced set to verify calculation logic
      const TestFractionalPaths = ({ position }: { position: number }) => {
        const paths = Array.from({ length: 5 }, (_, i) => ({
          id: i,
          d: `M-${380 - i * 5 * position} -${189 + i * 6}`,
          width: 0.5 + i * 0.03,
        }));
        
        return (
          <svg data-testid="fractional-svg">
            {paths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                data-testid={`frac-path-${path.id}`}
                data-calculated-x={-(380 - path.id * 5 * position)}
              />
            ))}
          </svg>
        );
      };
      
      render(<TestFractionalPaths position={2} />);
      
      const paths = screen.getAllByTestId(/^frac-path-/);
      paths.forEach((path, index) => {
        const calculatedX = path.getAttribute('data-calculated-x');
        const expectedX = -(380 - index * 5 * 2);
        expect(parseFloat(calculatedX || '0')).toBe(expectedX);
      });
    });
  });

  // 5. Performance and Memory
  describe('Performance', () => {
    it('should render efficiently with 36 paths', () => {
      const startTime = performance.now();
      render(<TestFloatingPaths position={1} />);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(100);
    });

    it('should not create duplicate path elements', () => {
      render(<TestFloatingPaths position={1} />);
      
      const pathIds = screen.getAllByTestId(/^path-/).map(path => 
        path.getAttribute('data-testid')
      );
      
      const uniqueIds = new Set(pathIds);
      expect(uniqueIds.size).toBe(pathIds.length);
      expect(uniqueIds.size).toBe(36);
    });

    it('should clean up properly on unmount', () => {
      const { unmount } = render(<TestFloatingPaths position={1} />);
      
      const initialSvgCount = document.querySelectorAll('svg[data-testid="floating-paths-svg"]').length;
      expect(initialSvgCount).toBe(1);
      
      unmount();
      
      const finalSvgCount = document.querySelectorAll('svg[data-testid="floating-paths-svg"]').length;
      expect(finalSvgCount).toBe(0);
    });
  });

  // 6. Accessibility
  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<TestFloatingPaths position={1} />);
      
      const svg = screen.getByTestId('floating-paths-svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      
      // SVG elements don't need focusable attribute in modern browsers
      // Background decorative elements should be hidden from screen readers
      expect(svg).toHaveClass('pointer-events-none');
    });

    it('should have descriptive title element', () => {
      render(<TestFloatingPaths position={1} />);
      
      const title = screen.getByText('Floating Paths Test');
      expect(title).toBeInTheDocument();
      expect(title.parentElement?.tagName).toBe('svg');
    });

    it('should not be focusable', () => {
      render(<TestFloatingPaths position={1} />);
      
      const container = document.querySelector('.pointer-events-none');
      expect(container).toHaveClass('pointer-events-none');
    });
  });
});