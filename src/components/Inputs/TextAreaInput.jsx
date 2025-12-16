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
  const { register, watch } = useFormContext();
  const currentValue = watch(name) || '';

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
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px]"
      />
      
      {maxLength && (
        <div className="text-xs text-gray-500 text-right">
          {currentValue.length}/{maxLength}
        </div>
      )}
      
      {error && (
        <span className="text-sm text-red-500">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default TextAreaInput;
