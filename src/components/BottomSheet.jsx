'use client';

import React, { useEffect } from 'react';
import { CloseLine, DragHandleBarLine } from '@phyoofficial/phyo-icon-library';

/**
 * BottomSheet Component - Sliding panel from bottom of screen
 * Commonly used for mobile actions and modals
 */

const BottomSheet = React.forwardRef(({
  isOpen,
  onClose,
  title,
  children,
  actions,
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* BottomSheet */}
      <div
        ref={ref}
        className={`
          fixed bottom-0 left-0 right-0
          bg-white rounded-t-2xl shadow-2xl
          z-50
          animate-slideUp
          max-h-[90vh]
          overflow-y-auto
          ${className}
        `}
        {...props}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 rounded-full bg-neutral-muted" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-muted">
            <h2 className="text-xl font-bold text-text-base">
              {title}
            </h2>
            {dismissible && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-neutral-muted rounded transition-colors"
              >
                <CloseLine width={24} height={24} className="text-text-muted" />
              </button>
            )}
          </div>
        )}

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

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
