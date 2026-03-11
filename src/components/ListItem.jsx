'use client';

import React from 'react';
import { ArrowDropRightLine } from '@phyoofficial/phyo-icon-library';

/**
 * ListItem Component - Individual item in a list
 * Can include avatar, title, description, and actions
 */

const ListItem = React.forwardRef(({
  children,
  avatar,
  title,
  description,
  action,
  onClick,
  clickable = false,
  selected = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        flex items-center justify-between
        gap-3
        px-4 py-3
        rounded-lg
        transition-all
        text-left
        ${clickable || onClick ? 'hover:bg-neutral-muted cursor-pointer' : ''}
        ${selected ? 'bg-accent-base' : 'hover:bg-neutral-muted/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        border border-transparent hover:border-neutral-muted
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {avatar && (
          <div className="flex-shrink-0">
            {avatar}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-text-base truncate">
              {title}
            </p>
          )}
          {description && (
            <p className="text-sm text-text-muted truncate">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      {action ? (
        <div className="flex-shrink-0">
          {action}
        </div>
      ) : clickable && (
        <ArrowDropRightLine width={20} height={20} className="text-text-muted flex-shrink-0" />
      )}
    </button>
  );
});

ListItem.displayName = 'ListItem';

/**
 * ListItem.Group - Container for list items
 */
ListItem.Group = React.forwardRef(({
  children,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        divide-y divide-neutral-muted
        rounded-lg
        border border-neutral-muted
        overflow-hidden
        bg-white
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

ListItem.Group.displayName = 'ListItem.Group';

export default ListItem;
