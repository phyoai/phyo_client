'use client';

import React, { useState, useRef, useEffect } from 'react';

/**
 * Menu Component - Dropdown menu with items
 */

const Menu = React.forwardRef(({
  trigger,
  items = [],
  onSelect,
  className = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  const handleSelectItem = (item) => {
    item.onClick?.();
    onSelect?.(item);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        {trigger}
      </button>

      {isOpen && (
        <div className={`
          absolute top-full mt-2 right-0
          bg-white rounded-lg shadow-lg
          border border-neutral-muted
          min-w-48
          z-50
          animate-fadeIn
          ${className}
        `}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelectItem(item)}
              disabled={item.disabled}
              className={`
                w-full text-left
                px-4 py-3
                transition-all
                ${index !== items.length - 1 ? 'border-b border-neutral-muted' : ''}
                ${item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-neutral-muted cursor-pointer'
                }
              `}
            >
              <div className="flex items-center gap-2">
                {item.icon && <item.icon width={20} height={20} />}
                <span className="font-medium text-text-base">
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

Menu.displayName = 'Menu';

/**
 * Menu.Item - Individual menu item
 */
Menu.Item = React.forwardRef(({
  children,
  icon: Icon,
  label,
  onClick,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left
        px-4 py-3
        font-medium
        transition-all
        flex items-center gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-muted cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon width={20} height={20} />}
      {label || children}
    </button>
  );
});

Menu.Item.displayName = 'Menu.Item';

export default Menu;
