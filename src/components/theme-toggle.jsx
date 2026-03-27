'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

/**
 * Theme Toggle Component
 * Provides UI for switching between light and dark modes
 *
 * Usage:
 * <ThemeToggle />
 * <ThemeToggle variant="icon" />
 * <ThemeToggle variant="button" label="Toggle Dark Mode" />
 */

export function ThemeToggle({
  variant = 'icon',
  label = 'Toggle dark mode',
  className = '',
}) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        aria-label={label}
        title={label}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${className}`}
        aria-label={label}
      >
        {theme === 'light' ? (
          <>
            <Moon className="w-4 h-4" />
            <span>Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            <span>Light Mode</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="sr-only"
            aria-label={label}
          />
          <div className="w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner transition-colors"></div>
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              theme === 'dark' ? 'translate-x-4' : ''
            }`}
          ></div>
        </div>
      </label>
    );
  }

  return null;
}

export default ThemeToggle;
