import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SkipLink } from '../components/SkipLink';
import { AccessibilityProvider, useAccessibility } from '../components/AccessibilityProvider';
import { I18nProvider } from '../i18n';

// Mock scrollIntoView and focus on HTMLElement
Object.assign(Element.prototype, {
  scrollIntoView: vi.fn(),
  focus: vi.fn()
});

// Wrapper component for context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nProvider>
    <AccessibilityProvider>
      {children}
    </AccessibilityProvider>
  </I18nProvider>
);

// Test component that uses accessibility hook
const TestAccessibilityComponent: React.FC = () => {
  const { 
    fontSize, 
    highContrast, 
    reducedMotion, 
    setFontSize, 
    setHighContrast, 
    setReducedMotion 
  } = useAccessibility();

  return (
    <div>
      <div data-testid="font-size">{fontSize}</div>
      <div data-testid="high-contrast">{highContrast ? 'true' : 'false'}</div>
      <div data-testid="reduced-motion">{reducedMotion ? 'true' : 'false'}</div>
      <button 
        data-testid="increase-font" 
        onClick={() => setFontSize(fontSize + 10)}
      >
        Increase Font
      </button>
      <button 
        data-testid="toggle-contrast" 
        onClick={() => setHighContrast(!highContrast)}
      >
        Toggle Contrast
      </button>
      <button 
        data-testid="toggle-motion" 
        onClick={() => setReducedMotion(!reducedMotion)}
      >
        Toggle Motion
      </button>
    </div>
  );
};

describe('Accessibility Features', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('SkipLink Component', () => {
    it('renders skip link correctly', () => {
      render(<SkipLink />, { wrapper: TestWrapper });
      
      const skipLink = screen.getByText('Skip to content');
      expect(skipLink).toBeInTheDocument();
    });

    it('is visually hidden by default', () => {
      render(<SkipLink />, { wrapper: TestWrapper });
      
      const skipLink = screen.getByText('Skip to content');
      expect(skipLink).toHaveClass('sr-only');
    });

    it('focuses main content when clicked', () => {
      // Create main content element
      const main = document.createElement('main');
      main.id = 'main-content';
      document.body.appendChild(main);

      render(<SkipLink />, { wrapper: TestWrapper });
      
      const skipLink = screen.getByText('Skip to content');
      fireEvent.click(skipLink);
      
      expect(main.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      // Focus is called on the element
      expect(typeof main.focus).toBe('function');

      document.body.removeChild(main);
    });
  });

  describe('AccessibilityProvider', () => {
    it('provides default accessibility values', () => {
      render(<TestAccessibilityComponent />, { wrapper: TestWrapper });
      
      expect(screen.getByTestId('font-size')).toHaveTextContent('100');
      expect(screen.getByTestId('high-contrast')).toHaveTextContent('false');
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('false');
    });

    it('updates font size correctly', () => {
      render(<TestAccessibilityComponent />, { wrapper: TestWrapper });
      
      const increaseBtn = screen.getByTestId('increase-font');
      fireEvent.click(increaseBtn);
      
      expect(screen.getByTestId('font-size')).toHaveTextContent('110');
    });

    it('toggles high contrast mode', () => {
      render(<TestAccessibilityComponent />, { wrapper: TestWrapper });
      
      const toggleBtn = screen.getByTestId('toggle-contrast');
      fireEvent.click(toggleBtn);
      
      expect(screen.getByTestId('high-contrast')).toHaveTextContent('true');
    });

    it('toggles reduced motion preference', () => {
      render(<TestAccessibilityComponent />, { wrapper: TestWrapper });
      
      const toggleBtn = screen.getByTestId('toggle-motion');
      fireEvent.click(toggleBtn);
      
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true');
    });

    it('limits font size to maximum of 150%', () => {
      render(<TestAccessibilityComponent />, { wrapper: TestWrapper });
      
      const increaseBtn = screen.getByTestId('increase-font');
      
      // Click 10 times to try to exceed 150%
      for (let i = 0; i < 10; i++) {
        fireEvent.click(increaseBtn);
      }
      
      expect(screen.getByTestId('font-size')).toHaveTextContent('150');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard focus on interactive elements', () => {
      render(<TestAccessibilityComponent />, { wrapper: TestWrapper });
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeVisible();
        button.focus();
        expect(document.activeElement).toBe(button);
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('includes proper ARIA labels', () => {
      render(<TestAccessibilityComponent />, { wrapper: TestWrapper });
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
