import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * AccessibilityPanel - Component for managing accessibility features
 * Complies with WCAG 2.1 AA standards
 */
export const AccessibilityPanel: React.FC = () => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [contrast, setContrast] = useState<'normal' | 'high'>('normal');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showFocus, setShowFocus] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Apply accessibility settings to document
  useEffect(() => {
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    document.body.classList.add(`font-size-${fontSize}`);
    
    if (contrast === 'high') {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [fontSize, contrast, reduceMotion]);

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      fontSize,
      contrast,
      reduceMotion,
      showFocus
    };
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [fontSize, contrast, reduceMotion, showFocus]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setFontSize(parsed.fontSize || 'normal');
        setContrast(parsed.contrast || 'normal');
        setReduceMotion(parsed.reduceMotion || false);
        setShowFocus(parsed.showFocus || true);
      } catch (e) {
        console.error('Failed to parse accessibility settings', e);
      }
    }
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Font size classes
  const fontSizeClasses = useMemo(() => ({
    normal: 'text-base',
    large: 'text-lg',
    larger: 'text-xl'
  }), []);

  // Contrast classes
  const contrastClasses = useMemo(() => ({
    normal: '',
    high: 'invert'
  }), []);

  return (
    <>
      {/* Accessibility toolbar */}
      <div 
        className={`fixed bottom-4 right-4 z-[9999] transition-all duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-20'
        }`}
        role="region"
        aria-label="Accessibility controls"
      >
        <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-sm">Accessibility Options</h3>
            <button
              onClick={togglePanel}
              className="text-white hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-label={isOpen ? "Close accessibility panel" : "Open accessibility panel"}
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Font size control */}
            <div>
              <label className="block text-white text-xs font-bold mb-2" htmlFor="font-size">
                Text Size
              </label>
              <div className="flex gap-2">
                {(['normal', 'large', 'larger'] as const).map(size => (
                  <button
                    key={size}
                    id={`font-size-${size}`}
                    onClick={() => setFontSize(size)}
                    className={`px-3 py-1 text-xs rounded border ${
                      fontSize === size
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                    aria-pressed={fontSize === size}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Contrast control */}
            <div>
              <label className="block text-white text-xs font-bold mb-2" htmlFor="contrast">
                Contrast
              </label>
              <div className="flex gap-2">
                {(['normal', 'high'] as const).map(level => (
                  <button
                    key={level}
                    id={`contrast-${level}`}
                    onClick={() => setContrast(level)}
                    className={`px-3 py-1 text-xs rounded border ${
                      contrast === level
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                    aria-pressed={contrast === level}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Motion reduction */}
            <div className="flex items-center justify-between">
              <label className="text-white text-xs font-bold" htmlFor="reduce-motion">
                Reduce Motion
              </label>
              <button
                id="reduce-motion"
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                  reduceMotion ? 'bg-indigo-500' : 'bg-white/20'
                }`}
                role="switch"
                aria-checked={reduceMotion}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                    reduceMotion ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {/* Focus indicator */}
            <div className="flex items-center justify-between">
              <label className="text-white text-xs font-bold" htmlFor="show-focus">
                Show Focus Indicator
              </label>
              <button
                id="show-focus"
                onClick={() => setShowFocus(!showFocus)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                  showFocus ? 'bg-indigo-500' : 'bg-white/20'
                }`}
                role="switch"
                aria-checked={showFocus}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                    showFocus ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toggle button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 z-[9998] bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label="Accessibility options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
    </>
  );
};

/**
 * SkipLink - Component for keyboard navigation
 */
export const SkipLink: React.FC = () => {
  const skipToContent = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
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
      className="fixed top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-[9999] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500 -translate-y-full focus:translate-y-0 transition-transform"
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
};

/**
 * FocusTrap - Component to trap focus within a container
 */
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
};

/**
 * ScreenReaderOnly - Component to hide content visually but keep it accessible to screen readers
 */
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="absolute w-px h-px overflow-hidden clip-path-[polygon(0_0,0_0,0_0)] whitespace-nowrap">
      {children}
    </span>
  );
};