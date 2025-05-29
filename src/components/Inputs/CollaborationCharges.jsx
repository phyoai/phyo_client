import React from 'react';
import { useFormContext } from 'react-hook-form';

const CollaborationCharges = ({ name, label, required = false }) => {
  const { register, formState: { errors }, watch } = useFormContext();
  
  const contentTypes = [
    { key: 'reel', label: 'Cost Per Reel' },
    { key: 'post', label: 'Cost Per Post' },
    { key: 'story', label: 'Cost Per Story' },
    { key: 'oneMonthDigitalRights', label: 'Cost Per Story' }
  ];

  const currencies = [
    { value: 'USD', label: 'Dollars($)' },
    { value: 'EUR', label: 'Euro(€)' },
    { value: 'GBP', label: 'Pounds(£)' },
    { value: 'PKR', label: 'Rupees(₨)' }
  ];

  return (
    <div className="space-y-6">
      {contentTypes.map((contentType) => (
        <div key={contentType.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {contentType.label}
          </label>
          <div className="flex gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 min-w-[120px]"
              {...register(`${name}.${contentType.key}.currency`, { 
                required: required ? 'Currency is required' : false 
              })}
              defaultValue="USD"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder=""
              className={`flex-1 px-3 py-2 border rounded-md ${
                errors[name]?.[contentType.key]?.value ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register(`${name}.${contentType.key}.value`, { 
                required: required ? `${contentType.label} is required` : false,
                min: { value: 0, message: 'Value must be positive' },
                valueAsNumber: true
              })}
            />
          </div>
          {errors[name]?.[contentType.key]?.value && (
            <p className="text-sm text-red-500">{errors[name][contentType.key].value.message}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollaborationCharges;