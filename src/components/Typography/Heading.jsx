'use client';

import React from 'react';

/**
 * Heading Component - Semantic heading levels with consistent sizing
 * Levels: h1, h2, h3, h4, h5, h6
 * All with responsive sizing
 */

const Heading = React.forwardRef(({
  children,
  level = 'h2',
  className = '',
  ...props
}, ref) => {
  const headingConfig = {
    h1: {
      size: 'text-4xl md:text-5xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight'
    },
    h2: {
      size: 'text-3xl md:text-4xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight'
    },
    h3: {
      size: 'text-2xl md:text-3xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight'
    },
    h4: {
      size: 'text-xl md:text-2xl',
      weight: 'font-semibold',
      lineHeight: 'leading-snug'
    },
    h5: {
      size: 'text-lg md:text-xl',
      weight: 'font-semibold',
      lineHeight: 'leading-snug'
    },
    h6: {
      size: 'text-base md:text-lg',
      weight: 'font-semibold',
      lineHeight: 'leading-snug'
    }
  };

  const config = headingConfig[level];
  const Component = level;

  return (
    <Component
      ref={ref}
      className={`
        text-text-base
        ${config.size}
        ${config.weight}
        ${config.lineHeight}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
});

Heading.displayName = 'Heading';

export default Heading;
