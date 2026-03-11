// Design System Color Tokens using CSS Variables
// These automatically switch between light and dark mode
export const colors = {
  // Semantic Colors
  semantic: {
    error: {
      bold: 'var(--color-semantic-error)',
    },
  },

  // Brand Colors
  brand: {
    icon: 'var(--color-brand-icon)',
    text: 'var(--color-brand-text)',
    base: 'var(--color-brand-base)',
  },

  // Neutral Colors
  neutral: {
    inverse: {
      muted: 'var(--color-neutral-inverse-muted)',
      icon: 'var(--color-neutral-inverse-icon)',
    },
    muted: 'var(--color-neutral-muted)',
    base: 'var(--color-neutral-base)',
    base1: 'var(--color-neutral-base1)',
  },

  // Accent Colors
  accent: {
    base: 'var(--color-accent-base)',
    subtle: 'var(--color-accent-subtle)',
  },

  // Additional Colors
  text: {
    brand: 'var(--color-brand-text)',
    neutral: {
      base: 'var(--color-text-base)',
      muted: 'var(--color-text-muted)',
    },
  },

  // Surface Colors
  surface: {
    error: 'var(--color-surface-error)',
    accent: 'var(--color-accent-base)',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },

  // UI Colors
  ui: {
    white: '#FFFFFF',
    black: '#000000',
    disabled: 'opacity-50',
  },
};

export default colors;
