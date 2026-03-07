'use client';

/**
 * Spacing System - Part of Ember Design System
 *
 * Standardized spacing utilities for consistent margins, padding, and gaps
 * Based on 4px base unit (4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48...)
 */

export const spacingScale = {
  // Base 4px unit
  'xs': '4px',    // 0.25rem
  'sm': '8px',    // 0.5rem
  'md': '12px',   // 0.75rem
  'base': '16px', // 1rem
  'lg': '20px',   // 1.25rem
  'xl': '24px',   // 1.5rem
  '2xl': '28px',  // 1.75rem
  '3xl': '32px',  // 2rem
  '4xl': '36px',  // 2.25rem
  '5xl': '40px',  // 2.5rem
  '6xl': '44px',  // 2.75rem
  '7xl': '48px',  // 3rem
  '8xl': '56px',  // 3.5rem
  '9xl': '64px',  // 4rem
  '10xl': '80px', // 5rem
};

/**
 * Padding presets
 */
export const paddingPresets = {
  'none': '0',
  'tight': '8px',        // sm
  'normal': '16px',      // base
  'loose': '24px',       // xl
  'extra-loose': '32px', // 3xl

  // Component-specific
  'button-sm': '8px 12px',    // py-xs px-md
  'button-md': '12px 16px',   // py-md px-base
  'button-lg': '16px 24px',   // py-base px-xl
  'card': '24px',             // xl
  'section': '32px',          // 3xl
  'page': '40px',             // 5xl
};

/**
 * Margin presets
 */
export const marginPresets = {
  'none': '0',
  'tight': '8px',        // sm
  'normal': '16px',      // base
  'loose': '24px',       // xl
  'extra-loose': '32px', // 3xl

  // Component-specific
  'heading-bottom': '16px',     // space below headings
  'section-margin': '32px',     // space between sections
  'element-margin': '12px',     // space between elements
};

/**
 * Gap presets (for flexbox/grid)
 */
export const gapPresets = {
  'tight': '4px',   // xs
  'sm': '8px',      // sm
  'md': '12px',     // md
  'base': '16px',   // base
  'lg': '20px',     // lg
  'xl': '24px',     // xl
  '2xl': '32px',    // 3xl

  // Component-specific
  'button-group': '8px',
  'form-fields': '16px',
  'section': '32px',
  'grid-tight': '8px',
  'grid-normal': '16px',
  'grid-loose': '24px',
};

/**
 * Line height presets
 */
export const lineHeightPresets = {
  'tight': '1.2',      // 120%
  'snug': '1.375',     // 137.5% (for headings)
  'normal': '1.5',     // 150% (default, for body text)
  'relaxed': '1.625',  // 162.5%
  'loose': '1.75',     // 175%
  'extra-loose': '2',  // 200%
};

/**
 * Border radius presets
 */
export const borderRadiusPresets = {
  'none': '0px',
  'xs': '2px',
  'sm': '4px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
  'full': '9999px',

  // Component-specific
  'button': '8px',
  'button-pill': '9999px',
  'card': '12px',
  'input': '8px',
  'avatar': '9999px',
  'badge': '16px',
};

/**
 * Spacing tokens for Tailwind integration
 */
export const tailwindSpacingConfig = {
  // Maps to Tailwind's spacing scale
  '0': '0px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '7': '28px',
  '8': '32px',
  '9': '36px',
  '10': '40px',
  '11': '44px',
  '12': '48px',
  '14': '56px',
  '16': '64px',
  '20': '80px',
};

/**
 * Spacing utilities object
 */
export const spacing = {
  scale: spacingScale,
  padding: paddingPresets,
  margin: marginPresets,
  gap: gapPresets,
  lineHeight: lineHeightPresets,
  borderRadius: borderRadiusPresets,
};

/**
 * Helper function to get spacing value
 */
export function getSpacing(key, preset = 'scale') {
  const presets = {
    scale: spacingScale,
    padding: paddingPresets,
    margin: marginPresets,
    gap: gapPresets,
    lineHeight: lineHeightPresets,
    borderRadius: borderRadiusPresets,
  };

  return presets[preset]?.[key] || key;
}

export default spacing;
