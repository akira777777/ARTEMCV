import React, { ReactNode, ReactElement } from 'react';
import devLog from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and logs error info
 * Provides graceful fallback UI instead of white screen
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    devLog.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Optional: Send to error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-zinc-900/50 rounded-[2rem] border border-white/5 space-y-6">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-serif text-red-400">Something went wrong</h2>
              <p className="text-zinc-400 text-sm max-w-md">
                We encountered an unexpected error. Please try refreshing the page or come back later.
              </p>
            </div>
            
            <details className="w-full max-w-md text-left">
              <summary className="text-xs uppercase tracking-widest font-bold text-zinc-500 cursor-pointer hover:text-white transition-colors">
                Error Details
              </summary>
              <pre className="mt-3 p-4 bg-black/50 rounded-lg text-[10px] text-red-300 overflow-auto max-h-[200px] border border-red-900/30">
                {this.state.error?.toString()}
              </pre>
            </details>

            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-zinc-200 transition-colors active:scale-95"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
