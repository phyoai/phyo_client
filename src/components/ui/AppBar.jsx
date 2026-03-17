'use client';

import React from 'react';
import { MenuLine, SearchLine, BellLine, MoreVerticalLine, ArrowLeftLine } from '@phyoofficial/phyo-icon-library';

/**
 * AppBar Component - Top navigation bar
 * Can contain title, search, icons, and actions
 */

const AppBar = React.forwardRef(({
  title,
  subtitle,
  onMenuClick,
  onBack,
  onSearchChange,
  showSearch = false,
  searchPlaceholder = 'Search...',
  actions = [],
  leftContent,
  rightContent,
  className = '',
  ...props
}, ref) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearchChange?.(e.target.value);
  };

  // Filter out function props that shouldn't be on DOM elements
  const domProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !key.startsWith('on'))
  );

  return (
    <div
      ref={ref}
      className={`
        bg-white
        border-b border-neutral-muted
        px-6 py-4
        sticky top-0
        z-40
        ${className}
      `}
      {...domProps}
    >
      <div className="flex items-center justify-between">
        {/* Left Content */}
        <div className="flex items-center gap-4 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-muted rounded-lg transition-colors"
            >
              <ArrowLeftLine width={24} height={24} className="text-text-base" />
            </button>
          )}

          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-neutral-muted rounded-lg transition-colors"
            >
              <MenuLine width={24} height={24} className="text-text-base" />
            </button>
          )}

          {leftContent}

          <div>
            {title && (
              <h1 className="text-lg font-bold text-text-base">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-text-muted">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="flex-1 mx-6 max-w-md">
            <div className="relative">
              <SearchLine width={20} height={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="
                  w-full
                  pl-10 pr-4 py-2
                  rounded-lg
                  border border-neutral-muted
                  bg-neutral-base
                  text-text-base
                  placeholder:text-text-muted
                  focus:outline-none
                  focus:ring-2
                  focus:ring-brand-base/20
                  focus:border-brand-base
                  transition-all
                "
              />
            </div>
          </div>
        )}

        {/* Right Content */}
        <div className="flex items-center gap-2">
          {rightContent}

          {/* Actions */}
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="p-2 hover:bg-neutral-muted rounded-lg transition-colors relative"
              title={action.label}
            >
              {action.icon && (
                <action.icon width={24} height={24} className="text-text-base" />
              )}
              {action.badge && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-base rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

AppBar.displayName = 'AppBar';

export default AppBar;
