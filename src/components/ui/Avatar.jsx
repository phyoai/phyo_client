'use client';

import React from 'react';

/**
 * Avatar Component - Displays user profile image or initials
 * Sizes: xs, sm, md, lg, xl
 * Variants: image, initials, icon
 */

const Avatar = React.forwardRef(({
  src,
  alt = 'Avatar',
  initials,
  icon: Icon,
  size = 'md',
  variant = 'image',
  className = '',
  bgColor = 'bg-brand-base',
  ...props
}, ref) => {
  const sizeConfig = {
    xs: { size: 'w-6 h-6', text: 'text-xs' },
    sm: { size: 'w-8 h-8', text: 'text-sm' },
    md: { size: 'w-10 h-10', text: 'text-base' },
    lg: { size: 'w-12 h-12', text: 'text-lg' },
    xl: { size: 'w-16 h-16', text: 'text-2xl' }
  };

  const config = sizeConfig[size];

  return (
    <div
      ref={ref}
      className={`
        ${config.size}
        rounded-full
        overflow-hidden
        flex items-center justify-center
        flex-shrink-0
        ${className}
      `}
      {...props}
    >
      {variant === 'image' && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : variant === 'initials' && initials ? (
        <div className={`${bgColor} text-white ${config.text} font-semibold flex items-center justify-center w-full h-full`}>
          {initials}
        </div>
      ) : variant === 'icon' && Icon ? (
        <div className={`${bgColor} text-white flex items-center justify-center w-full h-full`}>
          <Icon width={config.size === 'w-6 h-6' ? 12 : 16} height={config.size === 'w-6 h-6' ? 12 : 16} />
        </div>
      ) : (
        <div className={`${bgColor} text-white ${config.text} font-semibold flex items-center justify-center w-full h-full`}>
          ?
        </div>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
