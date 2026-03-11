'use client';

import React from 'react';

/**
 * Label Component - Form labels and captions
 * Sizes: lg, md, sm
 */

const Label = React.forwardRef(({
  children,
  size = 'md',
  required = false,
  muted = false,
  className = '',
  htmlFor,
  ...props
}, ref) => {
  const sizeConfig = {
    lg: 'text-base font-semibold',
    md: 'text-sm font-medium',
    sm: 'text-xs font-medium uppercase tracking-wider'
  };

  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`
        ${sizeConfig[size]}
        ${muted ? 'text-text-muted' : 'text-text-base'}
        block
        ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-red-base ml-1">*</span>}
    </label>
  );
});

Label.displayName = 'Label';

export default Label;
