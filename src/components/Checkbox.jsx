'use client';

import React from 'react';
import { CheckLine } from '@phyoofficial/phyo-icon-library';

/**
 * Checkbox Component - Allows user to select one or more items
 * Variants: default, filled
 * States: unchecked, checked, indeterminate, disabled
 */

const Checkbox = React.forwardRef(({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  size = 'md',
  variant = 'default',
  onChange,
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    sm: {
      box: 'w-4 h-4',
      icon: 16,
      label: 'text-sm'
    },
    md: {
      box: 'w-5 h-5',
      icon: 18,
      label: 'text-base'
    },
    lg: {
      box: 'w-6 h-6',
      icon: 20,
      label: 'text-lg'
    }
  };

  const config = sizeConfig[size];

  const boxClasses = `
    ${config.box}
    rounded
    border-2
    transition-all
    flex items-center justify-center
    cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${checked || indeterminate
      ? 'bg-brand-base border-brand-base'
      : 'border-neutral-muted bg-white hover:border-brand-base'
    }
  `;

  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="hidden"
        {...props}
      />
      <div className={boxClasses}>
        {(checked || indeterminate) && (
          <CheckLine width={config.icon} height={config.icon} className="text-white" />
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
