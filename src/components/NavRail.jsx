'use client'
import React from 'react';
import { MenuFill, MenuUnfold4Line } from '@phyoofficial/phyo-icon-library';
import { colors } from '@/config/colors';
import FABButton from './FABButton';

const NavRail = ({
  isExpanded,
  setIsExpanded,
  fabIcon,
  fabLabel,
  fabAction,
  isFabEnabled,
  navItems,
  activeHref,
  indicatorStyle,
  navRefs,
  mounted,
}) => {
  if (!mounted) {
    return (
      <div
        className={`h-screen fixed left-0 top-0 flex flex-col transition-[width] duration-300 ease-in-out z-50 w-[96px] pt-[44px] pb-[56px]`}
        style={{ backgroundColor: colors.neutral.base }}
      />
    );
  }

  return (
    <div
      className={`h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 ease-in-out z-50 ${
        isExpanded
          ? 'w-[240px] pt-[16px] pb-[16px] px-[12px]'
          : 'w-[80px] pt-[16px] pb-[16px] px-0'
      }`}
      style={{ backgroundColor: colors.neutral.base }}
    >
      {/* Header Section with Toggle & Action Button */}
      <div
        className={`flex flex-col gap-[8px] mb-[24px] transition-all duration-300 ease-in-out ${
          isExpanded ? 'px-[8px]' : 'px-[8px] items-center'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center rounded-[12px] transition-all duration-200 w-12 h-12`}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.neutral.muted)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div className="transition-transform duration-300">
            {isExpanded ? (
              <MenuUnfold4Line width={20} height={20} fill={colors.text.neutral.base} />
            ) : (
              <MenuFill width={20} height={20} fill={colors.text.neutral.base} />
            )}
          </div>
        </button>

        {/* Action Button (FAB) */}
        {fabIcon && (
          <FABButton
            icon={fabIcon}
            label={fabLabel}
            isExpanded={isExpanded}
            isEnabled={isFabEnabled}
            onClick={fabAction}
          />
        )}
      </div>

      {/* Navigation Items */}
      <nav className={`flex flex-col gap-[2px] relative flex-1`}>
        {isExpanded && (
          <div
            className="absolute left-[8px] right-[8px] rounded-[12px] transition-all duration-[350ms] ease-out pointer-events-none"
            style={{
              backgroundColor: colors.accent.base,
              top: `${indicatorStyle.top}px`,
              // height: `${indicatorStyle.height}px`,
            }}
          />
        )}

        {navItems && navItems.map((item, index) => (
          <div key={item.name} ref={(el) => navRefs.current && (navRefs.current[index] = el)}>
            {item.component}
          </div>
        ))}
      </nav>

      {/* Bottom Navigation */}
      {navItems && navItems.some((item) => item.isBottom) && (
        <nav
          className="flex flex-col gap-[2px] mt-auto pt-[12px] border-t"
          style={{ borderColor: colors.neutral.muted }}
        >
          {navItems
            .filter((item) => item.isBottom)
            .map((item, index) => (
              <div key={item.name}>
                {item.component}
              </div>
            ))}
        </nav>
      )}
    </div>
  );
};

export default NavRail;
