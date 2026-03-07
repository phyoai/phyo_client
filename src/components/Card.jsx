'use client';

import React from 'react';
import { colors } from '@/config/colors';

/**
 * Card Component - Part of Ember Design System
 *
 * Flexible card component with support for:
 * - Header (image, avatar, title)
 * - Body (heading, text, metadata)
 * - Footer (buttons, actions)
 * - Variants: default, elevated, outlined
 * - Support for badges, status indicators
 */

const Card = React.forwardRef(({
  children,
  variant = 'default',
  padding = 'p-6',
  className = '',
  ...props
}, ref) => {
  const variantConfig = {
    default: `bg-neutral-base border border-neutral-muted rounded-lg shadow-sm hover:shadow-md transition-shadow`,
    elevated: `bg-neutral-base rounded-lg shadow-lg hover:shadow-xl transition-shadow`,
    outlined: `bg-neutral-base border-2 border-brand-base rounded-lg hover:border-opacity-80 transition-colors`
  };

  return (
    <div
      ref={ref}
      className={`${variantConfig[variant]} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * Card.Header - Top section for images or avatars
 */
Card.Header = React.forwardRef(({
  children,
  image,
  imageAlt = 'Card image',
  height = 'h-48',
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`-m-6 mb-4 ${height} overflow-hidden rounded-t-lg ${className}`}
      {...props}
    >
      {image ? (
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`${height} bg-gradient-to-br from-neutral-muted to-neutral-base flex items-center justify-center`}>
          {children}
        </div>
      )}
    </div>
  );
});

Card.Header.displayName = 'Card.Header';

/**
 * Card.Title - Main heading
 */
Card.Title = React.forwardRef(({
  children,
  level = 'h3',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizeConfig = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-xl font-bold'
  };

  const Component = level;

  return (
    <Component
      ref={ref}
      className={`${sizeConfig[size]} mb-2 ${className}`}
      style={{ color: colors.text.neutral.base }}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.Title.displayName = 'Card.Title';

/**
 * Card.Description - Supporting text
 */
Card.Description = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm mb-4 ${className}`}
      style={{ color: colors.text.neutral.muted }}
      {...props}
    >
      {children}
    </p>
  );
});

Card.Description.displayName = 'Card.Description';

/**
 * Card.Badge - Status indicator/tag
 */
Card.Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const variantConfig = {
    default: `bg-accent-base text-brand-text`,
    success: `bg-green-100 text-green-800`,
    danger: `bg-red-100 text-red-800`,
    warning: `bg-yellow-100 text-yellow-800`,
    info: `bg-blue-100 text-blue-800`
  };

  const sizeConfig = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full font-medium ${variantConfig[variant]} ${sizeConfig[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Card.Badge.displayName = 'Card.Badge';

/**
 * Card.Footer - Bottom section with actions
 */
Card.Footer = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`mt-6 pt-4 border-t border-neutral-muted flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.Footer.displayName = 'Card.Footer';

/**
 * Card.Meta - Metadata display (pricing, engagement, etc.)
 */
Card.Meta = React.forwardRef(({
  label,
  value,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between py-2 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon width={16} height={16} />}
        <span className="text-xs" style={{ color: colors.text.neutral.muted }}>
          {label}
        </span>
      </div>
      <span
        className="text-sm font-semibold"
        style={{ color: colors.text.neutral.base }}
      >
        {value}
      </span>
    </div>
  );
});

Card.Meta.displayName = 'Card.Meta';

export default Card;
