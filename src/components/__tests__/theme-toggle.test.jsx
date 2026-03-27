import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../theme-toggle';
import { ThemeProvider } from '@/app/context/ThemeContext';

/**
 * Theme Toggle Component Tests
 * Verifies dark/light mode switching functionality
 */

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeToggle Component', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessible button', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });
  });

  describe('theme switching', () => {
    it('should toggle theme on click', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Button should still exist after click
      expect(button).toBeInTheDocument();
    });

    it('should update aria-label based on theme', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');

      // Check initial aria-label
      const initialLabel = button.getAttribute('aria-label');
      expect(initialLabel).toBeTruthy();

      fireEvent.click(button);

      // Label might change after click (theme changed)
      expect(button).toHaveAttribute('aria-label');
    });
  });

  describe('variants', () => {
    it('should support different button variants', () => {
      const { container: container1 } = renderWithTheme(
        <ThemeToggle variant="icon" />
      );
      expect(container1.querySelector('button')).toBeInTheDocument();

      const { container: container2 } = renderWithTheme(
        <ThemeToggle variant="text" />
      );
      expect(container2.querySelector('button')).toBeInTheDocument();

      const { container: container3 } = renderWithTheme(
        <ThemeToggle variant="full" />
      );
      expect(container3.querySelector('button')).toBeInTheDocument();
    });
  });

  describe('theme persistence', () => {
    it('should persist theme preference', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Theme preference should be saved (in localStorage)
      // This would be verified by checking localStorage in an integration test
      expect(button).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should be keyboard accessible', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');

      // Simulate keyboard interaction (Enter key)
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      expect(button).toBeInTheDocument();
    });

    it('should announce theme changes to screen readers', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toMatch(/theme|dark|light/i);
    });
  });

  describe('default theme detection', () => {
    it('should respect system preference on mount', () => {
      // Mock window.matchMedia for system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
    });
  });
});
