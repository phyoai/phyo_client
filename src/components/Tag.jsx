import React from 'react';
import { IconHeartFill } from '@phyoofficial/phyo-icon-library';

/**
 * Tag Component
 * Displays a labeled tag with optional icon
 * Supports different color styles and sizes
 */
export default function Tag({
  label = 'Label',
  icon = null,
  showIcon = true,
  colorStyle = 'success', // success, error, warning, info
  size = 'large', // large, medium, small
  className = ''
}) {
  const colorStyles = {
    success: {
      bg: 'bg-[#08a64a]',
      border: 'border-[#067635]',
      text: 'text-[#b2e3c7]'
    },
    error: {
      bg: 'bg-red-600',
      border: 'border-red-700',
      text: 'text-red-100'
    },
    warning: {
      bg: 'bg-amber-600',
      border: 'border-amber-700',
      text: 'text-amber-100'
    },
    info: {
      bg: 'bg-blue-600',
      border: 'border-blue-700',
      text: 'text-blue-100'
    }
  };

  const sizeStyles = {
    large: {
      padding: 'px-[6px] py-[4px]',
      fontSize: 'text-[16px]',
      iconSize: 'h-[20px] w-[20px]',
      gap: 'gap-[4px]'
    },
    medium: {
      padding: 'px-[4px] py-[2px]',
      fontSize: 'text-[14px]',
      iconSize: 'h-[16px] w-[16px]',
      gap: 'gap-[3px]'
    },
    small: {
      padding: 'px-[3px] py-[1px]',
      fontSize: 'text-[12px]',
      iconSize: 'h-[14px] w-[14px]',
      gap: 'gap-[2px]'
    }
  };

  const colors = colorStyles[colorStyle] || colorStyles.success;
  const sizing = sizeStyles[size] || sizeStyles.large;

  return (
    <div
      className={`${colors.bg} border border-solid ${colors.border} rounded-[4px] ${sizing.padding} inline-flex items-center ${sizing.gap} ${className}`}
      data-name="Tag"
    >
      {showIcon && (
        icon || (
          <IconHeartFill className={`${sizing.iconSize}`} />
        )
      )}
      <span className={`font-semibold ${sizing.fontSize} ${colors.text} whitespace-nowrap`}>
        {label}
      </span>
    </div>
  );
}
