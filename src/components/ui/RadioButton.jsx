'use client';

import React from 'react';

/**
 * RadioButton Component - Allows user to select one item from a group
 * Sizes: sm, md, lg
 * States: unchecked, checked, disabled
 */

const RadioButton = React.forwardRef(({
  checked = false,
  disabled = false,
  label,
  size = 'md',
  onChange,
  name,
  value,
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    sm: {
      outer: 'w-4 h-4',
      inner: 'w-2 h-2',
      label: 'text-sm'
    },
    md: {
      outer: 'w-5 h-5',
      inner: 'w-2.5 h-2.5',
      label: 'text-base'
    },
    lg: {
      outer: 'w-6 h-6',
      inner: 'w-3 h-3',
      label: 'text-lg'
    }
  };

  const config = sizeConfig[size];

  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        ref={ref}
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        name={name}
        value={value}
        className="hidden"
        {...props}
      />
      <div className={`
        ${config.outer}
        rounded-full
        border-2
        transition-all
        flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${checked
          ? 'border-brand-base bg-brand-base'
          : 'border-neutral-muted bg-white hover:border-brand-base'
        }
      `}>
        {checked && (
          <div className={`${config.inner} rounded-full bg-white`} />
        )}
      </div>
      {label && (
        <span className={`${config.label} text-text-base select-none`}>
          {label}
        </span>
      )}
    </label>
  );
});

RadioButton.displayName = 'RadioButton';

/**
 * RadioButton.Group - Container for radio buttons
 */
RadioButton.Group = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

RadioButton.Group.displayName = 'RadioButton.Group';

export default RadioButton;
