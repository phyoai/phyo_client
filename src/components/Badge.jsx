'use client';

import React from 'react';

/**
 * Badge Component - Displays small count or status indicators
 * Variants: default, success, warning, error, info, red, green, yellow, blue, purple
 * Sizes: sm, md, lg
 */

const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const variantConfig = {
    default: 'bg-accent-base text-brand-text',
    success: 'bg-green-light text-green-base',
    warning: 'bg-yellow-light text-yellow-base',
    error: 'bg-red-light text-red-base',
    info: 'bg-blue-light text-blue-base',
    red: 'bg-red-light text-red-base',
    green: 'bg-green-light text-green-base',
    yellow: 'bg-yellow-light text-yellow-base',
    blue: 'bg-blue-light text-blue-base',
    purple: 'bg-purple-light text-purple-base'
  };

  const sizeConfig = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-semibold'
  };

  return (
    <span
      ref={ref}
      className={`inline-flex items-center justify-center rounded-full ${variantConfig[variant]} ${sizeConfig[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
