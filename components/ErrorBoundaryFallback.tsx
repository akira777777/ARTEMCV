import React from 'react';
import { useI18n } from '../i18n';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError?: () => void }> = ({ error, resetError }) => {
  const { t } = useI18n();

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-[#050505] text-white">
      <h2 className="text-3xl font-bold mb-4 text-red-400">{t('error.title')}</h2>
      <p className="text-lg mb-6 text-gray-300">{t('error.description')}</p>
      
      {error && (
        <details className="mb-6 w-full max-w-2xl bg-[#0a0a0a] p-4 rounded-lg">
          <summary className="cursor-pointer text-left text-yellow-400 font-medium">
            {t('error.details')}
          </summary>
          <pre className="text-sm text-red-300 mt-2 overflow-auto p-2 bg-[#111] rounded">
            {error.stack}
          </pre>
        </details>
      )}
      
      <button
        onClick={resetError}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#050505]"
      >
        {t('error.retry')}
      </button>
    </div>
  );
};

export default ErrorBoundary;