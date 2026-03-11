'use client';

import React from 'react';
import { InformationLine, AlertLine, CheckCircleLine, CloseCircleLine, CloseLine } from '@phyoofficial/phyo-icon-library';

/**
 * Banner Component - Displays inline messages for user attention
 * Variants: info, success, warning, error
 * Can be dismissible
 */

const Banner = React.forwardRef(({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  title,
  className = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const variantConfig = {
    info: {
      bg: 'bg-blue-light',
      border: 'border-blue-base',
      text: 'text-blue-base',
      icon: InformationLine
    },
    success: {
      bg: 'bg-green-light',
      border: 'border-green-base',
      text: 'text-green-base',
      icon: CheckCircleLine
    },
    warning: {
      bg: 'bg-yellow-light',
      border: 'border-yellow-base',
      text: 'text-yellow-base',
      icon: AlertLine
    },
    error: {
      bg: 'bg-red-light',
      border: 'border-red-base',
      text: 'text-red-base',
      icon: CloseCircleLine
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  if (!isOpen) return null;

  const handleDismiss = () => {
    setIsOpen(false);
    onDismiss?.();
  };

  return (
    <div
      ref={ref}
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${config.bg} ${config.border} ${className}`}
      {...props}
    >
      <Icon width={20} height={20} className={config.text} />
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold ${config.text} mb-1`}>
            {title}
          </h4>
        )}
        <p className={`text-sm ${config.text}`}>
          {children}
        </p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
        >
          <CloseLine width={20} height={20} />
        </button>
      )}
    </div>
  );
});

Banner.displayName = 'Banner';

export default Banner;
