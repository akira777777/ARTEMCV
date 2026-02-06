import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  setFontSize: (size: number) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setFocusVisible: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const STORAGE_KEY = 'accessibility_preferences';
const LEGACY_STORAGE_KEY = 'accessibility-settings';

interface AccessibilityPreferences {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
}

/**
 * AccessibilityProvider - Provides accessibility settings across the app
 * 
 * Features:
 * - Font size adjustment
 * - High contrast mode
 * - Reduced motion preference
 * - Focus indicator visibility
 * - Persistent storage of preferences
 */
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...defaultPreferences, ...JSON.parse(stored) };
        }
        const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyStored) {
          const legacy = JSON.parse(legacyStored) as {
            fontSize?: 'normal' | 'large' | 'larger';
            contrast?: 'normal' | 'high';
            reduceMotion?: boolean;
            showFocus?: boolean;
          };

          const legacyFontSize = legacy.fontSize;
          const fontSize =
            legacyFontSize === 'large' ? 115 :
            legacyFontSize === 'larger' ? 130 :
            defaultPreferences.fontSize;

          return {
            fontSize,
            highContrast: legacy.contrast === 'high',
            reducedMotion: legacy.reduceMotion ?? defaultPreferences.reducedMotion,
            focusVisible: legacy.showFocus ?? defaultPreferences.focusVisible,
          };
        }
      } catch {
        // Ignore storage errors
      }
      
      // Check for system reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return { ...defaultPreferences, reducedMotion: prefersReducedMotion };
    }
    return defaultPreferences;
  });

  const { fontSize, highContrast, reducedMotion, focusVisible } = preferences;

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch {
        // Ignore storage errors
      }
    }
  }, [preferences]);

  // Apply font size
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${fontSize}%`;
    }
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  }, [highContrast]);

  // Apply reduced motion
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (reducedMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    }
  }, [reducedMotion]);

  // Apply focus visible
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (focusVisible) {
        document.documentElement.classList.add('focus-visible-enabled');
      } else {
        document.documentElement.classList.remove('focus-visible-enabled');
      }
    }
  }, [focusVisible]);

  const updatePreference = useCallback(<K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    updatePreference('fontSize', Math.max(80, Math.min(150, size)));
  }, [updatePreference]);

  const setHighContrast = useCallback((enabled: boolean) => {
    updatePreference('highContrast', enabled);
  }, [updatePreference]);

  const setReducedMotion = useCallback((enabled: boolean) => {
    updatePreference('reducedMotion', enabled);
  }, [updatePreference]);

  const setFocusVisible = useCallback((enabled: boolean) => {
    updatePreference('focusVisible', enabled);
  }, [updatePreference]);

  const value: AccessibilityContextType = {
    fontSize,
    highContrast,
    reducedMotion,
    focusVisible,
    setFontSize,
    setHighContrast,
    setReducedMotion,
    setFocusVisible,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

const defaultPreferences: AccessibilityPreferences = {
  fontSize: 100,
  highContrast: false,
  reducedMotion: false,
  focusVisible: true,
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;
