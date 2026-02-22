import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Accessibility Utilities and Hooks
 *
 * Comprehensive accessibility utilities for improving screen reader support,
 * keyboard navigation, focus management, and ARIA compliance.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface FocusOptions {
  preventScroll?: boolean;
  selectTextIfInput?: boolean;
}

export interface KeyboardNavigationOptions {
  enabled?: boolean;
  focusableSelector?: string;
  wrap?: boolean;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook for managing focus trapping within a container
 * Useful for modals, dialogs, and other focus-controlling components
 */
export function useFocusTrap(
  isActive: boolean,
  options: FocusOptions = {},
): React.RefObject<HTMLElement> {
  const containerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the currently focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the container
    const focusableElement = getFirstFocusableElement(containerRef.current);
    if (focusableElement) {
      focusableElement.focus({ preventScroll: options.preventScroll });
    }

    // Handle focus trapping
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const container = containerRef.current;

      if (!container || !target) return;

      // If focus leaves the container, redirect it back
      if (!container.contains(target)) {
        const firstFocusable = getFirstFocusableElement(container);
        if (firstFocusable) {
          firstFocusable.focus({ preventScroll: options.preventScroll });
        }
      }
    };

    document.addEventListener('focus', handleFocus, true);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      // Restore focus to the previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus({ preventScroll: options.preventScroll });
      }
    };
  }, [isActive, options.preventScroll]);

  return containerRef;
}

/**
 * Hook for keyboard navigation within a container
 * Supports arrow keys, Home/End, and Tab navigation
 */
export function useKeyboardNavigation(
  options: KeyboardNavigationOptions = {},
): React.RefObject<HTMLElement> {
  const containerRef = useRef<HTMLElement>(null);
  const {
    enabled = true,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    wrap = true,
  } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !containerRef.current) return;

      const container = containerRef.current;
      const focusableElements = getFocusableElements(container, focusableSelector);

      if (focusableElements.length === 0) return;

      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          nextIndex =
            currentIndex < focusableElements.length - 1
              ? currentIndex + 1
              : wrap
                ? 0
                : currentIndex;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex =
            currentIndex > 0
              ? currentIndex - 1
              : wrap
                ? focusableElements.length - 1
                : currentIndex;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = focusableElements.length - 1;
          break;
        default:
          return;
      }

      if (focusableElements[nextIndex]) {
        focusableElements[nextIndex].focus();
      }
    },
    [enabled, focusableSelector, wrap],
  );

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return containerRef;
}

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnouncement(): (message: string, priority?: 'polite' | 'assertive') => void {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcement region if it doesn't exist
    if (!announcementRef.current) {
      const div = document.createElement('div');
      div.setAttribute('aria-live', 'polite');
      div.setAttribute('aria-atomic', 'true');
      div.style.position = 'absolute';
      div.style.left = '-10000px';
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.overflow = 'hidden';
      document.body.appendChild(div);
      announcementRef.current = div;
    }

    return () => {
      if (announcementRef.current && announcementRef.current.parentNode) {
        announcementRef.current.parentNode.removeChild(announcementRef.current);
      }
    };
  }, []);

  return useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;

      // Clear the message after a short delay to allow for re-announcements
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);
}

/**
 * Hook for managing skip links
 */
export function useSkipLink(targetId: string): (e: React.MouseEvent | React.KeyboardEvent) => void {
  return useCallback(
    (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [targetId],
  );
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get the first focusable element within a container
 */
export function getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return container.querySelector(focusableSelector) as HTMLElement;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement, selector?: string): HTMLElement[] {
  const focusableSelector =
    selector || 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll(focusableSelector)) as HTMLElement[];
}

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (
    element.tabIndex < 0 ||
    element.disabled ||
    element.hidden ||
    element.style.display === 'none' ||
    element.style.visibility === 'hidden'
  ) {
    return false;
  }

  switch (element.tagName) {
    case 'INPUT':
      return (element as HTMLInputElement).type !== 'hidden';
    case 'A':
    case 'AREA':
      return !!(element as HTMLAnchorElement).href;
    default:
      return true;
  }
}

/**
 * Focus an element with options
 */
export function focusElement(element: HTMLElement, options: FocusOptions = {}): void {
  if (!element || !isFocusable(element)) return;

  try {
    element.focus({
      preventScroll: options.preventScroll,
    });

    if (
      options.selectTextIfInput &&
      (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)
    ) {
      element.select();
    }
  } catch (error) {
    console.warn('Failed to focus element:', error);
  }
}

/**
 * Generate ARIA attributes for a component
 */
export function generateAriaAttributes(props: {
  id?: string;
  label?: string;
  describedBy?: string;
  labelledBy?: string;
  hidden?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  role?: string;
  expanded?: boolean;
  pressed?: boolean;
  selected?: boolean;
  disabled?: boolean;
  level?: number;
}): Record<string, string> {
  const attributes: Record<string, string> = {};

  if (props.id) attributes.id = props.id;
  if (props.label) attributes['aria-label'] = props.label;
  if (props.describedBy) attributes['aria-describedby'] = props.describedBy;
  if (props.labelledBy) attributes['aria-labelledby'] = props.labelledBy;
  if (props.hidden !== undefined) attributes['aria-hidden'] = props.hidden.toString();
  if (props.live) attributes['aria-live'] = props.live;
  if (props.role) attributes.role = props.role;
  if (props.expanded !== undefined) attributes['aria-expanded'] = props.expanded.toString();
  if (props.pressed !== undefined) attributes['aria-pressed'] = props.pressed.toString();
  if (props.selected !== undefined) attributes['aria-selected'] = props.selected.toString();
  if (props.disabled !== undefined) attributes['aria-disabled'] = props.disabled.toString();
  if (props.level) attributes['aria-level'] = props.level.toString();

  return attributes;
}

/**
 * Check color contrast ratio between two colors
 * Returns true if contrast meets WCAG AA standards
 */
export function checkColorContrast(
  foregroundColor: string,
  backgroundColor: string,
  largeText = false,
): boolean {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(foregroundColor);
  const lum2 = getLuminance(backgroundColor);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);

  // WCAG AA standards: 4.5:1 for normal text, 3:1 for large text
  const threshold = largeText ? 3 : 4.5;
  return ratio >= threshold;
}

/**
 * Announce loading state changes to screen readers
 * Note: Since this is a utility function, not a hook or component, it uses the global fallback approach.
 * For React components, prefer using the `useAnnouncement` hook directly.
 */
export function announceLoadingState(isLoading: boolean, itemName?: string): void {
  const message = isLoading
    ? `${itemName || 'Content'} is loading...`
    : `${itemName || 'Content'} has finished loading.`;

  // Use a global fallback for announcements when outside React context
  const liveRegion =
    document.getElementById('sr-global-announcer') ||
    (() => {
      const element = document.createElement('div');
      element.id = 'sr-global-announcer';
      element.setAttribute('aria-live', 'polite');
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
}

/**
 * Create accessible button props
 */
export function createAccessibleButtonProps(props: {
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  label: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}): React.ButtonHTMLAttributes<HTMLButtonElement> {
  return {
    onClick: props.onClick,
    'aria-label': props.label,
    disabled: props.disabled,
    type: props.type || 'button',
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        props.onClick(e);
      }
    },
  };
}

/**
 * Create accessible link props
 */
export function createAccessibleLinkProps(props: {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  external?: boolean;
}): React.AnchorHTMLAttributes<HTMLAnchorElement> {
  const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: props.href,
    'aria-label': props.label,
    onClick: props.onClick,
  };

  if (props.external) {
    linkProps.target = '_blank';
    linkProps.rel = 'noopener noreferrer';
    linkProps['aria-label'] = `${props.label} (opens in new window)`;
  }

  return linkProps;
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Skip Link Component
 */
export const SkipLink: React.FC<{
  targetId: string;
  children: React.ReactNode;
}> = ({ targetId, children }) => {
  const handleClick = useSkipLink(targetId);

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      className="fixed top-4 left-4 z-50 bg-white text-black px-4 py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all opacity-0 hover:opacity-100 focus:opacity-100"
      tabIndex={0}
    >
      {children}
    </a>
  );
};

/**
 * Screen Reader Only Component
 */
export const ScreenReaderOnly: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <span
      className="sr-only"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
};

/**
 * Live Region Component
 */
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  priority?: 'polite' | 'assertive' | 'off';
  className?: string;
}> = ({ children, priority = 'polite', className }) => {
  return (
    <div role="status" aria-live={priority} aria-atomic="true" className={className}>
      {children}
    </div>
  );
};

export default {
  useFocusTrap,
  useKeyboardNavigation,
  useAnnouncement,
  useSkipLink,
  getFirstFocusableElement,
  getFocusableElements,
  isFocusable,
  focusElement,
  generateAriaAttributes,
  checkColorContrast,
  announceLoadingState,
  createAccessibleButtonProps,
  createAccessibleLinkProps,
  SkipLink,
  ScreenReaderOnly,
  LiveRegion,
};
