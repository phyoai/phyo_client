'use client';

import React from 'react';

/**
 * Container Component - Responsive content wrapper
 * Max widths: sm, md, lg, xl, 2xl, full
 */

const Container = React.forwardRef(({
  children,
  size = 'lg',
  padding = true,
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full'
  };

  return (
    <div
      ref={ref}
      className={`
        w-full
        mx-auto
        ${sizeConfig[size]}
        ${padding ? 'px-4 md:px-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;
