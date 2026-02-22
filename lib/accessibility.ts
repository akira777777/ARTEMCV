import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Enhanced Accessibility Management Utilities
 *
 * Comprehensive accessibility tools for keyboard navigation,
 * screen reader support, focus management, and ARIA attributes.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-checked'?: boolean;
  'aria-selected'?: boolean;
  'aria-pressed'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: string;
  'aria-busy'?: boolean;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-level'?: number;
  'aria-posinset'?: number;
  'aria-setsize'?: number;
  role?: string;
}

export interface KeyboardNavigationOptions {
  enabled?: boolean;
  focusableSelector?: string;
  wrap?: boolean;
  vertical?: boolean;
  horizontal?: boolean;
}

export interface FocusManagementOptions {
  restoreFocus?: boolean;
  preventScroll?: boolean;
  focusFirst?: boolean;
  focusLast?: boolean;
}

export interface ScreenReaderOptions {
  liveRegion?: boolean;
  announce?: boolean;
  politeness?: 'off' | 'polite' | 'assertive';
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * ARIA attributes management hook
 */
export function useAriaAttributes(attributes: AriaAttributes = {}) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set ARIA attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        element.setAttribute(key, String(value));
      }
    });

    return () => {
      // Clean up ARIA attributes
      Object.keys(attributes).forEach((key) => {
        element.removeAttribute(key);
      });
    };
  }, [attributes]);

  return elementRef;
}

/**
 * Keyboard navigation hook with comprehensive key handling
 */
export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enabled = true,
    focusableSelector = '[tabindex], button, [href], input, select, textarea, [contenteditable="true"]',
    wrap = true,
    vertical = true,
    horizontal = true,
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const getFocusableElements = useCallback(() => {
    const container = containerRef.current;
    if (!container) return [];

    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (element) => {
        const style = window.getComputedStyle(element);
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          !element.hasAttribute('disabled')
        );
      },
    );
  }, [focusableSelector]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const currentIndex =
        focusedIndex >= 0
          ? focusedIndex
          : focusableElements.indexOf(document.activeElement as HTMLElement);
      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowDown':
          if (vertical) {
            event.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= focusableElements.length) {
              nextIndex = wrap ? 0 : focusableElements.length - 1;
            }
          }
          break;

        case 'ArrowUp':
          if (vertical) {
            event.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              nextIndex = wrap ? focusableElements.length - 1 : 0;
            }
          }
          break;

        case 'ArrowRight':
          if (horizontal) {
            event.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= focusableElements.length) {
              nextIndex = wrap ? 0 : focusableElements.length - 1;
            }
          }
          break;

        case 'ArrowLeft':
          if (horizontal) {
            event.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              nextIndex = wrap ? focusableElements.length - 1 : 0;
            }
          }
          break;

        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;

        case 'End':
          event.preventDefault();
          nextIndex = focusableElements.length - 1;
          break;

        case 'Tab':
          // Handle custom tab behavior if needed
          break;

        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        setFocusedIndex(nextIndex);
        focusableElements[nextIndex]?.focus();
      }
    },
    [enabled, getFocusableElements, focusedIndex, vertical, horizontal, wrap],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    containerRef,
    focusedIndex,
    setFocusedIndex,
    getFocusableElements,
  };
}

/**
 * Focus management hook with restoration and trapping
 */
export function useFocusManagement(options: FocusManagementOptions = {}) {
  const {
    restoreFocus: shouldRestoreFocus = true,
    preventScroll = false,
    focusFirst = false,
    focusLast = false,
  } = options;

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (!shouldRestoreFocus || !previousFocusRef.current) return;

    try {
      previousFocusRef.current.focus({ preventScroll });
    } catch (error) {
      console.warn('Failed to restore focus:', error);
    }
  }, [restoreFocus, preventScroll]);

  const focusFirstElement = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = Array.from(focusableElements).find((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    firstElement?.focus({ preventScroll });
  }, [preventScroll]);

  const focusLastElement = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const lastElement = Array.from(focusableElements)
      .reverse()
      .find((element) => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

    lastElement?.focus({ preventScroll });
  }, [preventScroll]);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (focusFirst) {
      focusFirstElement();
    } else if (focusLast) {
      focusLastElement();
    }

    container.addEventListener('keydown', trapFocus);
    return () => container.removeEventListener('keydown', trapFocus);
  }, [focusFirst, focusLast, focusFirstElement, focusLastElement, trapFocus]);

  return {
    containerRef,
    saveFocus,
    restoreFocus,
    focusFirstElement,
    focusLastElement,
    trapFocus,
  };
}

/**
 * Screen reader announcement hook
 */
export function useScreenReader(options: ScreenReaderOptions = {}) {
  const { liveRegion = true, announce: shouldAnnounce = true, politeness = 'polite' } = options;

  const announcementRef = useRef<HTMLDivElement | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!liveRegion) return;

    const container = document.getElementById('sr-live-region');
    if (!container) {
      const newContainer = document.createElement('div');
      newContainer.id = 'sr-live-region';
      newContainer.setAttribute('aria-live', politeness);
      newContainer.setAttribute('aria-atomic', 'true');
      newContainer.style.position = 'absolute';
      newContainer.style.left = '-10000px';
      newContainer.style.width = '1px';
      newContainer.style.height = '1px';
      newContainer.style.overflow = 'hidden';
      document.body.appendChild(newContainer);
      announcementRef.current = newContainer;
    } else {
      announcementRef.current = container as HTMLDivElement;
    }
  }, [liveRegion, politeness]);

  const announce = useCallback(
    (message: string) => {
      if (!shouldAnnounce || !announcementRef.current) return;

      setAnnouncement(message);
      setTimeout(() => {
        setAnnouncement('');
      }, 100);
    },
    [announce],
  );

  const announcePolite = useCallback(
    (message: string) => {
      if (announcementRef.current) {
        announcementRef.current.setAttribute('aria-live', 'polite');
        announce(message);
        setTimeout(() => {
          announcementRef.current?.setAttribute('aria-live', politeness);
        }, 100);
      }
    },
    [announce, politeness],
  );

  const announceAssertive = useCallback(
    (message: string) => {
      if (announcementRef.current) {
        announcementRef.current.setAttribute('aria-live', 'assertive');
        announce(message);
        setTimeout(() => {
          announcementRef.current?.setAttribute('aria-live', politeness);
        }, 100);
      }
    },
    [announce, politeness],
  );

  return {
    announcement,
    announce,
    announcePolite,
    announceAssertive,
  };
}

/**
 * Skip link management hook
 */
export function useSkipLinks() {
  const [skipLinks, setSkipLinks] = useState<Array<{ id: string; label: string; href: string }>>(
    [],
  );

  const addSkipLink = useCallback((link: { id: string; label: string; href: string }) => {
    setSkipLinks((prev) => [...prev, link]);
  }, []);

  const removeSkipLink = useCallback((id: string) => {
    setSkipLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  useEffect(() => {
    // Create skip links container if it doesn't exist
    let container = document.getElementById('skip-links-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'skip-links-container';
      container.style.position = 'absolute';
      container.style.left = '-10000px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.overflow = 'hidden';
      document.body.insertBefore(container, document.body.firstChild);
    }

    // Render skip links
    container.innerHTML = skipLinks
      .map(
        (link) => `
      <a href="${link.href}" id="${link.id}" class="skip-link">
        ${link.label}
      </a>
    `,
      )
      .join('');

    // Add focus styles
    const style = document.createElement('style');
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
      }
      .skip-link:focus {
        top: 6px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [skipLinks]);

  return {
    skipLinks,
    addSkipLink,
    removeSkipLink,
  };
}

/**
 * High contrast detection hook
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      const testElement = document.createElement('div');
      testElement.style.color = 'rgb(1, 2, 3)';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const isHC = computedStyle.color !== 'rgb(1, 2, 3)';

      document.body.removeChild(testElement);
      setIsHighContrast(isHC);
    };

    checkHighContrast();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handler = () => checkHighContrast();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
}

/**
 * Reduced motion detection hook
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Accessibility utilities for common tasks
 */
export const accessibilityUtils = {
  /**
   * Generate ARIA attributes for common patterns
   */
  generateAriaAttributes: (
    type: string,
    options: Record<string, any> = {},
  ): Record<string, any> => {
    switch (type) {
      case 'button':
        return {
          role: 'button',
          tabIndex: 0,
          'aria-pressed': options.pressed || false,
        };

      case 'link':
        return {
          role: 'link',
          tabIndex: 0,
        };

      case 'checkbox':
        return {
          role: 'checkbox',
          'aria-checked': options.checked || false,
          'aria-label': options.label,
        };

      case 'radio':
        return {
          role: 'radio',
          'aria-checked': options.checked || false,
          'aria-label': options.label,
          'aria-posinset': options.posinset,
          'aria-setsize': options.setsize,
        };

      case 'tab':
        return {
          role: 'tab',
          'aria-selected': options.selected || false,
          'aria-controls': options.controls,
          tabIndex: options.selected ? 0 : -1,
        };

      case 'tabpanel':
        return {
          role: 'tabpanel',
          'aria-labelledby': options.labelledby,
          hidden: !options.active,
        };

      case 'dialog':
        return {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': options.titleId,
          'aria-describedby': options.descriptionId,
        };

      default:
        return {};
    }
  },

  /**
   * Check if element is focusable
   */
  isFocusable: (element: HTMLElement): boolean => {
    if (element.tabIndex > 0) return true;
    if (element.disabled) return false;

    const focusableSelectors = [
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'a[href]',
      'area[href]',
      '[tabindex]',
      '[contenteditable="true"]',
    ];

    return focusableSelectors.some((selector) => element.matches(selector));
  },

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'a[href]',
      'area[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];

    return Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors.join(', ')),
    ).filter((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  },

  /**
   * Focus first focusable element in container
   */
  focusFirstElement: (container: HTMLElement): void => {
    const focusableElements = accessibilityUtils.getFocusableElements(container);
    focusableElements[0]?.focus();
  },

  /**
   * Focus last focusable element in container
   */
  focusLastElement: (container: HTMLElement): void => {
    const focusableElements = accessibilityUtils.getFocusableElements(container);
    focusableElements[focusableElements.length - 1]?.focus();
  },

  /**
   * Announce message to screen readers
   */
  announce: (message: string, politeness: 'polite' | 'assertive' = 'polite'): void => {
    const liveRegion =
      document.getElementById('sr-live-region') ||
      (() => {
        const element = document.createElement('div');
        element.id = 'sr-live-region';
        element.setAttribute('aria-live', politeness);
        element.setAttribute('aria-atomic', 'true');
        element.style.position = 'absolute';
        element.style.left = '-10000px';
        element.style.width = '1px';
        element.style.height = '1px';
        element.style.overflow = 'hidden';
        document.body.appendChild(element);
        return element;
      })();

    liveRegion.textContent = message;
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  },

  /**
   * Create accessible modal
   */
  createModal: (element: HTMLElement): { destroy: () => void } => {
    const originalActiveElement = document.activeElement as HTMLElement;
    const focusableElements = accessibilityUtils.getFocusableElements(element);

    // Set modal attributes
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('aria-hidden', 'false');

    // Focus first element
    focusableElements[0]?.focus();

    // Trap focus
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      } else if (event.key === 'Escape') {
        element.setAttribute('aria-hidden', 'true');
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return {
      destroy: () => {
        element.removeEventListener('keydown', handleKeyDown);
        element.setAttribute('aria-hidden', 'true');
        originalActiveElement?.focus();
      },
    };
  },
};

export default {
  useAriaAttributes,
  useKeyboardNavigation,
  useFocusManagement,
  useScreenReader,
  useSkipLinks,
  useHighContrast,
  useReducedMotion,
  accessibilityUtils,
};
