import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

const TextInput = ({ name, label, placeholder, required = false, className = '', type = 'text', validation = {} }) => {
  const { register, formState: { errors }, getFieldState } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  
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
  
  // Get field state to check if it has been touched
  const fieldState = getFieldState(name);
  const hasError = getNestedError(errors, name);
  
  // Determine if this is a password field
  const isPasswordField = type === 'password';
  
  // Determine the input type based on password visibility
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  
  // Build validation rules
  const validationRules = {
    required: required ? `${label} is required` : false,
    ...validation
  };
  
  // Debug log for validation
  if (name.includes('verification_documents') || name === 'website_url') {
    console.log('🔍 TextInput:', name, 'hasError:', hasError, 'errors:', errors);
  }
  
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && label && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            hasError 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
          } ${className} ${isPasswordField ? 'pr-10' : ''}`}
          {...register(name, validationRules)}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-500">{hasError.message}</p>
      )}
    </div>
  );
};

export default TextInput;