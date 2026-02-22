import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Enhanced Theme Management Utilities
 *
 * Advanced theming with CSS-in-JS, dynamic styles, accessibility,
 * and performance optimization.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  lineHeight: {
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface ThemeSpacing {
  px: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface ThemeShadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  outline: string;
}

export interface ThemeRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  radius: ThemeRadius;
  breakpoints: ThemeBreakpoints;
  transitions: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  zIndex: {
    auto: string;
    base: number;
    docked: number;
    dropdown: number;
    sticky: number;
    banner: number;
    overlay: number;
    modal: number;
    popover: number;
    skipLink: number;
    toast: number;
    tooltip: number;
  };
}

export interface ThemeOptions {
  enablePersistence?: boolean;
  persistenceKey?: string;
  enableSystemTheme?: boolean;
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
  customThemes?: Record<string, Partial<ThemeConfig>>;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Enhanced theme hook with CSS-in-JS and dynamic styles
 */
export function useTheme(options: ThemeOptions = {}) {
  const {
    enablePersistence = true,
    persistenceKey = 'app-theme',
    enableSystemTheme = true,
    enableHighContrast = true,
    enableReducedMotion = true,
    customThemes = {},
  } = options;

  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [customTheme, setCustomTheme] = useState<Partial<ThemeConfig>>({});
  const styleSheetRef = useRef<CSSStyleSheet | null>(null);
  const mountedRef = useRef(true);

  // Default theme configuration
  const defaultTheme: ThemeConfig = {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#22c55e',
      info: '#3b82f6',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    typography: {
      fontFamily:
        'Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      lineHeight: {
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
    spacing: {
      px: '1px',
      0: '0px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      outline: '0 0 0 3px rgb(66 153 225 / 0.5)',
    },
    radius: {
      none: '0px',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    transitions: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
      },
    },
    zIndex: {
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800,
    },
  };

  // Get current theme configuration
  const getThemeConfig = useCallback((): ThemeConfig => {
    let themeConfig = { ...defaultTheme };

    // Apply custom theme overrides
    if (Object.keys(customTheme).length > 0) {
      themeConfig = mergeTheme(themeConfig, customTheme);
    }

    // Apply system theme adjustments
    if (enableSystemTheme) {
      const systemTheme = getSystemTheme();
      if (systemTheme === 'dark') {
        themeConfig = applyDarkTheme(themeConfig);
      }
    }

    // Apply high contrast adjustments
    if (enableHighContrast && isHighContrastEnabled()) {
      themeConfig = applyHighContrastTheme(themeConfig);
    }

    return themeConfig;
  }, [customTheme, enableSystemTheme, enableHighContrast]);

  // Apply theme to document
  const applyTheme = useCallback(
    (themeName: string) => {
      if (!mountedRef.current) return;

      const themeConfig = getThemeConfig();

      // Update CSS custom properties
      updateCSSCustomProperties(themeConfig);

      // Update CSS-in-JS styles
      updateCSSInJS(themeConfig);

      // Update document class
      document.documentElement.classList.remove('light', 'dark', 'high-contrast');
      document.documentElement.classList.add(themeName);

      // Update meta theme-color
      updateThemeColor(themeConfig.colors.primary);

      // Save to persistence
      if (enablePersistence) {
        try {
          localStorage.setItem(persistenceKey, themeName);
        } catch (error) {
          console.warn('Failed to save theme:', error);
        }
      }

      setCurrentTheme(themeName);
    },
    [getThemeConfig, enablePersistence, persistenceKey],
  );

  // Initialize theme
  useEffect(() => {
    // Load from persistence
    if (enablePersistence) {
      try {
        const savedTheme = localStorage.getItem(persistenceKey);
        if (savedTheme) {
          applyTheme(savedTheme);
          return;
        }
      } catch (error) {
        console.warn('Failed to load saved theme:', error);
      }
    }

    // Use system theme as fallback
    if (enableSystemTheme) {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else {
      applyTheme('light');
    }

    // Set up system theme listener
    if (enableSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme(getSystemTheme());
      mediaQuery.addEventListener('change', handler);

      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [applyTheme, enablePersistence, enableSystemTheme, persistenceKey]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    currentTheme,
    customTheme,
    setCustomTheme,
    applyTheme,
    getThemeConfig,
    toggleTheme: () => applyTheme(currentTheme === 'light' ? 'dark' : 'light'),
    setTheme: applyTheme,
  };
}

/**
 * CSS-in-JS hook for dynamic styles
 */
export function useCSSInJS(styles: Record<string, any>, dependencies: any[] = []) {
  const styleId = useRef<string>(`css-${Math.random().toString(36).substr(2, 9)}`);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!mountedRef.current) return;

    // Create or update style element
    let styleElement = document.getElementById(styleId.current) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId.current;
      document.head.appendChild(styleElement);
    }

    // Generate CSS from styles object
    const css = generateCSS(styles);
    styleElement.textContent = css;

    return () => {
      if (styleElement && mountedRef.current) {
        document.head.removeChild(styleElement);
      }
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return styleId.current;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Theme utilities for common tasks
 */
export const themeUtils = {
  /**
   * Generate CSS from styles object
   */
  generateCSS: (styles: Record<string, any>): string => {
    let css = '';

    function processStyles(selector: string, styleObj: any, indent = '') {
      const rules: string[] = [];

      for (const [key, value] of Object.entries(styleObj)) {
        if (key.startsWith('@')) {
          // Media query or keyframes
          css += `${indent}${key} {\n`;
          processStyles('', value, indent + '  ');
          css += `${indent}}\n`;
        } else if (typeof value === 'object' && value !== null) {
          // Nested selector
          const nestedSelector = key.startsWith('&')
            ? key.replace('&', selector)
            : `${selector} ${key}`;
          processStyles(nestedSelector, value, indent);
        } else {
          // CSS property
          const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          rules.push(`${indent}  ${cssProperty}: ${value};`);
        }
      }

      if (rules.length > 0 && !selector.startsWith('@')) {
        css += `${indent}${selector} {\n${rules.join('\n')}\n${indent}}\n`;
      }
    }

    processStyles('', styles);
    return css;
  },

  /**
   * Create responsive styles
   */
  createResponsiveStyles: (styles: Record<string, any>, breakpoints: ThemeBreakpoints) => {
    const responsiveStyles: Record<string, any> = {};

    for (const [breakpoint, width] of Object.entries(breakpoints)) {
      responsiveStyles[`@media (min-width: ${width})`] = {
        [`.${breakpoint}-styles`]: styles,
      };
    }

    return responsiveStyles;
  },

  /**
   * Create animation styles with reduced motion support
   */
  createAnimationStyles: (styles: Record<string, any>, duration = '300ms') => {
    return {
      ...styles,
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none !important',
        animation: 'none !important',
      },
    };
  },

  /**
   * Create accessible focus styles
   */
  createFocusStyles: (color: string) => {
    return {
      outline: 'none',
      boxShadow: `0 0 0 3px ${color}`,
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    };
  },

  /**
   * Calculate color contrast ratio
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = parseColor(color);
      const [r, g, b] = rgb.map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if color is accessible
   */
  isAccessible: (color: string, backgroundColor: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = themeUtils.getContrastRatio(color, backgroundColor);
    const requiredRatio = level === 'AA' ? 4.5 : 7;
    return ratio >= requiredRatio;
  },
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Helper functions for theme management
 */
function mergeTheme(base: ThemeConfig, custom: Partial<ThemeConfig>): ThemeConfig {
  return {
    ...base,
    ...custom,
    colors: { ...base.colors, ...custom.colors },
    typography: { ...base.typography, ...custom.typography },
    spacing: { ...base.spacing, ...custom.spacing },
    shadows: { ...base.shadows, ...custom.shadows },
    radius: { ...base.radius, ...custom.radius },
    transitions: { ...base.transitions, ...custom.transitions },
    zIndex: { ...base.zIndex, ...custom.zIndex },
  };
}

function getSystemTheme(): string {
  if (typeof window === 'undefined') return 'light';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
}

function isHighContrastEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-contrast: high)');
  return mediaQuery.matches;
}

function applyDarkTheme(theme: ThemeConfig): ThemeConfig {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
    },
  };
}

function applyHighContrastTheme(theme: ThemeConfig): ThemeConfig {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
      textSecondary: '#000000',
      border: '#000000',
    },
  };
}

function updateCSSCustomProperties(theme: ThemeConfig) {
  const root = document.documentElement;

  // Set color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Set spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Set typography variables
  root.style.setProperty('--font-family', theme.typography.fontFamily);
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--text-${key}`, value);
  });

  // Set shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  // Set radius variables
  Object.entries(theme.radius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Set transition variables
  Object.entries(theme.transitions.duration).forEach(([key, value]) => {
    root.style.setProperty(`--duration-${key}`, value);
  });

  Object.entries(theme.transitions.easing).forEach(([key, value]) => {
    root.style.setProperty(`--ease-${key}`, value);
  });

  // Set z-index variables
  Object.entries(theme.zIndex).forEach(([key, value]) => {
    root.style.setProperty(`--z-${key}`, typeof value === 'number' ? value.toString() : value);
  });
}

function updateCSSInJS(theme: ThemeConfig) {
  // This would update any CSS-in-JS styles that depend on theme
  // Implementation depends on your CSS-in-JS solution
}

function updateThemeColor(color: string) {
  let themeColor = document.querySelector('meta[name="theme-color"]');
  if (!themeColor) {
    themeColor = document.createElement('meta');
    themeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColor);
  }
  themeColor.setAttribute('content', color);
}

function generateCSS(styles: Record<string, any>): string {
  return themeUtils.generateCSS(styles);
}

function parseColor(color: string): [number, number, number] {
  // Simple color parsing - would need more robust implementation
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = color;
  const computedColor = ctx.fillStyle;
  const match = computedColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
  return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
}

export default {
  useTheme,
  useCSSInJS,
  themeUtils,
  mergeTheme,
  getSystemTheme,
  isHighContrastEnabled,
  applyDarkTheme,
  applyHighContrastTheme,
};
