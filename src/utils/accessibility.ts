/**
 * Accessibility Utilities
 * Implements WCAG 2.1 Level AA compliance helpers
 *
 * Usage:
 * import { a11y, skipToMain, announceToScreenReader } from '@/utils/accessibility';
 */

/**
 * Announce messages to screen readers
 * Uses ARIA live regions for dynamic content updates
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof window === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Screen reader only class
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Skip to main content functionality
 * Allows keyboard users to skip navigation
 */
export const createSkipToMainLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className =
    'absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 -translate-y-12 focus:translate-y-0 transition-transform z-50';
  skipLink.textContent = 'Skip to main content';

  return skipLink;
};

/**
 * Get focus trap for modal dialogs
 */
export const createFocusTrap = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return null;

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return {
    activate: () => {
      element.addEventListener('keydown', handleKeyDown);
      firstElement.focus();
    },
    deactivate: () => {
      element.removeEventListener('keydown', handleKeyDown);
    },
  };
};

/**
 * Color contrast checker
 * Ensures WCAG AA compliance (4.5:1 for normal text)
 */
export const checkContrast = (foreground: string, background: string): boolean => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0;

    const [r, g, b] = rgb.map(x => {
      const val = parseInt(x) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return contrast >= 4.5; // WCAG AA standard
};

/**
 * Keyboard navigation helper
 * Manages focus and keyboard interactions
 */
export class KeyboardNavigationManager {
  private focusableSelectors = [
    'button',
    '[href]',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  constructor(private containerElement: HTMLElement) {}

  /**
   * Get all focusable elements in the container
   */
  getFocusableElements(): HTMLElement[] {
    return Array.from(this.containerElement.querySelectorAll(this.focusableSelectors)) as HTMLElement[];
  }

  /**
   * Focus the first element
   */
  focusFirst(): void {
    const elements = this.getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }

  /**
   * Focus the next element
   */
  focusNext(): void {
    const elements = this.getFocusableElements();
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement);

    if (currentIndex >= 0 && currentIndex < elements.length - 1) {
      elements[currentIndex + 1].focus();
    }
  }

  /**
   * Focus the previous element
   */
  focusPrevious(): void {
    const elements = this.getFocusableElements();
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement);

    if (currentIndex > 0) {
      elements[currentIndex - 1].focus();
    }
  }
}

/**
 * Accessibility helper object
 */
export const a11y = {
  /**
   * Create an aria-label for screen readers
   */
  createLabel: (text: string, id?: string) => ({
    'aria-label': text,
    ...(id && { id }),
  }),

  /**
   * Create aria-describedby reference
   */
  createDescription: (text: string, id: string) => ({
    'aria-describedby': id,
  }),

  /**
   * Create aria-labelledby reference
   */
  createLabelledBy: (id: string) => ({
    'aria-labelledby': id,
  }),

  /**
   * Mark element as required
   */
  required: {
    'aria-required': true,
  },

  /**
   * Mark element as invalid
   */
  invalid: (message: string) => ({
    'aria-invalid': true,
    'aria-errormessage': message,
  }),

  /**
   * Mark element as disabled
   */
  disabled: {
    'aria-disabled': true,
  },

  /**
   * Create a button with proper ARIA
   */
  button: (text: string, ariaLabel?: string) => ({
    type: 'button',
    'aria-label': ariaLabel || text,
  }),

  /**
   * Create a link with proper ARIA
   */
  link: (text: string, ariaLabel?: string) => ({
    role: 'link',
    'aria-label': ariaLabel || text,
  }),

  /**
   * Create a list item
   */
  listItem: {
    role: 'listitem',
  },

  /**
   * Create a navigation region
   */
  nav: (label: string) => ({
    role: 'navigation',
    'aria-label': label,
  }),

  /**
   * Create a main content region
   */
  main: {
    role: 'main',
    id: 'main-content',
  },

  /**
   * Create a complementary region (sidebar)
   */
  aside: (label: string) => ({
    role: 'complementary',
    'aria-label': label,
  }),

  /**
   * Mark content as loading
   */
  loading: {
    'aria-busy': true,
    'aria-live': 'polite',
  },

  /**
   * Mark content as hidden
   */
  hidden: {
    'aria-hidden': true,
  },
};

/**
 * Screen reader only styles
 * Apply to elements that should only be visible to screen readers
 */
export const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const;

/**
 * Focus visible styles for keyboard navigation
 */
export const focusVisibleStyles = {
  outline: '2px solid #2563eb',
  outlineOffset: '2px',
} as const;

/**
 * Reduce motion preferences
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Dark mode preferences
 */
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * High contrast preferences
 */
export const prefersHighContrast = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-contrast: more)').matches;
};

/**
 * Validate form accessibility
 */
export const validateFormAccessibility = (formElement: HTMLFormElement) => {
  const issues: string[] = [];

  // Check for form labels
  const inputs = formElement.querySelectorAll('input, textarea, select');

  inputs.forEach((input) => {
    const label = formElement.querySelector(`label[for="${input.id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');

    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push(`Input with id "${input.id}" has no associated label`);
    }
  });

  // Check for form error messages
  const errorElements = formElement.querySelectorAll('[role="alert"]');

  if (errorElements.length === 0) {
    issues.push('Form has no error message region (role="alert")');
  }

  return {
    isAccessible: issues.length === 0,
    issues,
  };
};

/**
 * Accessible toast/notification
 */
export const showAccessibleNotification = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) => {
  const ariaLevel = type === 'error' ? 'assertive' : 'polite';

  announceToScreenReader(
    `${type.toUpperCase()}: ${message}`,
    ariaLevel as 'polite' | 'assertive'
  );
};
