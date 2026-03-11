'use client';

import React from 'react';

/**
 * Switch Component - Toggle component for on/off states
 * Sizes: sm, md, lg
 * States: off, on, disabled
 */

const Switch = React.forwardRef(({
  checked = false,
  disabled = false,
  onChange,
  label,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    sm: {
      container: 'w-10 h-6',
      toggle: 'w-5 h-5',
      translate: 'translate-x-4'
    },
    md: {
      container: 'w-12 h-7',
      toggle: 'w-6 h-6',
      translate: 'translate-x-5'
    },
    lg: {
      container: 'w-14 h-8',
      toggle: 'w-7 h-7',
      translate: 'translate-x-6'
    }
  };

  const config = sizeConfig[size];

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div className={`
        ${config.container}
        rounded-full
        transition-all
        flex items-center
        ${checked ? 'bg-brand-base' : 'bg-neutral-muted'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <div className={`
          ${config.toggle}
          rounded-full
          bg-white
          transition-transform
          ${checked ? config.translate : 'translate-x-1'}
        `} />
      </div>
      {label && (
        <span className="text-text-base select-none font-medium">
          {label}
        </span>
      )}
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="hidden"
        {...props}
      />
    </label>
  );
});

Switch.displayName = 'Switch';

export default Switch;
