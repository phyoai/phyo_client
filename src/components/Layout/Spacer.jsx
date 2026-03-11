'use client';

import React from 'react';

/**
 * Spacer Component - Consistent spacing between elements
 * Uses design system spacing scale
 */

const Spacer = React.forwardRef(({
  size = 'md',
  direction = 'vertical',
  className = '',
  ...props
}, ref) => {
  const sizeMap = {
    xs: 'h-1 w-1',
    sm: 'h-2 w-2',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
    '2xl': 'h-10 w-10'
  };

  const directionClass = direction === 'horizontal' ? 'w-full' : 'h-full';

  return (
    <div
      ref={ref}
      className={`${sizeMap[size]} ${className}`}
      {...props}
    />
  );
});

Spacer.displayName = 'Spacer';

export default Spacer;
