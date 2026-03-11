'use client';

import React from 'react';
import { ArrowDropRightLine } from '@phyoofficial/phyo-icon-library';

/**
 * Breadcrumbs Component - Navigation path showing user's location
 */

const Breadcrumbs = React.forwardRef(({
  items = [],
  onNavigate,
  className = '',
  ...props
}, ref) => {
  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ArrowDropRightLine
              width={16}
              height={16}
              className="text-text-muted flex-shrink-0"
            />
          )}
          <button
            onClick={() => item.onClick?.()}
            className={`
              px-2 py-1
              rounded
              transition-all
              font-medium
              ${index === items.length - 1
                ? 'text-text-base cursor-default'
                : 'text-brand-text hover:bg-accent-base cursor-pointer'
              }
            `}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
