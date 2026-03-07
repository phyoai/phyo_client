'use client';

import React from 'react';
import { colors } from '@/config/colors';

/**
 * IconButton Component - Part of Ember Design System
 *
 * Used for icon-only buttons (back, menu, close, etc.)
 * Sizes: sm, md, lg
 * Variants: default, filled, outlined
 */

const IconButton = React.forwardRef(({
  icon: Icon,
  size = 'md',
  variant = 'default',
  disabled = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  // Size configuration
  const sizeConfig = {
    sm: {
      size: 'w-8 h-8',
      iconSize: 16
    },
    md: {
      size: 'w-10 h-10',
      iconSize: 20
    },
    lg: {
      size: 'w-12 h-12',
      iconSize: 24
    }
  };

  // Variant configuration
  const variantConfig = {
    default: 'hover:bg-neutral-muted/20 text-text-base',
    filled: `bg-brand-base hover:opacity-90 text-ui-white`,
    outlined: `border border-neutral-muted hover:bg-neutral-muted/10 text-text-base`
  };

  const size_config = sizeConfig[size];

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${size_config.size}
    ${disabled ? 'opacity-50 cursor-not-allowed' : variantConfig[variant]}
    ${className}
  `;

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {Icon && <Icon width={size_config.iconSize} height={size_config.iconSize} />}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
