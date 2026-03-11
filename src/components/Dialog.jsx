'use client';

import React, { useEffect } from 'react';
import { CloseLine } from '@phyoofficial/phyo-icon-library';

/**
 * Dialog Component - Modal dialog for important user interactions
 * Sizes: sm, md, lg
 */

const Dialog = React.forwardRef(({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  dismissible = true,
  className = '',
  ...props
}, ref) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeConfig = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={ref}
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white rounded-lg shadow-xl
          z-50
          animate-slideUp
          ${sizeConfig[size]}
          w-full mx-4
          ${className}
        `}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-muted">
          {title && (
            <h2 className="text-xl font-bold text-text-base">
              {title}
            </h2>
          )}
          {dismissible && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-muted rounded transition-colors"
            >
              <CloseLine width={24} height={24} className="text-text-muted" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {actions && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-muted">
            {actions}
          </div>
        )}
      </div>
    </>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
