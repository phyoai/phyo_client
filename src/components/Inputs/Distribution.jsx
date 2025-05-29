import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const Distribution = ({ name, label, required = false, options, className = '' }) => {
  const { 
    register, 
    formState: { errors }, 
    setValue, 
    trigger,
    getValues
  } = useFormContext();

  // Watch the entire array to calculate total
  const watchedArray = useWatch({ name });

  // Initialize form values as array matching schema
  useEffect(() => {
    const initialData = options.map(option => ({
      gender: option.value,
      distribution: 0
    }));
    setValue(name, initialData);
  }, [options, name, setValue]);

  // Calculate total percentage
  const totalPercentage = (watchedArray || []).reduce((sum, item) => {
    return sum + (parseInt(item?.distribution) || 0);
  }, 0);

  const isOverLimit = totalPercentage > 100;
  const hasError = errors[name] || isOverLimit;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.value} className="flex justify-between items-center">
            <p className="font-semibold text-sm">{option.label}</p>
            <div className="flex items-center gap-2">
              <div className={`border px-3 py-2 rounded-md flex items-center gap-2 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="outline-none w-16 text-right"
                  {...register(`${name}.${index}.distribution`, {
                    required: required ? `${option.label} distribution is required` : false,
                    min: { value: 0, message: "Value cannot be negative" },
                    max: { value: 100, message: "Value cannot exceed 100%" },
                    valueAsNumber: true,
                    onChange: () => {
                      // Trigger validation when any value changes
                      setTimeout(() => trigger(name), 0);
                    }
                  })}
                />
                <span className="text-gray-500">%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total percentage display */}
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="font-semibold text-sm">Total:</span>
        <span className={`font-bold ${
          isOverLimit ? 'text-red-500' : 
          totalPercentage === 100 ? 'text-green-600' : 
          'text-gray-700'
        }`}>
          {totalPercentage}%
        </span>
      </div>

      {/* Error messages */}
      {isOverLimit && (
        <p className="text-sm text-red-500">
          Total percentage cannot exceed 100% (currently {totalPercentage}%)
        </p>
      )}
      
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name].message}</p>
      )}
      
      {Object.keys(errors).some(key => key.startsWith(`${name}.`)) && (
        <div className="text-sm text-red-500">
          {Object.entries(errors)
            .filter(([key]) => key.startsWith(`${name}.`))
            .map(([key, error]) => (
              <p key={key}>{error.message}</p>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default Distribution;