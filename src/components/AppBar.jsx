'use client'
import React, { useState } from 'react';
import { colors } from '@/config/colors';
import {
  ArrowLeftSLine,
  BellLine,
  BellFill,
  MoreFill,
  SearchLine,
  CloseLine,
} from '@phyoofficial/phyo-icon-library';

const AppBar = ({
  title,
  supportingText,
  onBack,
  showNotification = false,
  notificationCount = 0,
  onNotificationClick,
  showMenu = false,
  onMenuClick,
  variant = 'default', // 'default', 'search'
  searchPlaceholder = 'Search',
  onSearch,
  onSearchChange,
  searchValue = '',
  showSearch = false,
  onSearchToggle,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(showSearch);

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (onSearchToggle) onSearchToggle(!isSearchActive);
  };

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-4"
      style={{
        backgroundColor: colors.neutral.base,
        borderBottom: `1px solid ${colors.neutral.muted}`,
      }}
    >
      {/* Left Section - Back Button & Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2 transition-all duration-200"
            style={{
              color: colors.text.neutral.base,
            }}
          >
            <ArrowLeftSLine width={24} height={24} fill={colors.text.neutral.base} />
          </button>
        )}

        {isSearchActive ? (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch?.();
              if (e.key === 'Escape') handleSearchToggle();
            }}
            className="flex-1 px-4 py-2 rounded-full text-sm transition-all duration-300"
            style={{
              backgroundColor: colors.neutral.muted,
              color: colors.text.neutral.base,
              outline: 'none',
            }}
            autoFocus
          />
        ) : (
          <div className="flex-1 min-w-0">
            <h1
              className="text-lg font-bold truncate"
              style={{ color: colors.text.neutral.base }}
            >
              {title}
            </h1>
            {supportingText && (
              <p
                className="text-xs truncate"
                style={{ color: colors.neutral.inverse.muted }}
              >
                {supportingText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        {/* Search Toggle */}
        {variant === 'search' && (
          <button
            onClick={handleSearchToggle}
            className="p-2 transition-all duration-200"
            style={{
              color: colors.text.neutral.base,
            }}
          >
            {isSearchActive ? (
              <CloseLine width={24} height={24} fill={colors.text.neutral.base} />
            ) : (
              <SearchLine width={24} height={24} fill={colors.text.neutral.base} />
            )}
          </button>
        )}

        {/* Notification Bell */}
        {showNotification && (
          <button
            onClick={onNotificationClick}
            className="relative p-2 transition-all duration-200"
            style={{
              color: colors.text.neutral.base,
            }}
          >
            <BellLine width={24} height={24} fill={colors.text.neutral.base} />
            {notificationCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: colors.semantic.error.bold }}
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        )}

        {/* Menu Button */}
        {showMenu && (
          <button
            onClick={onMenuClick}
            className="p-2 transition-all duration-200"
            style={{
              color: colors.text.neutral.base,
            }}
          >
            <MoreFill width={24} height={24} fill={colors.text.neutral.base} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AppBar;
