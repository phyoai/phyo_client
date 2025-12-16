'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const CheckboxInput = ({ 
  name, 
  label, 
  required = false, 
  className = "",
  error 
}) => {
  const { register } = useFormContext();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={name}
        {...register(name, { 
          required: required ? `${label} is required` : false 
        })}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      
      <label htmlFor={name} className="text-sm font-medium text-gray-700 cursor-pointer">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {error && (
        <span className="text-sm text-red-500 ml-2">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default CheckboxInput;
