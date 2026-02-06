import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useLogger } from '../lib/logger-enhanced';

// ============================================================================
// Types
// ============================================================================

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ============================================================================
// Styles
// ============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '2rem',
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#f87171',
    marginBottom: '0.5rem',
    textAlign: 'center' as const,
  },
  message: {
    color: '#9ca3af',
    textAlign: 'center' as const,
    maxWidth: '400px',
    marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  details: {
    width: '100%',
    maxWidth: '500px',
    marginBottom: '1.5rem',
  },
  summary: {
    cursor: 'pointer',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: '0.75rem',
  },
  pre: {
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    color: '#f87171',
    overflow: 'auto',
    maxHeight: '200px',
    border: '1px solid rgba(248, 113, 113, 0.2)',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '9999px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '9999px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// ============================================================================
// Default Fallback Component
// ============================================================================

interface DefaultFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({ error, errorInfo, onReset }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={styles.container} role="alert" aria-live="assertive">
      <div style={styles.icon}>⚠️</div>
      
      <h2 style={styles.title}>Something went wrong</h2>
      
      <p style={styles.message}>
        We encountered an unexpected error. Please try refreshing the page or 
        contact support if the problem persists.
      </p>

      {process.env.NODE_ENV !== 'production' && (
        <details style={styles.details}>
          <summary 
            style={styles.summary}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Show'} Error Details
          </summary>
          <pre style={styles.pre}>
            {error.toString()}
            {errorInfo?.componentStack}
          </pre>
        </details>
      )}

      <div style={styles.actions}>
        <button
          onClick={onReset}
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          Try Again
        </button>
        
        <button
          onClick={handleReload}
          style={styles.secondaryButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Reload Page
        </button>
        
        <button
          onClick={handleGoHome}
          style={styles.secondaryButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Enhanced Error Boundary Component
// ============================================================================

export class ErrorBoundaryEnhanced extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private logger = { error: console.error, info: console.log };
  
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log the error
    this.logger.error('ErrorBoundary caught an error:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      this.reportError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (!hasError) return;

    // Reset when resetKeys change
    if (resetKeys && resetKeys.length > 0) {
      const keysChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );
      
      if (keysChanged) {
        this.handleReset();
        return;
      }
    }

    // Reset on any props change if configured
    if (resetOnPropsChange) {
      const propsChanged = Object.keys(prevProps).some(
        key => key !== 'children' && (prevProps as any)[key] !== (this.props as any)[key]
      );
      
      if (propsChanged) {
        this.handleReset();
      }
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // Send error to analytics endpoint
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silent fail - don't cause infinite error loops
    });
  }

  private handleReset = (): void => {
    this.logger.info('Resetting error boundary');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) {
      return children;
    }

    // Custom fallback
    if (fallback) {
      return fallback;
    }

    // Default fallback UI
    return (
      <DefaultFallback
        error={error}
        errorInfo={errorInfo}
        onReset={this.handleReset}
      />
    );
  }
}

// ============================================================================
// Hook for Functional Components
// ============================================================================

import { useState, useCallback } from 'react';

export interface UseErrorBoundaryReturn {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  hasError: boolean;
  resetError: () => void;
  catchError: (error: Error, errorInfo?: ErrorInfo) => void;
}

/**
 * Hook for handling errors in functional components
 * Note: This doesn't catch React render errors - use ErrorBoundary for that
 */
export function useErrorBoundary(): UseErrorBoundaryReturn {
  const [state, setState] = useState<{
    error: Error | null;
    errorInfo: ErrorInfo | null;
    hasError: boolean;
  }>({
    error: null,
    errorInfo: null,
    hasError: false,
  });

  const resetError = useCallback(() => {
    setState({
      error: null,
      errorInfo: null,
      hasError: false,
    });
  }, []);

  const catchError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    setState({
      error,
      errorInfo: errorInfo || null,
      hasError: true,
    });
  }, []);

  return {
    error: state.error,
    errorInfo: state.errorInfo,
    hasError: state.hasError,
    resetError,
    catchError,
  };
}

export default ErrorBoundaryEnhanced;
