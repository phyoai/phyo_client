import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

const TextInput = ({ name, label, placeholder, required = false, className = '', type = 'text' }) => {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  
  // Determine if this is a password field
  const isPasswordField = type === 'password';
  
  // Determine the input type based on password visibility
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  
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
          className={`w-full px-3 py-2 border rounded-md ${errors[name] ? 'border-red-500' : 'border-gray-300'} ${className} ${isPasswordField ? 'pr-10' : ''}`}
          {...register(name, { required: required ? `${label} is required` : false })}
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
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
      )}
    </div>
  );
};

export default TextInput;