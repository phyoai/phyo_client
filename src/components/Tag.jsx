'use client';

import React from 'react';
import { CloseLine, HeartFill } from '@phyoofficial/phyo-icon-library';

/**
 * Tag Component - Labels for categorizing or filtering
 * Variants: default, filled, outlined
 * Colors: red, green, yellow, blue, purple, gray
 */

const Tag = React.forwardRef(({
  children,
  variant = 'default',
  color = 'gray',
  size = 'md',
  icon: Icon,
  onRemove,
  removable = false,
  className = '',
  ...props
}, ref) => {
  const colorConfig = {
    red: {
      default: 'bg-red-light text-red-base border-red-light',
      filled: 'bg-red-base text-white border-red-base',
      outlined: 'border-2 border-red-base text-red-base bg-white'
    },
    green: {
      default: 'bg-green-light text-green-base border-green-light',
      filled: 'bg-green-base text-white border-green-base',
      outlined: 'border-2 border-green-base text-green-base bg-white'
    },
    yellow: {
      default: 'bg-yellow-light text-yellow-base border-yellow-light',
      filled: 'bg-yellow-base text-white border-yellow-base',
      outlined: 'border-2 border-yellow-base text-yellow-base bg-white'
    },
    blue: {
      default: 'bg-blue-light text-blue-base border-blue-light',
      filled: 'bg-blue-base text-white border-blue-base',
      outlined: 'border-2 border-blue-base text-blue-base bg-white'
    },
    purple: {
      default: 'bg-purple-light text-purple-base border-purple-light',
      filled: 'bg-purple-base text-white border-purple-base',
      outlined: 'border-2 border-purple-base text-purple-base bg-white'
    },
    gray: {
      default: 'bg-neutral-muted text-text-base border-neutral-muted',
      filled: 'bg-text-muted text-white border-text-muted',
      outlined: 'border-2 border-neutral-muted text-text-base bg-white'
    }
  };

  const sizeConfig = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  return (
    <div
      ref={ref}
      className={`
        inline-flex items-center
        rounded-md
        font-medium
        transition-all
        ${colorConfig[color][variant]}
        ${sizeConfig[size]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon width={16} height={16} />}
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity flex-shrink-0"
        >
          <CloseLine width={14} height={14} />
        </button>
      )}
    </div>
  );
});

Tag.displayName = 'Tag';

export default Tag;
