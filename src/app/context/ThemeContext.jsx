'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Enhanced Theme Context
 * Manages application-wide theme with system preference detection
 *
 * Usage:
 * const { theme, toggleTheme, setTheme } = useTheme();
 */

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');
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
    const initialTheme = stored || (isDark ? 'dark' : 'light');

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

  const applyTheme = (newTheme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }

    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleDarkMode = () => {
    toggleTheme();
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        // New API
        theme,
        toggleTheme,
        setTheme,
        systemTheme,
        // Backward compatibility
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
