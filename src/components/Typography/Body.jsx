'use client';

import React from 'react';

/**
 * Body Component - Body text with consistent sizing
 * Sizes: lg, md, sm, xs
 */

const Body = React.forwardRef(({
  children,
  size = 'md',
  weight = 'normal',
  color = 'text-base',
  muted = false,
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    lg: 'text-lg leading-relaxed',
    md: 'text-base leading-relaxed',
    sm: 'text-sm leading-normal',
    xs: 'text-xs leading-normal'
  };

  const weightConfig = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <p
      ref={ref}
      className={`
        ${sizeConfig[size]}
        ${weightConfig[weight]}
        ${muted ? 'text-text-muted' : `text-${color}`}
        ${className}
      `}
      {...props}
    >
      {children}
    </p>
  );
});

Body.displayName = 'Body';

export default Body;
