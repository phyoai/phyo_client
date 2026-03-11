'use client';

import React from 'react';

/**
 * Stack Component - Flexible layout for organizing content
 * Directions: horizontal (row), vertical (column)
 * Spacing: xs, sm, md, lg, xl
 * Alignment: start, center, end, stretch
 */

const Stack = React.forwardRef(({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'start',
  justify = 'start',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';

  const spacingMap = {
    xs: direction === 'horizontal' ? 'gap-1' : 'gap-1',
    sm: direction === 'horizontal' ? 'gap-2' : 'gap-2',
    md: direction === 'horizontal' ? 'gap-4' : 'gap-4',
    lg: direction === 'horizontal' ? 'gap-6' : 'gap-6',
    xl: direction === 'horizontal' ? 'gap-8' : 'gap-8'
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div
      ref={ref}
      className={`
        flex
        ${directionClass}
        ${spacingMap[spacing]}
        ${alignMap[align]}
        ${justifyMap[justify]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';

export default Stack;
