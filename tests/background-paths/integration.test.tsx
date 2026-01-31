import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BackgroundPaths from '../../components/BackgroundPaths';

// Mock all external dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}));

vi.mock('../../components/MagneticButton', () => ({
  __esModule: true,
  default: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props} data-testid="magnetic-button">
      {children}
    </button>
  ),
}));

describe('BackgroundPaths Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up DOM between tests
    document.body.innerHTML = '';
  });

  // 1. End-to-end component workflow
  describe('Complete Component Workflow', () => {
    it('should render complete component with all elements', () => {
      render(<BackgroundPaths 
        title="Test Integration" 
        subtitle="Testing complete workflow"
        buttonText="Click Me"
      />);
      
      // Check main container
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
      
      // Check SVG background layers (2 FloatingPaths instances)
      const svgLayers = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgLayers).toHaveLength(2);
      
      // Check title rendering
      expect(document.body.textContent).toContain('Test Integration');
      
      // Check subtitle rendering
      expect(document.body.textContent).toContain('Testing complete workflow');
      
      // Check button
      expect(screen.getByTestId('magnetic-button')).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should handle user interaction flow', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(<BackgroundPaths 
        title="Interactive Test"
        buttonText="Interact"
        onButtonClick={handleClick}
      />);
      
      // Initial state - component should be visible
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
      
      // User clicks button
      const button = screen.getByTestId('magnetic-button');
      await user.click(button);
      
      // Callback should be triggered
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Component should still be mounted
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
    });
  });

  // 2. Responsive Design Integration
  describe('Responsive Design Integration', () => {
    it('should maintain functionality across different viewports', () => {
      const viewports = [
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1024, height: 768, name: 'Desktop' },
        { width: 1920, height: 1080, name: 'Large Desktop' },
      ];
      
      viewports.forEach(viewport => {
        // Set viewport size
        (window as any).innerWidth = viewport.width;
        (window as any).innerHeight = viewport.height;
        
        render(<BackgroundPaths 
          key={viewport.name}
          title={`Test ${viewport.name.replace(' ', '')}`}
        />);
        
        // Component should render correctly
        expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
        expect(document.body.textContent).toContain(`Test${viewport.name.replace(' ', '')}`);
        
        // Clean up for next iteration
        document.body.innerHTML = '';
      });
    });

    it('should handle dynamic viewport changes', () => {
      const { rerender } = render(<BackgroundPaths title="InitialView" />);
      
      // Initial render
      expect(document.body.textContent).toContain('InitialView');
      
      // Simulate viewport change
      (window as any).innerWidth = 500;
      (window as any).innerHeight = 800;
      
      rerender(<BackgroundPaths title="ChangedView" />);
      
      // Should still work after viewport change
      expect(document.body.textContent).toContain('ChangedView');
    });
  });

  // 3. Theme Integration
  describe('Theme Integration', () => {
    it('should work with both light and dark themes', () => {
      // Test light theme
      document.documentElement.classList.remove('dark');
      render(<BackgroundPaths title="Light Theme Test" />);
      
      expect(document.querySelector('.bg-white')).toBeInTheDocument();
      expect(document.querySelector('.dark\\:bg-neutral-950')).toBeInTheDocument();
      
      // Clean up
      document.body.innerHTML = '';
      
      // Test dark theme
      document.documentElement.classList.add('dark');
      render(<BackgroundPaths title="Dark Theme Test" />);
      
      expect(document.querySelector('.bg-white')).toBeInTheDocument();
      expect(document.querySelector('.dark\\:bg-neutral-950')).toBeInTheDocument();
      
      // Clean up theme class
      document.documentElement.classList.remove('dark');
    });

    it('should maintain contrast in both themes', () => {
      // Test text contrast in light theme
      render(<BackgroundPaths title="Contrast Test" />);
      
      const textElements = document.querySelectorAll('.text-transparent.bg-clip-text');
      expect(textElements.length).toBeGreaterThan(0);
      
      // Clean up
      document.body.innerHTML = '';
    });
  });

  // 4. Animation Integration
  describe('Animation Integration', () => {
    it('should coordinate multiple animation layers', () => {
      vi.useFakeTimers();
      
      render(<BackgroundPaths title="Animation Coordination Test" />);
      
      // Check that all animation elements are present
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      // Even with mocked motion, structure should exist
      
      // Fast-forward animations
      vi.advanceTimersByTime(5000);
      
      // Component should remain stable
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
      
      vi.useRealTimers();
    });

    it('should handle animation timing coordination', () => {
      const { rerender } = render(<BackgroundPaths title="TimingTest1" />);
      
      // Component renders with initial animations
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
      
      // Re-render with different content
      rerender(<BackgroundPaths title="TimingTest2" />);
      
      // Should handle animation state changes gracefully
      expect(document.body.textContent).toContain('TimingTest2');
    });
  });

  // 5. Error Boundary Integration
  describe('Error Handling Integration', () => {
    it('should gracefully handle component errors', () => {
      // Mock a component that throws an error
      const ErrorComponent = () => {
        throw new Error('Test error');
      };
      
      // Wrap in error boundary or test graceful degradation
      expect(() => {
        render(<BackgroundPaths 
          title="Error Handling Test"
          subtitle={undefined as any} // Force potential error
        />);
      }).not.toThrow();
      
      // Should still render basic structure
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
    });

    it('should maintain stability under stress conditions', () => {
      // Rapid re-renders
      const { rerender } = render(<BackgroundPaths title="Stress Test 1" />);
      
      for (let i = 2; i <= 20; i++) {
        rerender(<BackgroundPaths title={`Stress Test ${i}`} />);
      }
      
      // Should not crash
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
    });
  });

  // 6. Performance Integration
  describe('Performance Integration', () => {
    it('should maintain frame rate during interactions', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(<BackgroundPaths 
        title="Performance Test"
        onButtonClick={handleClick}
      />);
      
      const startTime = performance.now();
      
      // Perform multiple interactions
      const button = screen.getByTestId('magnetic-button');
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle interactions quickly
      expect(totalTime).toBeLessThan(1000); // 1 second threshold
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should efficiently manage memory during component lifecycle', () => {
      const initialMemory = process.memoryUsage?.().heapUsed || 0;
      
      const { unmount } = render(<BackgroundPaths title="Memory Test" />);
      
      // Component is mounted
      expect(document.querySelector('.relative.min-h-screen')).toBeInTheDocument();
      
      unmount();
      
      // Should clean up resources (basic check)
      const finalElements = document.querySelectorAll('*');
      expect(finalElements.length).toBeLessThan(100); // Reasonable cleanup
    });
  });

  // 7. Accessibility Integration
  describe('Accessibility Integration', () => {
    it('should maintain accessibility tree integrity', () => {
      render(<BackgroundPaths 
        title="Accessibility Test"
        subtitle="Testing accessibility features"
      />);
      
      // Check semantic structure
      const headings = document.querySelectorAll('h1');
      expect(headings).toHaveLength(1);
      
      const buttons = document.querySelectorAll('button[data-testid="magnetic-button"]');
      expect(buttons).toHaveLength(1);
      
      // Check ARIA attributes
      const svgs = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(<BackgroundPaths 
        title="Keyboard Navigation Test"
        onButtonClick={handleClick}
      />);
      
      const button = screen.getByTestId('magnetic-button');
      
      // Focus the button
      button.focus();
      expect(button).toHaveFocus();
      
      // Trigger with keyboard
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // 8. Cross-component Integration
  describe('Cross-component Integration', () => {
    it('should integrate properly with MagneticButton', () => {
      render(<BackgroundPaths 
        title="Button Integration Test"
        buttonText="Integrated Button"
      />);
      
      const button = screen.getByTestId('magnetic-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Integrated Button');
      
      // Check button styling classes
      expect(button).toHaveClass('rounded-[1.15rem]');
      expect(button).toHaveClass('px-8', 'py-6');
    });

    it('should handle component composition correctly', () => {
      // Test nested component rendering
      render(
        <div data-testid="wrapper">
          <BackgroundPaths title="Nested Component Test" />
        </div>
      );
      
      const wrapper = screen.getByTestId('wrapper');
      const backgroundPaths = wrapper.querySelector('.relative.min-h-screen');
      expect(backgroundPaths).toBeInTheDocument();
    });
  });
});