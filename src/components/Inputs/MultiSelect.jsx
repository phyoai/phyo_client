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
  const { register, watch, setValue } = useFormContext();
  const selectedValues = watch(name) || [];
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = (optionValue) => {
    const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
    let newValues;
    
    if (currentValues.includes(optionValue)) {
      newValues = currentValues.filter(val => val !== optionValue);
    } else {
      newValues = [...currentValues, optionValue];
    }
    
    setValue(name, newValues);
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
          className="min-h-[45px] p-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
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
      
      {error && (
        <span className="text-sm text-red-500">
          {error.message}
        </span>
      )}
      
      <input
        type="hidden"
        {...register(name, { required: required ? `${label} is required` : false })}
        value={JSON.stringify(selectedValues)}
      />
    </div>
  );
};

export default MultiSelect;
