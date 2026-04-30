'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs those errors and displays a fallback UI
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo ?? null);

    // Update state with error information
    this.setState({
      error,
      errorInfo,
    });

    // In production, you might want to log to an error reporting service
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Example: Send to error tracking service
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Something Went Wrong
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 text-center mb-6">
              An unexpected error occurred. Our team has been notified. Please try refreshing the page or go back to the home page.
            </p>

            {/* Error Details (Development Only) */}
            {isDevelopment && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
                <p className="font-mono text-sm text-red-600 font-semibold mb-2">Error Details:</p>
                <p className="font-mono text-xs text-gray-700 mb-3 break-words">
                  {this.state.error.toString()}
                </p>

                {this.state.errorInfo && (
                  <div>
                    <p className="font-mono text-xs text-gray-600 font-semibold mb-1">Stack Trace:</p>
                    <pre className="font-mono text-xs text-gray-700 overflow-x-auto max-h-40 bg-white p-2 rounded border border-gray-300">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>

              <a
                href="/"
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-center"
              >
                Go to Home
              </a>
            </div>

            {/* Support Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600">
                If this problem persists, please contact support at{' '}
                <a href="mailto:support@phyo.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  support@phyo.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
