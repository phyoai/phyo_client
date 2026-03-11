'use client';

import React from 'react';

/**
 * ProgressBar Component - Shows progress of a task
 * Variants: determinate, indeterminate
 * Sizes: sm, md, lg
 */

const ProgressBar = React.forwardRef(({
  value = 0,
  max = 100,
  variant = 'determinate',
  size = 'md',
  color = 'brand-base',
  showLabel = false,
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      ref={ref}
      className={`w-full bg-neutral-muted rounded-full overflow-hidden ${sizeConfig[size]} ${className}`}
      {...props}
    >
      <div
        className={`
          bg-${color}
          h-full
          rounded-full
          transition-all duration-300
          ${variant === 'indeterminate' ? 'animate-pulse' : ''}
        `}
        style={{
          width: `${percentage}%`
        }}
      />
      {showLabel && variant === 'determinate' && (
        <div className="text-xs font-semibold text-text-base mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

/**
 * ProgressBar.Steps - Stepper component
 */
ProgressBar.Steps = React.forwardRef(({
  steps = [],
  currentStep = 0,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between ${className}`}
      {...props}
    >
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10
              rounded-full
              flex items-center justify-center
              font-semibold
              transition-all
              ${index <= currentStep
                ? 'bg-brand-base text-white'
                : 'bg-neutral-muted text-text-muted'
              }
            `}>
              {index + 1}
            </div>
            <p className="text-sm font-medium text-text-base mt-2 text-center">
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              flex-1 h-1 mx-4
              ${index < currentStep ? 'bg-brand-base' : 'bg-neutral-muted'}
              transition-all
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

ProgressBar.Steps.displayName = 'ProgressBar.Steps';

export default ProgressBar;
