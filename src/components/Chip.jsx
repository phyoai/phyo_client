'use client';

import React from 'react';
import { CloseLine, AddLine } from '@phyoofficial/phyo-icon-library';

/**
 * Chip Component - Compact element for displaying tags, selections, or filters
 * Variants: input, filter
 * Sizes: sm, md
 */

const Chip = React.forwardRef(({
  children,
  variant = 'input',
  size = 'md',
  onRemove,
  removable = true,
  selected = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  const variantConfig = {
    input: {
      default: 'bg-neutral-muted text-text-base border border-neutral-muted',
      selected: 'bg-brand-base text-white border border-brand-base'
    },
    filter: {
      default: 'bg-white text-text-base border border-neutral-muted hover:bg-neutral-muted cursor-pointer',
      selected: 'bg-brand-base text-white border border-brand-base'
    }
  };

  const sizeConfig = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2'
  };

  const currentConfig = selected
    ? variantConfig[variant].selected
    : variantConfig[variant].default;

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-medium transition-all ${currentConfig} ${sizeConfig[size]} ${className}`}
      {...props}
    >
      {children}
      {removable && onRemove && (
        <button
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <CloseLine width={14} height={14} />
        </button>
      )}
    </button>
  );
});

Chip.displayName = 'Chip';

/**
 * Chip.Group - Container for multiple chips
 */
Chip.Group = React.forwardRef(({
  children,
  variant = 'input',
  spacing = 'gap-2',
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-wrap items-center ${spacing} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Chip.Group.displayName = 'Chip.Group';

export default Chip;
