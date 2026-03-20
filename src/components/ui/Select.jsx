import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      value,
      onChange,
      placeholder = 'Select an option',
      disabled = false,
      required = false,
      className = '',
      multiple = false,
      searchable = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const selectedLabel =
      Array.isArray(value)
        ? options
            .filter((opt) => value.includes(opt.value))
            .map((opt) => opt.label)
            .join(', ')
        : options.find((opt) => opt.value === value)?.label || placeholder;

    const handleSelect = (optionValue) => {
      if (multiple && Array.isArray(value)) {
        const newValue = value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue];
        onChange?.(newValue);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
      setSearchTerm('');
    };

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`
              w-full px-4 py-2
              border rounded-lg
              font-normal text-gray-900
              text-left
              flex items-center justify-between
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : 'border-gray-300'}
              transition-all duration-200
              ${className}
            `}
            {...props}
          >
            <span className={selectedLabel === placeholder ? 'text-gray-400' : ''}>
              {selectedLabel}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`
                        w-full px-4 py-2 text-left hover:bg-blue-50
                        flex items-center gap-2
                        ${
                          multiple
                            ? value?.includes(option.value)
                              ? 'bg-blue-50'
                              : ''
                            : value === option.value
                            ? 'bg-blue-50'
                            : ''
                        }
                      `}
                    >
                      {multiple && (
                        <input
                          type="checkbox"
                          checked={value?.includes(option.value) || false}
                          readOnly
                          className="cursor-pointer"
                        />
                      )}
                      {option.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
