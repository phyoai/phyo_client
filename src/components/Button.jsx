'use client';

import React from 'react';
import { colors } from '@/config/colors';

/**
 * Button Component - Part of Ember Design System
 *
 * Variants: primary, secondary, tertiary, outlined
 * Sizes: sm, md, lg
 * States: default, hover, active, disabled, loading
 */

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  // Size configuration
  const sizeConfig = {
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-xs font-medium',
      height: 'h-8',
      iconSize: 16,
      gap: 'gap-1'
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-sm font-semibold',
      height: 'h-10',
      iconSize: 18,
      gap: 'gap-2'
    },
    lg: {
      padding: 'px-6 py-3',
      text: 'text-base font-semibold',
      height: 'h-12',
      iconSize: 20,
      gap: 'gap-2'
    }
  };

  // Variant configuration
  const variantConfig = {
    primary: {
      base: `bg-brand-base hover:opacity-90 text-ui-white`,
      disabled: 'bg-brand-base/50 text-ui-white/50 cursor-not-allowed'
    },
    secondary: {
      base: `bg-neutral-muted hover:opacity-80 text-text-base`,
      disabled: 'bg-neutral-muted/50 text-text-base/50 cursor-not-allowed'
    },
    tertiary: {
      base: `bg-accent-base hover:bg-accent-subtle text-brand-text`,
      disabled: 'bg-accent-base/50 text-brand-text/50 cursor-not-allowed'
    },
    outlined: {
      base: `border-2 border-neutral-muted text-text-base hover:bg-neutral-muted/10`,
      disabled: 'border-neutral-muted/50 text-text-base/50 cursor-not-allowed'
    }
  };

  const size_config = sizeConfig[size];
  const variant_config = variantConfig[variant];

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${size_config.padding}
    ${size_config.text}
    ${size_config.gap}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? variant_config.disabled : variant_config.base}
    ${className}
  `;

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon width={size_config.iconSize} height={size_config.iconSize} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon width={size_config.iconSize} height={size_config.iconSize} />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
