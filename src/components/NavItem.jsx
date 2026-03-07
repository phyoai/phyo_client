'use client'
import React from 'react';
import Link from 'next/link';
import { colors } from '@/config/colors';

const NavItem = ({
  href,
  icon: Icon,
  label,
  badge,
  isActive = false,
  isExpanded = false,
  onClick,
}) => {
  const content = (
    <>
      {/* Icon Container */}
      <div className="flex items-center justify-center relative rounded-[8px] shrink-0">
        <div
          className={`flex gap-[10px] items-center justify-center relative rounded-[8px] shrink-0 transition-all duration-300 ${
            isExpanded ? 'px-[4px] py-[8px]' : 'h-[32px] p-[4px]'
          }`}
          style={{
            backgroundColor: isActive ? colors.accent.base : 'transparent',
          }}
        >
          {Icon && <Icon width={24} height={24} fill={isActive ? colors.brand.icon : colors.neutral.inverse.icon} />}

          {/* Badge */}
          {badge && (
            <div
              className="absolute flex items-center justify-center right-0 top-0 rounded-full w-[16px] h-[16px] z-[2]"
              style={{ backgroundColor: colors.semantic.error.bold }}
            >
              <span className="text-white text-[12px] font-medium leading-[16px]">{badge}</span>
            </div>
          )}
        </div>
      </div>

      {/* Label */}
      <div
        className={`flex flex-col font-medium justify-center leading-none relative shrink-0 text-center transition-colors duration-300 text-[14px] tracking-[0.2px] ${
          isExpanded ? 'whitespace-nowrap' : 'w-full'
        }`}
        style={{ color: isActive ? colors.brand.text : colors.neutral.inverse.muted }}
      >
        <p className="leading-[20px]">{label}</p>
      </div>

    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex gap-[4px] items-center py-[6px] relative shrink-0 w-full transition-colors duration-300 no-underline rounded-[32px] ${
          isExpanded ? 'px-[12px]' : 'flex-col justify-center h-[64px]'
        }`}
        style={
          isExpanded
            ? { backgroundColor: isActive ? colors.accent.base : colors.neutral.muted }
            : {}
        }
        onMouseEnter={(e) => {
          if (isExpanded && !isActive) {
            e.currentTarget.style.backgroundColor = colors.neutral.muted;
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex gap-[4px] items-center py-[6px] relative shrink-0 w-full transition-colors duration-300 bg-transparent border-none cursor-pointer ${
        isExpanded ? 'rounded-[32px] px-[12px]' : 'flex-col justify-center h-[64px]'
      }`}
    >
      {content}
    </button>
  );
};

export default NavItem;
