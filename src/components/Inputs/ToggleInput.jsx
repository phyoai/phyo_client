'use client';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const ToggleInput = ({ 
  name, 
  label, 
  required = false, 
  className = "",
  defaultValue = false
}) => {
  const { control } = useFormContext();

  return (
    <div className={`bg-white flex items-center pl-4 ${className}`}>
      <div className="flex items-center w-full">
        <div className="flex-1 flex flex-col items-start justify-center pr-4 py-3">
          <label 
            htmlFor={name} 
            className="text-base font-semibold text-[#242527] cursor-pointer"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
        
        <div className="flex items-center justify-center shrink-0">
          <div className="flex flex-col items-start px-4 py-[18px]">
            <Controller
              name={name}
              control={control}
              defaultValue={defaultValue}
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex items-center h-8 rounded-full w-[50px] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#43573b] ${
                    field.value ? 'bg-[#3d4f36]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                      field.value ? 'translate-x-[22px]' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleInput;
