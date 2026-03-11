'use client';

import React, { useState } from 'react';
import { SearchLine, CloseLine } from '@phyoofficial/phyo-icon-library';

/**
 * SearchBar Component - Search input with clear button
 * Sizes: sm, md, lg
 * Variants: default, with-button
 */

const SearchBar = React.forwardRef(({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  onClear,
  size = 'md',
  variant = 'default',
  clearable = true,
  className = '',
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(value || '');

  const sizeConfig = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    onClear?.();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(internalValue);
    }
  };

  return (
    <div
      className={`
        relative w-full
        ${className}
      `}
      {...props}
    >
      <div className="relative">
        <SearchLine
          width={20}
          height={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className={`
            w-full
            pl-10
            pr-4
            rounded-lg
            border-2
            bg-white
            text-text-base
            placeholder:text-text-muted
            focus:outline-none
            focus:ring-2
            focus:ring-brand-base/20
            focus:border-brand-base
            transition-all
            border-neutral-muted
            ${sizeConfig[size]}
          `}
        />
        {clearable && internalValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base transition-colors"
          >
            <CloseLine width={20} height={20} />
          </button>
        )}
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
