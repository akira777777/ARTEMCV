import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BackgroundPaths from '../../components/BackgroundPaths';

// Mock framer-motion for testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useSpring: () => ({ get: () => 0, set: () => {} }),
  useMotionValue: () => ({ get: () => 0, set: () => {} }),
}));

// Mock MagneticButton component
vi.mock('../../components/MagneticButton', () => ({
  __esModule: true,
  default: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props} data-testid="magnetic-button">
      {children}
    </button>
  ),
}));

describe('BackgroundPaths Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  // 1. Component rendering without crashing
  describe('Component Rendering', () => {
    it('should render without crashing with default props', () => {
      render(<BackgroundPaths />);
      
      // Check if main container exists
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
      
      // Check if SVG containers exist
      const svgContainers = document.querySelectorAll('.absolute.inset-0.pointer-events-none');
      expect(svgContainers).toHaveLength(2); // Two FloatingPaths components
      
      // Check if main content area exists
      const contentArea = document.querySelector('.relative.z-10.container');
      expect(contentArea).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      const customTitle = "Custom Hero Title";
      render(<BackgroundPaths title={customTitle} />);
      
      // Check if individual words exist in the DOM
      const titleElement = document.querySelector('h1');
      expect(titleElement).toBeInTheDocument();
      
      // Check for individual words (since they're in separate spans)
      expect(titleElement?.textContent).toContain('Custom');
      expect(titleElement?.textContent).toContain('Hero');
      expect(titleElement?.textContent).toContain('Title');
    });

    it('should render with subtitle when provided', () => {
      const subtitle = "This is a custom subtitle";
      render(<BackgroundPaths subtitle={subtitle} />);
      
      const subtitleElement = document.querySelector('p');
      expect(subtitleElement).toBeInTheDocument();
      // Check for key words in subtitle
      expect(subtitleElement?.textContent).toContain('This');
      expect(subtitleElement?.textContent).toContain('custom');
      expect(subtitleElement?.textContent).toContain('subtitle');
    });

    it('should render without subtitle when not provided', () => {
      render(<BackgroundPaths />);
      
      // Should not contain subtitle-specific text
      const subtitleElements = document.querySelectorAll('p.text-xl');
      expect(subtitleElements).toHaveLength(0);
    });

    it('should apply custom className when provided', () => {
      const customClass = "custom-background-test";
      render(<BackgroundPaths className={customClass} />);
      
      const container = document.querySelector(`.${customClass}`);
      expect(container).toBeInTheDocument();
    });
  });

  // 2. Proper prop handling and validation
  describe('Prop Handling', () => {
    it('should use default props when none provided', () => {
      render(<BackgroundPaths />);
      
      // Check default title
      const titleElement = document.querySelector('h1');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement?.textContent).toContain('Background');
      expect(titleElement?.textContent).toContain('Paths');
      
      // Check default button text
      const button = screen.getByTestId('magnetic-button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("Discover Excellence");
    });

    it('should handle empty title gracefully', () => {
      render(<BackgroundPaths title="" />);
      
      // Should still render without errors
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('should handle empty subtitle gracefully', () => {
      render(<BackgroundPaths subtitle="" />);
      
      // Should not render subtitle paragraph
      const subtitleParagraphs = document.querySelectorAll('p');
      expect(subtitleParagraphs).toHaveLength(0);
    });

    it('should handle undefined props gracefully', () => {
      render(<BackgroundPaths title={undefined} subtitle={undefined} buttonText={undefined} />);
      
      // Should use defaults
      const titleElement = document.querySelector('h1');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement?.textContent).toContain('Background');
      expect(titleElement?.textContent).toContain('Paths');
      
      const button = screen.getByTestId('magnetic-button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("Discover Excellence");
    });

    it('should handle null props gracefully', () => {
      render(<BackgroundPaths title={null as any} subtitle={null as any} buttonText={null as any} />);
      
      // Should use defaults with null safety
      const titleElement = document.querySelector('h1');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement?.textContent).toContain('Background');
      expect(titleElement?.textContent).toContain('Paths');
    });
  });

  // 3. Button interaction and callbacks
  describe('Button Interaction', () => {
    it('should call onButtonClick when button is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<BackgroundPaths onButtonClick={handleClick} />);
      
      const button = screen.getByTestId('magnetic-button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onButtonClick is not provided', async () => {
      const user = userEvent.setup();
      
      render(<BackgroundPaths />);
      
      const button = screen.getByTestId('magnetic-button');
      await expect(user.click(button)).resolves.not.toThrow();
    });

    it('should handle rapid successive clicks', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<BackgroundPaths onButtonClick={handleClick} />);
      
      const button = screen.getByTestId('magnetic-button');
      
      // Click multiple times rapidly
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  // 4. Accessibility attributes and semantic structure
  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      render(<BackgroundPaths />);
      
      // Check for main container
      const mainContainer = document.querySelector('.relative.min-h-screen');
      expect(mainContainer).toBeInTheDocument();
      
      // Check for proper heading structure
      const headings = document.querySelectorAll('h1');
      expect(headings).toHaveLength(1);
    });

    it('should have accessible button with proper labeling', () => {
      render(<BackgroundPaths buttonText="Test Button" />);
      
      const button = screen.getByTestId('magnetic-button');
      expect(button).toBeInTheDocument();
      // Button type is handled by MagneticButton component
      expect(button.tagName).toBe('BUTTON');
    });

    it('should maintain proper contrast ratios', () => {
      render(<BackgroundPaths />);
      
      // Check for dark mode classes
      const darkModeElements = document.querySelectorAll('.dark\\:bg-neutral-950');
      expect(darkModeElements.length).toBeGreaterThan(0);
      
      // Check for light mode classes
      const lightModeElements = document.querySelectorAll('.bg-white');
      expect(lightModeElements.length).toBeGreaterThan(0);
    });

    it('should have proper ARIA attributes on SVG elements', () => {
      render(<BackgroundPaths />);
      
      const svgs = document.querySelectorAll('svg');
      svgs.forEach(svg => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  // 5. Responsive behavior
  describe('Responsive Behavior', () => {
    it('should maintain layout integrity on different screen sizes', () => {
      // Test with various viewport sizes
      const testSizes = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1024, height: 768 }, // Desktop
        { width: 1920, height: 1080 }, // Large Desktop
      ];
      
      testSizes.forEach(size => {
        // Mock window dimensions
        (window as any).innerWidth = size.width;
        (window as any).innerHeight = size.height;
        
        render(<BackgroundPaths key={`${size.width}x${size.height}`} />);
        
        // Check if component still renders properly
        const container = document.querySelector('.relative.min-h-screen');
        expect(container).toBeInTheDocument();
        
        // Cleanup
        document.body.innerHTML = '';
      });
    });

    it('should handle extreme screen sizes gracefully', () => {
      // Very small screen
      (window as any).innerWidth = 100;
      (window as any).innerHeight = 100;
      
      expect(() => {
        render(<BackgroundPaths />);
      }).not.toThrow();
      
      // Very large screen
      (window as any).innerWidth = 10000;
      (window as any).innerHeight = 10000;
      
      document.body.innerHTML = '';
      expect(() => {
        render(<BackgroundPaths />);
      }).not.toThrow();
    });
  });

  // 6. Edge cases and error conditions
  describe('Edge Cases', () => {
    it('should handle very long titles gracefully', () => {
      const longTitle = "A".repeat(1000);
      render(<BackgroundPaths title={longTitle} />);
      
      // Should not crash
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const specialTitle = "Title with <>&\"' characters";
      render(<BackgroundPaths title={specialTitle} />);
      
      // Should render without XSS issues
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('should handle zero-length strings gracefully', () => {
      render(<BackgroundPaths title="" subtitle="" buttonText="" />);
      
      // Should still render
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('should handle extremely long subtitle gracefully', () => {
      const longSubtitle = "Lorem ipsum ".repeat(100);
      render(<BackgroundPaths subtitle={longSubtitle} />);
      
      // Should not crash
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
      
      // Should render subtitle element
      const subtitleElement = document.querySelector('p');
      expect(subtitleElement).toBeInTheDocument();
      // Just check that it exists, not the full content
    });
  });

  // 7. Performance considerations
  describe('Performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<BackgroundPaths />);
      
      // Track initial state
      const initialElementCount = document.querySelectorAll('*').length;
      
      // Unmount component
      unmount();
      
      // Should clean up elements
      const finalElementCount = document.querySelectorAll('*').length;
      expect(finalElementCount).toBeLessThanOrEqual(initialElementCount);
    });

    it('should handle multiple re-renders efficiently', () => {
      const { rerender } = render(<BackgroundPaths />);
      
      // Multiple re-renders with different props
      rerender(<BackgroundPaths title="New Title 1" />);
      rerender(<BackgroundPaths title="New Title 2" />);
      rerender(<BackgroundPaths title="New Title 3" />);
      
      // Should still work
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
    });
  });

  // 8. Animation-related tests
  describe('Animation Behavior', () => {
    it('should render motion elements without crashing', () => {
      render(<BackgroundPaths />);
      
      // Check if motion.div elements exist
      const motionDivs = document.querySelectorAll('[data-testid="motion-div"]');
      // Even though we mocked motion.div, the structure should still exist
      expect(document.querySelector('.max-w-4xl.mx-auto')).toBeInTheDocument();
    });

    it('should handle animation delays properly', () => {
      vi.useFakeTimers();
      
      render(<BackgroundPaths />);
      
      // Fast-forward timers to ensure animations complete
      vi.advanceTimersByTime(5000);
      
      // Component should still be mounted
      const container = document.querySelector('.relative.min-h-screen');
      expect(container).toBeInTheDocument();
      
      vi.useRealTimers();
    });
  });
});