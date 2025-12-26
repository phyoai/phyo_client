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
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1" htmlFor={name}>
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
                className={`border px-3 py-2 rounded cursor-pointer bg-white flex justify-between items-center focus:outline-none focus:ring-2 ${
                  hasError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                }`}
                onClick={() => setIsOpen(prev => !prev)}
              >
                {selectedOption?.label || <span className="text-gray-400">{placeholder}</span>}
                <ChevronDown />
              </div>

              {isOpen && (
                <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow max-h-60 overflow-y-auto">
                  {options.map((option, idx) => (
                    <li
                      key={option.value}
                      className={`p-2 cursor-pointer text-[#979797] ${
                        idx === highlightedIndex ? 'bg-[#C6F4BE66]' : ''
                      }`}
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
