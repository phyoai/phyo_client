'use client'
import React from 'react';
import { colors } from '@/config/colors';

const FABButton = ({
  icon: Icon,
  label,
  isExpanded = false,
  isEnabled = true,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      className={`flex items-center rounded-[12px] transition-all duration-300 ease-in-out justify-start ${
        isExpanded
          ? 'w-full h-12 px-[12px] gap-[8px] justify-center'
          : 'w-12 h-12 justify-center'
      } ${className || ''}`}
      style={{
        backgroundColor: colors.brand.base,
        opacity: isEnabled ? 1 : 0.5,
        cursor: isEnabled ? 'pointer' : 'not-allowed',
      }}
    >
      {Icon && (
        <div className="flex-shrink-0" style={{ filter: 'brightness(0) invert(1)' }}>
          <Icon
            width={24}
            height={24}
            className="transition-all duration-300"
          />
        </div>
      )}
      {isExpanded && (
        <span
          className={`text-white text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
            isExpanded ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0 overflow-hidden'
          }`}
        >
          {label}
        </span>
      )}
    </button>
  );
};

export default FABButton;
