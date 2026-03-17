'use client';

import React from 'react';
import { colors } from '@/config/colors';

/**
 * Typography Components - Part of Ember Design System
 *
 * Standardized text components for consistent typography across the application
 */

/**
 * Heading - Semantic heading elements (h1-h6)
 */
export const Heading = React.forwardRef(({
  level = 1,
  size = 'lg',
  weight = 'bold',
  color = 'text-base',
  className = '',
  children,
  ...props
}, ref) => {
  const sizeConfig = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };

  const weightConfig = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const colorMap = {
    'text-base': colors.text.neutral.base,
    'text-muted': colors.text.neutral.muted,
    'brand': colors.brand.text,
    'error': colors.semantic.error.bold,
    'white': colors.ui.white,
    'inverse': colors.neutral.inverse.muted
  };

  const Component = `h${level}`;

  return (
    <Component
      ref={ref}
      className={`${sizeConfig[size]} ${weightConfig[weight]} ${className}`}
      style={{ color: colorMap[color] || color }}
      {...props}
    >
      {children}
    </Component>
  );
});

Heading.displayName = 'Heading';

/**
 * Paragraph - Standard body text
 */
export const Paragraph = React.forwardRef(({
  size = 'base',
  weight = 'normal',
  color = 'text-base',
  className = '',
  children,
  ...props
}, ref) => {
  const sizeConfig = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const weightConfig = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorMap = {
    'text-base': colors.text.neutral.base,
    'text-muted': colors.text.neutral.muted,
    'brand': colors.brand.text,
    'error': colors.semantic.error.bold,
    'white': colors.ui.white
  };

  return (
    <p
      ref={ref}
      className={`${sizeConfig[size]} ${weightConfig[weight]} leading-relaxed ${className}`}
      style={{ color: colorMap[color] || color }}
      {...props}
    >
      {children}
    </p>
  );
});

Paragraph.displayName = 'Paragraph';

/**
 * Caption - Small supporting text
 */
export const Caption = React.forwardRef(({
  size = 'xs',
  weight = 'normal',
  color = 'text-muted',
  className = '',
  children,
  ...props
}, ref) => {
  const sizeConfig = {
    xs: 'text-xs',
    sm: 'text-sm'
  };

  const colorMap = {
    'text-base': colors.text.neutral.base,
    'text-muted': colors.text.neutral.muted,
    'brand': colors.brand.text,
    'error': colors.semantic.error.bold
  };

  return (
    <span
      ref={ref}
      className={`${sizeConfig[size]} font-${weight} ${className}`}
      style={{ color: colorMap[color] || color }}
      {...props}
    >
      {children}
    </span>
  );
});

Caption.displayName = 'Caption';

/**
 * Label - Form labels and field labels
 */
export const Label = React.forwardRef(({
  size = 'sm',
  weight = 'semibold',
  required = false,
  disabled = false,
  color = 'text-base',
  className = '',
  children,
  ...props
}, ref) => {
  const sizeConfig = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base'
  };

  const colorMap = {
    'text-base': colors.text.neutral.base,
    'text-muted': colors.text.neutral.muted,
    'brand': colors.brand.text,
    'error': colors.semantic.error.bold
  };

  return (
    <label
      ref={ref}
      className={`${sizeConfig[size]} font-${weight} block ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{ color: colorMap[color] || color }}
      {...props}
    >
      {children}
      {required && <span style={{ color: colors.semantic.error.bold }}>*</span>}
    </label>
  );
});

Label.displayName = 'Label';

/**
 * Quote - Emphasized quoted text
 */
export const Quote = React.forwardRef(({
  size = 'base',
  color = 'text-base',
  className = '',
  children,
  ...props
}, ref) => {
  const sizeConfig = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };

  const colorMap = {
    'text-base': colors.text.neutral.base,
    'text-muted': colors.text.neutral.muted,
    'brand': colors.brand.text
  };

  return (
    <blockquote
      ref={ref}
      className={`${sizeConfig[size]} italic pl-4 border-l-4 ${className}`}
      style={{
        color: colorMap[color] || color,
        borderColor: colors.brand.base
      }}
      {...props}
    >
      {children}
    </blockquote>
  );
});

Quote.displayName = 'Quote';

/**
 * Typography Preset Sizes for consistent scaling
 */
export const typographyPresets = {
  'display-lg': { size: '4xl', weight: 'bold', lineHeight: 'leading-tight' },
  'display-md': { size: '3xl', weight: 'bold', lineHeight: 'leading-tight' },
  'display-sm': { size: '2xl', weight: 'bold', lineHeight: 'leading-tight' },
  'heading-lg': { size: 'xl', weight: 'bold', lineHeight: 'leading-snug' },
  'heading-md': { size: 'lg', weight: 'semibold', lineHeight: 'leading-snug' },
  'heading-sm': { size: 'base', weight: 'semibold', lineHeight: 'leading-snug' },
  'body-lg': { size: 'lg', weight: 'normal', lineHeight: 'leading-relaxed' },
  'body-md': { size: 'base', weight: 'normal', lineHeight: 'leading-relaxed' },
  'body-sm': { size: 'sm', weight: 'normal', lineHeight: 'leading-relaxed' },
  'caption-lg': { size: 'sm', weight: 'normal', lineHeight: 'leading-relaxed' },
  'caption-sm': { size: 'xs', weight: 'normal', lineHeight: 'leading-relaxed' }
};

export default {
  Heading,
  Paragraph,
  Caption,
  Label,
  Quote,
  typographyPresets
};
