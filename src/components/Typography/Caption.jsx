'use client';

import React from 'react';

/**
 * Caption Component - Small caption and helper text
 */

const Caption = React.forwardRef(({
  children,
  muted = true,
  className = '',
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={`
        text-xs
        font-normal
        ${muted ? 'text-text-muted' : 'text-text-base'}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
});

Caption.displayName = 'Caption';

export default Caption;
