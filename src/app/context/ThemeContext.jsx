'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Enhanced Theme Context with Memoization
 * Manages application-wide theme with system preference detection
 * Uses memoization to prevent unnecessary re-renders
 *
 * Usage:
 * const { theme, toggleTheme, setTheme } = useTheme();
 */

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');
  const [systemTheme, setSystemTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // For backward compatibility
  const darkMode = theme === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect system theme preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemTheme(isDark ? 'dark' : 'light');

    // Get stored preference or use system preference
    const stored = localStorage.getItem('theme');
    const initialTheme = stored || 'dark';

    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);

      // Only auto-apply if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setThemeState(newSystemTheme);
        applyTheme(newSystemTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    setMounted(true);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Memoized applyTheme function
  const applyTheme = useCallback((newTheme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  }, []);

  // Memoized toggleTheme function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  // Memoized toggleDarkMode function (backward compatibility)
  const toggleDarkMode = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // Memoized setTheme function
  const setTheme = useCallback((newTheme) => {
    if (!['light', 'dark'].includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}. Using 'dark' as default.`);
      newTheme = 'dark';
    }
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme,
    systemTheme,
    darkMode: theme === 'dark',
    toggleDarkMode,
  }), [theme, toggleTheme, setTheme, systemTheme, toggleDarkMode]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
