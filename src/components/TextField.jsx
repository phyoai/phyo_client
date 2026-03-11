'use client';

import React from 'react';

/**
 * TextField Component - Text input field with various states and variants
 * Variants: default, filled
 * Sizes: sm, md, lg
 * States: default, error, success, disabled
 */

const TextField = React.forwardRef(({
  label,
  placeholder,
  value,
  type = 'text',
  size = 'md',
  variant = 'default',
  error = false,
  errorMessage,
  success = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onChange,
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    sm: {
      input: 'px-3 py-1.5 text-sm',
      label: 'text-sm',
      gap: 'gap-2'
    },
    md: {
      input: 'px-4 py-2 text-base',
      label: 'text-base',
      gap: 'gap-2'
    },
    lg: {
      input: 'px-4 py-3 text-lg',
      label: 'text-lg',
      gap: 'gap-3'
    }
  };

  const config = sizeConfig[size];

  const inputClasses = `
    w-full
    rounded-lg
    border
    transition-all
    font-medium
    placeholder:text-text-muted
    focus:outline-none
    ${config.input}
    ${disabled ? 'bg-neutral-muted cursor-not-allowed opacity-60' : 'bg-white'}
    ${error ? 'border-red-base focus:ring-2 focus:ring-red-base/20' : ''}
    ${success ? 'border-green-base focus:ring-2 focus:ring-green-base/20' : ''}
    ${!error && !success ? 'border-neutral-muted focus:ring-2 focus:ring-brand-base/20 focus:border-brand-base' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className={`block mb-2 font-medium text-text-base ${config.label}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={inputClasses}
          {...props}
        />
        {Icon && (
          <div className={`absolute top-1/2 -translate-y-1/2 ${iconPosition === 'left' ? 'left-4' : 'right-4'} text-text-muted pointer-events-none`}>
            <Icon width={20} height={20} />
          </div>
        )}
      </div>
      {error && errorMessage && (
        <p className="text-xs text-red-base mt-2">
          {errorMessage}
        </p>
      )}
      {success && (
        <p className="text-xs text-green-base mt-2">
          ✓ Valid
        </p>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';

export default TextField;
