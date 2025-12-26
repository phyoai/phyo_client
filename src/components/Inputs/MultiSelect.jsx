'use client';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const MultiSelect = ({ 
  name, 
  label, 
  placeholder, 
  options = [], 
  required = false, 
  className = "",
  error 
}) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const rawSelected = watch(name);
  const selectedValues = Array.isArray(rawSelected)
    ? rawSelected
    : rawSelected
      ? (() => {
          try {
            const parsed = JSON.parse(rawSelected);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];
  const [isOpen, setIsOpen] = useState(false);

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

  const hasError = getNestedError(errors, name) || error;

  const handleToggleOption = (optionValue) => {
    const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
    let newValues;
    
    if (currentValues.includes(optionValue)) {
      newValues = currentValues.filter(val => val !== optionValue);
    } else {
      newValues = [...currentValues, optionValue];
    }
    
    setValue(name, newValues, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className={`flex flex-col gap-2 relative ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div 
          className={`min-h-[45px] p-3 border rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedValues.map(value => {
                const option = options.find(opt => opt.value === value);
                return (
                  <span
                    key={value}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {option?.label || value}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOption(value);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleToggleOption(option.value)}
                className={`p-2 cursor-pointer hover:bg-gray-50 ${
                  selectedValues.includes(option.value) ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}} // Handled by onClick
                    className="mr-2"
                    tabIndex={-1}
                  />
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {hasError && (
        <span className="text-sm text-red-500">
          {hasError.message}
        </span>
      )}
      
      <input
        type="hidden"
        {...register(name, { required: required ? `${label} is required` : false })}
        value={JSON.stringify(selectedValues)}
        onChange={() => {}}
      />
    </div>
  );
};

export default MultiSelect;
