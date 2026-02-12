import React from 'react';

/**
 * Reusable Influencer Avatar Component
 * Used for displaying influencer profile in circular format with scrollable lists
 */
export default function InfluencerAvatar({ 
  name, 
  avatar, 
  bgColor = 'bg-teal-600',
  onClick,
  size = 'md' // sm, md, lg
}) {
  const sizeClasses = {
    sm: {
      outer: 'w-14 h-14',
      inner: 'w-12 h-12',
      text: 'text-xs',
      width: 'w-14'
    },
    md: {
      outer: 'w-24 h-24',
      inner: 'w-20 h-20',
      text: 'text-xs',
      width: 'w-24'
    },
    lg: {
      outer: 'w-28 h-28',
      inner: 'w-24 h-24',
      text: 'text-sm',
      width: 'w-28'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div 
      className={`flex flex-col items-center flex-shrink-0 cursor-pointer group ${currentSize.width}`}
      onClick={onClick}
    >
      <div className={`${currentSize.outer} ${bgColor} rounded-full flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
        <img 
          src={avatar} 
          alt={name}
          className={`${currentSize.inner} rounded-full object-cover`}
        />
      </div>
      <span className={`${currentSize.text} text-gray-800 font-medium text-center leading-tight`}>
        {name}
      </span>
    </div>
  );
}
