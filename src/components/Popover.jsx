'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CloseLine } from '@phyoofficial/phyo-icon-library';

/**
 * Popover Component - Floating content panel triggered by clicking
 * Positions: top, bottom, left, right
 */

const Popover = React.forwardRef(({
  children,
  content,
  title,
  trigger = 'click',
  position = 'bottom',
  hasArrow = true,
  dismissible = true,
  onDismiss,
  className = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const positionConfig = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  const handleDismiss = () => {
    setIsOpen(false);
    onDismiss?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      {...props}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        {children}
      </button>

      {isOpen && (
        <div
          ref={contentRef}
          className={`
            absolute
            ${positionConfig[position]}
            bg-white
            rounded-lg
            shadow-xl
            border border-neutral-muted
            p-4
            z-50
            min-w-max
            animate-fadeIn
            ${className}
          `}
        >
          <div className="flex items-start justify-between mb-3">
            {title && (
              <h3 className="font-bold text-text-base">
                {title}
              </h3>
            )}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-neutral-muted rounded transition-colors"
              >
                <CloseLine width={20} height={20} className="text-text-muted" />
              </button>
            )}
          </div>
          <div className="text-sm text-text-base">
            {content}
          </div>
        </div>
      )}
    </div>
  );
});

Popover.displayName = 'Popover';

export default Popover;
