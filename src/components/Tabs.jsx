'use client';

import React, { useState } from 'react';

/**
 * Tabs Component - Organize content into separate views
 * Can be horizontal or vertical
 */

const Tabs = React.forwardRef(({
  tabs = [],
  defaultTab = 0,
  onChange,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
  ...props
}, ref) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  const orientationClass = orientation === 'vertical'
    ? 'flex flex-row'
    : 'flex flex-col';

  return (
    <div
      ref={ref}
      className={`w-full ${className}`}
      {...props}
    >
      <div className={`
        flex
        ${orientation === 'vertical' ? 'flex-row gap-0' : 'flex-col gap-0'}
        border-b-2 border-neutral-muted
      `}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`
              px-6 py-3
              font-medium
              text-base
              transition-all
              border-b-2
              ${activeTab === index
                ? 'text-brand-text border-b-brand-base'
                : 'text-text-muted border-b-transparent hover:text-text-base'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {tab.icon && <tab.icon width={20} height={20} />}
              {tab.label}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
