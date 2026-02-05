import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useI18n } from '../i18n';

/**
 * AccessibilityPanel - Component for managing accessibility features
 * Complies with WCAG 2.1 AA standards
 */
export const AccessibilityPanel: React.FC = () => {
  const { t } = useI18n();
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
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (e) {
      // localStorage might be blocked
    }
  }, [fontSize, contrast, reduceMotion, showFocus]);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setFontSize(parsed.fontSize || 'normal');
        setContrast(parsed.contrast || 'normal');
        setReduceMotion(parsed.reduceMotion || false);
        setShowFocus(parsed.showFocus !== false);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Font size labels with i18n
  const fontSizeLabels = useMemo(() => ({
    normal: t('accessibility.font_size') === 'Размер текста' ? 'Обычный' : 
            t('accessibility.font_size') === 'Velikost textu' ? 'Normální' : 'Normal',
    large: t('accessibility.font_size') === 'Размер текста' ? 'Крупный' : 
           t('accessibility.font_size') === 'Velikost textu' ? 'Velký' : 'Large',
    larger: t('accessibility.font_size') === 'Размер текста' ? 'Очень крупный' : 
            t('accessibility.font_size') === 'Velikost textu' ? 'Velký' : 'Larger'
  }), [t]);

  // Contrast labels with i18n
  const contrastLabels = useMemo(() => ({
    normal: t('accessibility.contrast') === 'Контраст' ? 'Обычный' : 
            t('accessibility.contrast') === 'Kontrast' ? 'Normální' : 'Normal',
    high: t('accessibility.contrast') === 'Контраст' ? 'Высокий' : 
          t('accessibility.contrast') === 'Kontrast' ? 'Vysoký' : 'High'
  }), [t]);

  return (
    <>
      {/* Accessibility toolbar */}
      <div 
        className={`fixed bottom-4 right-4 z-[9999] transition-all duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-[120%]'
        }`}
        role="region"
        aria-label={t('accessibility.title')}
      >
        <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-sm">{t('accessibility.title')}</h3>
            <button
              onClick={togglePanel}
              className="text-white hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
              aria-label={isOpen ? t('accessibility.close') : t('accessibility.open')}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Font size control */}
            <div>
              <span className="block text-white text-xs font-bold mb-2">
                {t('accessibility.font_size')}
              </span>
              <div className="flex gap-2" role="radiogroup" aria-label={t('accessibility.font_size')}>
                {(['normal', 'large', 'larger'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-3 py-1 text-xs rounded border ${
                      fontSize === size
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                    role="radio"
                    aria-checked={fontSize === size}
                  >
                    {fontSizeLabels[size]}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Contrast control */}
            <div>
              <span className="block text-white text-xs font-bold mb-2">
                {t('accessibility.contrast')}
              </span>
              <div className="flex gap-2" role="radiogroup" aria-label={t('accessibility.contrast')}>
                {(['normal', 'high'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setContrast(level)}
                    className={`px-3 py-1 text-xs rounded border ${
                      contrast === level
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                    role="radio"
                    aria-checked={contrast === level}
                  >
                    {contrastLabels[level]}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Motion reduction */}
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">
                {t('accessibility.reduce_motion')}
              </span>
              <button
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
              <span className="text-white text-xs font-bold">
                {t('accessibility.focus_indicator')}
              </span>
              <button
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
        className="fixed bottom-4 right-4 z-[9998] bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500 transition-colors"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={t('accessibility.open')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
    </>
  );
};

AccessibilityPanel.displayName = 'AccessibilityPanel';

/**
 * SkipLink - Component for keyboard navigation
 */
export const SkipLink: React.FC = () => {
  const { t } = useI18n();
  
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
      className="fixed top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-[9999] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500 -translate-y-full focus:translate-y-0 transition-transform duration-200 font-bold"
      tabIndex={0}
    >
      {t('accessibility.skip_to_main')}
    </a>
  );
};

SkipLink.displayName = 'SkipLink';

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

FocusTrap.displayName = 'FocusTrap';

/**
 * ScreenReaderOnly - Component to hide content visually but keep it accessible to screen readers
 */
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

ScreenReaderOnly.displayName = 'ScreenReaderOnly';
