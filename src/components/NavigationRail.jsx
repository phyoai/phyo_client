'use client';

import React, { useState } from 'react';

/**
 * NavigationRail Component - Vertical navigation for mobile/desktop
 * Can be collapsed/expanded
 */

const NavigationRail = React.forwardRef(({
  items = [],
  activeIndex = 0,
  onNavigate,
  collapsed = false,
  className = '',
  ...props
}, ref) => {
  const [selected, setSelected] = useState(activeIndex);

  const handleSelect = (index, item) => {
    setSelected(index);
    item.onClick?.();
    onNavigate?.(index);
  };

  return (
    <nav
      ref={ref}
      className={`
        bg-white
        border-r border-neutral-muted
        flex flex-col items-center gap-4
        px-4 py-6
        min-h-screen
        ${collapsed ? 'w-24' : 'w-64'}
        transition-all
        ${className}
      `}
      {...props}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => handleSelect(index, item)}
          className={`
            w-full
            flex items-center gap-4
            px-4 py-3
            rounded-lg
            font-medium
            transition-all
            ${selected === index
              ? 'bg-brand-base text-white'
              : 'text-text-base hover:bg-neutral-muted'
            }
          `}
        >
          {item.icon && <item.icon width={24} height={24} />}
          {!collapsed && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
  );
});

NavigationRail.displayName = 'NavigationRail';

export default NavigationRail;
