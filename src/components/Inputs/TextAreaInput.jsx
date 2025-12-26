'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const TextAreaInput = ({ 
  name, 
  label, 
  placeholder = "", 
  required = false, 
  maxLength,
  rows = 4,
  className = "",
  error 
}) => {
  const { register, watch, formState: { errors } } = useFormContext();
  const currentValue = watch(name) || '';

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

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        id={name}
        {...register(name, { 
          required: required ? `${label} is required` : false,
          maxLength: maxLength ? {
            value: maxLength,
            message: `Maximum ${maxLength} characters allowed`
          } : undefined
        })}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 resize-vertical min-h-[100px] ${
          hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        }`}
      />
      
      {maxLength && (
        <div className="text-xs text-gray-500 text-right">
          {currentValue.length}/{maxLength}
        </div>
      )}
      
      {hasError && (
        <span className="text-sm text-red-500">
          {hasError.message}
        </span>
      )}
    </div>
  );
};

export default TextAreaInput;