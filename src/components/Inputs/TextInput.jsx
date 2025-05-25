import React from 'react';
import { useFormContext } from 'react-hook-form';

const TextInput = ({ name, label, placeholder, required = false, className = '' }) => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && label && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type="text"
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md ${errors[name] ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...register(name, { required: required ? `${label} is required` : false })}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
      )}
    </div>
  );
};

export default TextInput;