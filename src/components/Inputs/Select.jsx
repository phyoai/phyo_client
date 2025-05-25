import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const Select = ({ name, label, options, placeholder = "Select...", required = false, className = "" }) => {
  const { control, formState: { errors } } = useFormContext();
  const containerRef = useRef(null);

  return (
    <div className="mb-4">
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
          const [isOpen, setIsOpen] = useState(false);
          const [highlightedIndex, setHighlightedIndex] = useState(0);

          useEffect(() => {
            const handleClickOutside = (event) => {
              if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
              }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
          }, []);

          const selectedOption = options.find(opt => opt.value === field.value);

          const handleOptionClick = (option) => {
            field.onChange(option.value);
            setIsOpen(false);
          };

          const handleKeyDown = (e) => {
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
                if (isOpen) {
                  handleOptionClick(options[highlightedIndex]);
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
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className={`relative ${className}`}
            >
              <div
                className={`border px-3 py-2 rounded cursor-pointer bg-white flex justify-between items-center ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
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

      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
      )}
    </div>
  );
};

export default Select;
