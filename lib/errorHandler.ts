import * as React from 'react';
import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Enhanced Error Handling Utilities
 *
 * Comprehensive error handling, logging, reporting, and recovery mechanisms.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'runtime' | 'network' | 'validation' | 'permission' | 'unknown';
  context?: Record<string, any>;
}

export interface ErrorHandlerConfig {
  enableLogging?: boolean;
  enableReporting?: boolean;
  enableRecovery?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  reportEndpoint?: string;
  maxErrorCount?: number;
  recoveryTimeout?: number;
  enableUserFeedback?: boolean;
  enableSentry?: boolean;
  sentryDsn?: string;
}

export interface ErrorRecovery {
  id: string;
  name: string;
  description: string;
  execute: () => Promise<boolean> | boolean;
  canRetry?: boolean;
  canIgnore?: boolean;
  priority: number;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Global error boundary hook for React components
 */
export function useErrorBoundary(config: ErrorHandlerConfig = {}) {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    enableReporting = true,
    enableRecovery = true,
    logLevel = 'error',
    reportEndpoint = '/api/errors',
    maxErrorCount = 10,
    recoveryTimeout = 5000,
    enableUserFeedback = true,
  } = config;

  const [error, setError] = useState<ErrorInfo | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const errorCount = useRef(0);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logError = useCallback(
    (errorInfo: ErrorInfo) => {
      if (!enableLogging) return;

      const logFn =
        (console as unknown as Record<string, (...args: any[]) => void>)[logLevel] || console.error;
      logFn('[Error Handler]', errorInfo);
    },
    [enableLogging, logLevel],
  );

  const reportError = useCallback(
    async (errorInfo: ErrorInfo) => {
      if (!enableReporting) return;

      try {
        await fetch(reportEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorInfo),
        });
      } catch (reportError) {
        console.error('Failed to report error:', reportError);
      }
    },
    [enableReporting, reportEndpoint],
  );

  const handleGlobalError = useCallback(
    (error: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        message: error.message,
        stack: error.error?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'medium',
        category: 'runtime',
        context: {
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno,
        },
      };

      setError(errorInfo);
      logError(errorInfo);
      reportError(errorInfo);

      errorCount.current++;
    },
    [logError, reportError],
  );

  const handleUnhandledRejection = useCallback(
    (event: PromiseRejectionEvent) => {
      const errorInfo: ErrorInfo = {
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'high',
        category: 'runtime',
        context: {
          reason: event.reason,
        },
      };

      setError(errorInfo);
      logError(errorInfo);
      reportError(errorInfo);

      errorCount.current++;
    },
    [logError, reportError],
  );

  const clearError = useCallback(() => {
    setError(null);
    setIsRecovering(false);
    if (recoveryTimeoutRef.current) {
      clearTimeout(recoveryTimeoutRef.current);
    }
  }, []);

  const attemptRecovery = useCallback(
    async (recoveryStrategies: ErrorRecovery[]) => {
      if (!enableRecovery || !error) return false;

      setIsRecovering(true);

      // Sort strategies by priority
      const sortedStrategies = recoveryStrategies.sort((a, b) => a.priority - b.priority);

      for (const strategy of sortedStrategies) {
        try {
          const success = await strategy.execute();
          if (success) {
            clearError();
            return true;
          }
        } catch (recoveryError) {
          console.warn(`Recovery strategy ${strategy.name} failed:`, recoveryError);
        }
      }

      // Set timeout to clear recovery state
      recoveryTimeoutRef.current = setTimeout(() => {
        setIsRecovering(false);
      }, recoveryTimeout);

      return false;
    },
    [enableRecovery, error, recoveryTimeout, clearError],
  );

  useEffect(() => {
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
      }
    };
  }, [handleGlobalError, handleUnhandledRejection]);

  return {
    error,
    isRecovering,
    errorCount: errorCount.current,
    clearError,
    attemptRecovery,
    canRecover: enableRecovery && errorCount.current < maxErrorCount,
  };
}

/**
 * Network error handler hook
 */
export function useNetworkErrorHandler(config: ErrorHandlerConfig = {}) {
  const { enableLogging = true, enableReporting = true } = config;

  const [networkErrors, setNetworkErrors] = useState<ErrorInfo[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const handleNetworkError = useCallback(
    (error: ErrorInfo) => {
      setNetworkErrors((prev) => [...prev, error]);
      setIsOffline(true);

      if (enableLogging) {
        console.error('[Network Error]', error);
      }

      if (enableReporting) {
        // Report network errors
        fetch('/api/network-errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(error),
        }).catch((reportError) => {
          console.error('Failed to report network error:', reportError);
        });
      }
    },
    [enableLogging, enableReporting],
  );

  const clearNetworkErrors = useCallback(() => {
    setNetworkErrors([]);
    setIsOffline(false);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    networkErrors,
    isOffline,
    handleNetworkError,
    clearNetworkErrors,
  };
}

/**
 * Validation error handler hook
 */
export function useValidationErrorHandler() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const addValidationError = useCallback((field: string, message: string) => {
    setValidationErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const removeValidationError = useCallback((field: string) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const hasValidationErrors = useCallback(() => {
    return Object.keys(validationErrors).length > 0;
  }, [validationErrors]);

  return {
    validationErrors,
    addValidationError,
    removeValidationError,
    clearValidationErrors,
    hasValidationErrors,
  };
}

/**
 * Error recovery manager hook
 */
export function useErrorRecovery() {
  const [recoveryStrategies, setRecoveryStrategies] = useState<ErrorRecovery[]>([]);
  const [isRecovering, setIsRecovering] = useState(false);

  const addRecoveryStrategy = useCallback((strategy: ErrorRecovery) => {
    setRecoveryStrategies((prev) => [...prev, strategy]);
  }, []);

  const removeRecoveryStrategy = useCallback((id: string) => {
    setRecoveryStrategies((prev) => prev.filter((strategy) => strategy.id !== id));
  }, []);

  const executeRecovery = useCallback(
    async (error: ErrorInfo): Promise<boolean> => {
      if (isRecovering) return false;

      setIsRecovering(true);

      try {
        // Sort strategies by priority
        const sortedStrategies = recoveryStrategies.sort((a, b) => a.priority - b.priority);

        for (const strategy of sortedStrategies) {
          try {
            const success = await strategy.execute();
            if (success) {
              setIsRecovering(false);
              return true;
            }
          } catch (recoveryError) {
            console.warn(`Recovery strategy ${strategy.name} failed:`, recoveryError);
          }
        }

        setIsRecovering(false);
        return false;
      } catch (error) {
        setIsRecovering(false);
        throw error;
      }
    },
    [recoveryStrategies, isRecovering],
  );

  const clearRecoveryStrategies = useCallback(() => {
    setRecoveryStrategies([]);
  }, []);

  return {
    recoveryStrategies,
    isRecovering,
    addRecoveryStrategy,
    removeRecoveryStrategy,
    executeRecovery,
    clearRecoveryStrategies,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Error handling utilities for common scenarios
 */
export const errorUtils = {
  /**
   * Create error info object
   */
  createErrorInfo: (
    error: Error | string,
    context?: Record<string, any>,
    severity: ErrorInfo['severity'] = 'medium',
    category: ErrorInfo['category'] = 'runtime',
  ): ErrorInfo => {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;

    return {
      message,
      stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity,
      category,
      context,
    };
  },

  /**
   * Log error with context
   */
  logError: (error: ErrorInfo, level: 'debug' | 'info' | 'warn' | 'error' = 'error') => {
    const logFn =
      (console as unknown as Record<string, (...args: any[]) => void>)[level] || console.error;
    logFn('[Error]', {
      message: error.message,
      severity: error.severity,
      category: error.category,
      timestamp: new Date(error.timestamp).toISOString(),
      url: error.url,
      context: error.context,
    });
  },

  /**
   * Report error to server
   */
  reportError: async (error: ErrorInfo): Promise<boolean> => {
    try {
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });

      return response.ok;
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
      return false;
    }
  },

  /**
   * Handle fetch errors with retry logic
   */
  fetchWithRetry: async <T>(
    url: string,
    options: RequestInit = {},
    retries: number = 3,
    delay: number = 1000,
  ): Promise<T> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries exceeded');
  },

  /**
   * Create recovery strategies
   */
  createRecoveryStrategies: () => {
    const strategies: ErrorRecovery[] = [];

    // Cache clear strategy
    strategies.push({
      id: 'cache-clear',
      name: 'Clear Cache',
      description: 'Clear browser cache and reload',
      execute: async () => {
        try {
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
          }
          return true;
        } catch (error) {
          console.warn('Cache clear failed:', error);
          return false;
        }
      },
      canRetry: true,
      priority: 1,
    });

    // Service worker reset strategy
    strategies.push({
      id: 'service-worker-reset',
      name: 'Reset Service Worker',
      description: 'Unregister and reload service worker',
      execute: async () => {
        try {
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map((reg) => reg.unregister()));
          }
          return true;
        } catch (error) {
          console.warn('Service worker reset failed:', error);
          return false;
        }
      },
      canRetry: true,
      priority: 2,
    });

    // Local storage reset strategy
    strategies.push({
      id: 'local-storage-reset',
      name: 'Reset Local Storage',
      description: 'Clear local storage data',
      execute: async () => {
        try {
          localStorage.clear();
          return true;
        } catch (error) {
          console.warn('Local storage reset failed:', error);
          return false;
        }
      },
      canRetry: true,
      priority: 3,
    });

    // Reload page strategy
    strategies.push({
      id: 'page-reload',
      name: 'Reload Page',
      description: 'Reload the entire page',
      execute: async () => {
        try {
          window.location.reload();
          return true;
        } catch (error) {
          console.warn('Page reload failed:', error);
          return false;
        }
      },
      canRetry: false,
      priority: 10,
    });

    return strategies;
  },

  /**
   * Handle permission errors
   */
  handlePermissionError: (permission: PermissionName) => {
    return new Promise<PermissionState>((resolve, reject) => {
      if (!('permissions' in navigator)) {
        reject(new Error('Permissions API not supported'));
        return;
      }

      navigator.permissions
        .query({ name: permission })
        .then((result) => {
          if (result.state === 'granted') {
            resolve('granted');
          } else if (result.state === 'prompt') {
            // Try to request permission
            switch (permission) {
              case 'notifications':
                Notification.requestPermission().then((permission) => {
                  resolve(permission as PermissionState);
                });
                break;
              case 'geolocation':
                navigator.geolocation.getCurrentPosition(
                  () => resolve('granted'),
                  () => reject(new Error('Geolocation permission denied')),
                );
                break;
              default:
                reject(new Error(`Permission ${permission} not handled`));
            }
          } else {
            reject(new Error(`Permission ${permission} denied`));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /**
   * Create error boundary component
   */
  createErrorBoundary: (
    Component: React.ComponentType<any>,
    fallback?: React.ComponentType<any>,
  ) => {
    return function ErrorBoundary(props: any) {
      const [hasError, setHasError] = useState(false);
      const [error, setError] = useState<Error | null>(null);

      useEffect(() => {
        const handleError = (errorEvent: ErrorEvent) => {
          setHasError(true);
          setError(new Error(errorEvent.message));
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
      }, []);

      if (hasError && error) {
        if (fallback) {
          return React.createElement(fallback, { error });
        }

        return React.createElement(
          'div',
          {
            style: {
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
            },
          },
          React.createElement('h2', null, 'Something went wrong'),
          React.createElement('p', null, error.message),
          React.createElement('button', { onClick: () => window.location.reload() }, 'Reload Page'),
        );
      }

      return React.createElement(Component, props);
    };
  },
};

/**
 * Sentry integration utilities
 */
export const sentryUtils = {
  /**
   * Initialize Sentry
   */
  init: (dsn: string, options: any = {}) => {
    if (!dsn) return;

    // This would integrate with actual Sentry SDK
    console.log('Sentry initialized with DSN:', dsn);
  },

  /**
   * Capture exception
   */
  captureException: (error: Error, context?: any) => {
    console.error('Sentry capture exception:', error, context);
  },

  /**
   * Capture message
   */
  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'error') => {
    console.log(`Sentry capture message [${level}]:`, message);
  },
};

export default {
  useErrorBoundary,
  useNetworkErrorHandler,
  useValidationErrorHandler,
  useErrorRecovery,
  errorUtils,
  sentryUtils,
};
