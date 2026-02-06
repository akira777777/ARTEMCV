import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * KeyboardNavigationManager - Component to enhance keyboard navigation
 * Follows WCAG 2.1 guidelines for keyboard accessibility
 */
export const KeyboardNavigationManager: React.FC = () => {
  const [isTabbing, setIsTabbing] = useState(false);
  const [focusOutline, setFocusOutline] = useState(true);

  useEffect(() => {
    // Detect when user is navigating with keyboard vs mouse
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsTabbing(true);
      }
    };

    const handleMouseDown = () => {
      setIsTabbing(false);
    };

    const handleFocus = (e: Event) => {
      // Only apply focus outline when using keyboard navigation
      if (isTabbing) {
        setFocusOutline(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocus);
    };
  }, [isTabbing]);

  // Add focus styles dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: ${focusOutline ? '2px solid #818cf8' : 'none'} !important;
        outline-offset: 2px;
      }
      .focus-ring:focus {
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.4) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [focusOutline]);

  return null;
};

/**
 * SkipToContentLink - WCAG compliant skip link for keyboard users
 */
export const SkipToContentLink: React.FC = () => {
  const skipToContent = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content') || 
                       document.getElementById('content') || 
                       document.querySelector('main') ||
                       document.querySelector('article');
    
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <a
      href="#main-content"
      onClick={skipToContent}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          skipToContent(e);
        }
      }}
      className="fixed top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-[9999] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500 -translate-y-full focus:translate-y-0 transition-transform duration-300"
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
};

/**
 * FocusTrap - Traps focus within a container for modal dialogs
 */
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  returnFocus?: boolean;
  autoFocus?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ 
  children, 
  active, 
  returnFocus = true,
  autoFocus = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (focusableElements?.length > 0 && autoFocus) {
        focusableElements[0]?.focus();
      }
    }

    return () => {
      if (returnFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [active, returnFocus, autoFocus]);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div 
      ref={containerRef} 
      tabIndex={-1}
      aria-modal={active}
      role={active ? 'dialog' : undefined}
    >
      {children}
    </div>
  );
};

/**
 * AriaLiveRegion - Announces dynamic content changes to screen readers
 */
interface AriaLiveRegionProps {
  children: React.ReactNode;
  politeness?: 'off' | 'polite' | 'assertive';
  id?: string;
}

export const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({ 
  children, 
  politeness = 'polite',
  id = 'aria-live-region'
}) => {
  return (
    <div
      id={id}
      role="alert"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
};

/**
 * SemanticHeadingStructure - Helper component to ensure proper heading hierarchy
 */
interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  id?: string;
}

export const SemanticHeading: React.FC<HeadingProps> = ({ 
  children, 
  level, 
  className = '',
  id 
}) => {
  const HeadingTag = `h${level}` as React.ElementType;
  
  return React.createElement(HeadingTag, {
    className,
    id,
    tabIndex: -1
  }, children);
};

/**
 * AccessibleModal - WCAG compliant modal dialog component
 */
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  labelledBy?: string;
  describedBy?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  labelledBy,
  describedBy
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`modal-title-${Date.now()}`).current;
  const descriptionId = useRef(`modal-description-${Date.now()}`).current;

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <FocusTrap active={true}>
      <div
        ref={modalRef}
        className="fixed inset-0 z-[9999] overflow-y-auto"
        aria-modal="true"
        aria-labelledby={labelledBy || titleId}
        aria-describedby={describedBy || descriptionId}
        tabIndex={-1}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          
          <div 
            role="dialog"
            className="relative bg-black border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <SemanticHeading level={2} id={labelledBy || titleId}>
                {title}
              </SemanticHeading>
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            <div id={describedBy || descriptionId}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};
