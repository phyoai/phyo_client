'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircleLine, AlertLine, CloseCircleLine, CloseLine } from '@phyoofficial/phyo-icon-library';

/**
 * Snackbar Component - Brief notification at bottom of screen
 * Variants: success, error, warning, info
 * Auto-dismisses after duration
 */

const Snackbar = React.forwardRef(({
  message,
  action,
  variant = 'info',
  duration = 4000,
  onClose,
  isOpen = true,
  className = '',
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isVisible) return null;

  const variantConfig = {
    success: {
      bg: 'bg-green-base',
      icon: CheckCircleLine,
      text: 'text-white'
    },
    error: {
      bg: 'bg-red-base',
      icon: CloseCircleLine,
      text: 'text-white'
    },
    warning: {
      bg: 'bg-yellow-base',
      icon: AlertLine,
      text: 'text-white'
    },
    info: {
      bg: 'bg-blue-base',
      icon: AlertLine,
      text: 'text-white'
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      ref={ref}
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2
        flex items-center gap-4
        px-6 py-4
        rounded-lg
        ${config.bg}
        ${config.text}
        shadow-lg
        z-50
        animate-slideUp
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon width={20} height={20} className={config.text} />}
      <span className="flex-1 font-medium">
        {message}
      </span>
      {action && (
        <button
          onClick={() => {
            action.onClick?.();
            setIsVisible(false);
          }}
          className="font-semibold hover:opacity-80 transition-opacity"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="hover:opacity-80 transition-opacity flex-shrink-0"
      >
        <CloseLine width={20} height={20} />
      </button>
    </div>
  );
});

Snackbar.displayName = 'Snackbar';

export default Snackbar;
