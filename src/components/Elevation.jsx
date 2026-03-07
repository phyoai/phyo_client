'use client';

/**
 * Elevation System - Part of Ember Design System
 *
 * Standardized shadow levels for depth and layering
 */

export const elevationPresets = {
  // No elevation
  'none': {
    shadow: 'none',
    tailwind: '',
    css: 'none'
  },

  // Level 1 - Subtle, used for hover states
  'sm': {
    shadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    tailwind: 'shadow-sm',
    css: '0 1px 2px rgba(0, 0, 0, 0.05)'
  },

  // Level 2 - Default for cards and containers
  'base': {
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    tailwind: 'shadow',
    css: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
  },

  // Level 3 - Medium elevation
  'md': {
    shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    tailwind: 'shadow-md',
    css: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
  },

  // Level 4 - Large elevation
  'lg': {
    shadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    tailwind: 'shadow-lg',
    css: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
  },

  // Level 5 - Extra large elevation, modals
  'xl': {
    shadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    tailwind: 'shadow-xl',
    css: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)'
  },

  // Level 6 - Maximum elevation
  '2xl': {
    shadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    tailwind: 'shadow-2xl',
    css: '0 25px 50px rgba(0, 0, 0, 0.15)'
  },

  // Focus state - soft glow
  'focus': {
    shadow: '0 0 0 3px rgba(67, 87, 59, 0.1)',
    tailwind: 'ring ring-brand-base ring-opacity-10',
    css: '0 0 0 3px rgba(67, 87, 59, 0.1)'
  }
};

/**
 * Component-specific elevation presets
 */
export const componentElevation = {
  'button': {
    default: 'none',
    hover: 'sm',
    active: 'none'
  },
  'card': {
    default: 'base',
    hover: 'md',
    elevated: 'lg'
  },
  'modal': {
    overlay: 'none',
    content: 'xl'
  },
  'dropdown': {
    default: 'lg'
  },
  'floating-action': {
    default: 'lg',
    hover: 'xl'
  },
  'tooltip': {
    default: 'md'
  },
  'navbar': {
    default: 'base'
  },
  'sidebar': {
    default: 'none'
  }
};

/**
 * Hover elevation changes
 */
export const hoverElevation = {
  'none': 'sm',
  'sm': 'base',
  'base': 'md',
  'md': 'lg',
  'lg': 'xl',
  'xl': '2xl',
  '2xl': '2xl' // Max, no change
};

/**
 * Active state elevation (pressed)
 */
export const activeElevation = {
  'none': 'none',
  'sm': 'none',
  'base': 'sm',
  'md': 'base',
  'lg': 'md',
  'xl': 'lg',
  '2xl': 'xl'
};

/**
 * Shadow utility function
 */
export function getElevation(level = 'base', state = 'default') {
  const elevation = elevationPresets[level];

  if (!elevation) {
    console.warn(`Elevation level "${level}" not found, defaulting to "base"`);
    return elevationPresets['base'];
  }

  return elevation;
}

/**
 * Get component-specific elevation
 */
export function getComponentElevation(component, state = 'default') {
  const comp = componentElevation[component];
  if (!comp) {
    console.warn(`Component "${component}" elevation not found`);
    return elevationPresets['base'];
  }

  const level = comp[state] || comp.default;
  return elevationPresets[level];
}

export const elevation = {
  presets: elevationPresets,
  component: componentElevation,
  getElevation,
  getComponentElevation,
  hoverElevation,
  activeElevation
};

export default elevation;
