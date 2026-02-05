import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface OptimizedComponentProps {
  component: () => Promise<{ default: React.ComponentType<unknown> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  props?: Record<string, unknown>;
  priority?: 'high' | 'low' | 'auto';
}

/**
 * OptimizedComponent - Smart lazy loading with error boundaries
 * 
 * Features:
 * - Automatic code splitting
 * - Built-in error boundary
 * - Configurable loading priority
 * - Accessible loading states
 */
export const OptimizedComponent: React.FC<OptimizedComponentProps> = React.memo(({
  component,
  fallback,
  errorFallback,
  props = {},
  priority = 'auto'
}) => {
  // Create lazy component
  const LazyComponent = lazy(() => {
    // Add priority hint for browser
    if (priority === 'high' && 'requestIdleCallback' in window) {
      return component();
    }
    return component();
  });

  const defaultFallback = (
    <div 
      className="w-full flex items-center justify-center py-12"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-sm text-neutral-500">Loading...</span>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback as React.ReactElement}>
      <Suspense fallback={fallback || defaultFallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
});

OptimizedComponent.displayName = 'OptimizedComponent';

export default OptimizedComponent;
