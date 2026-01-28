import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const Select = ({ name, label, options, placeholder = "Select...", required = false, className = "" }) => {
  const { control, formState: { errors } } = useFormContext();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Helper function to get nested error
  const getNestedError = (errors, path) => {
    const keys = path.split('.');
    let error = errors;
    for (const key of keys) {
      if (error && error[key]) {
        error = error[key];
      } else {
        return null;
      }
    }
    return error;
  };

  const hasError = getNestedError(errors, name);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e, field, options) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && options[highlightedIndex]) {
          field.onChange(options[highlightedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#242527]" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => {
          const selectedOption = options.find(opt => opt.value === field.value);

          const handleOptionClick = (option) => {
            field.onChange(option.value);
            setIsOpen(false);
          };

          return (
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, field, options)}
              className="relative"
            >
              <div
                className={`bg-[#f0f0f0] border border-[#e6e6e6] px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center text-sm focus:outline-none focus:ring-2 ${
                  hasError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-[#43573b] focus:border-transparent'
                }`}
                onClick={() => setIsOpen(prev => !prev)}
              >
                <span className={selectedOption?.label ? 'text-gray-700' : 'text-gray-400'}>
                  {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-700" />
              </div>

              {isOpen && (
                <ul className="absolute z-10 bg-white border border-gray-200 mt-1 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {options.map((option, idx) => (
                    <li
                      key={option.value}
                      className={`px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-[#f0f0f0] ${
                        idx === highlightedIndex ? 'bg-[#f0f0f0]' : ''
                      } ${field.value === option.value ? 'bg-[#eceeeb] font-medium' : ''}`}
                      onClick={() => handleOptionClick(option)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }}
      />

      {hasError && (
        <p className="mt-1 text-sm text-red-500">{hasError.message}</p>
      )}
    </div>
  );
};

export default Select;
