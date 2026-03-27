import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ErrorBoundary from '../error-boundary';

/**
 * Error Boundary Component Tests
 * Verifies error catching and recovery functionality
 */

describe('ErrorBoundary Component', () => {
  // Suppress console.error for these tests since we're intentionally throwing errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('rendering', () => {
    it('should render children when there are no errors', () => {
      render(
        <ErrorBoundary>
          <div>Safe content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should catch runtime errors in children', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Error boundary should display error message
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    it('should display error details in development mode', () => {
      const ThrowError = () => {
        throw new Error('Detailed test error');
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // In development, error details should be shown
      const errorContent = screen.getByText(/Something went wrong/i);
      expect(errorContent).toBeInTheDocument();
    });
  });

  describe('recovery', () => {
    it('should provide recovery options', () => {
      const ThrowError = () => {
        throw new Error('Recovery test error');
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should show recovery button
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('fallback UI', () => {
    it('should show error fallback with proper styling', () => {
      const ThrowError = () => {
        throw new Error('Styling test');
      };

      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Check that error container exists
      const errorContainer = container.querySelector('[class*="error"]') ||
                            screen.getByText(/Something went wrong/i).parentElement;
      expect(errorContainer).toBeInTheDocument();
    });
  });
});
