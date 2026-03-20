import React from 'react';

const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      className = '',
      type = 'text',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-3 text-gray-400">
              <Icon size={20} />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={`
              w-full px-4 py-2
              ${Icon ? 'pl-10' : 'px-4'}
              border rounded-lg
              font-normal text-gray-900
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : 'border-gray-300'}
              transition-all duration-200
              ${className}
            `}
            {...props}
          />
        </div>

        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}

        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
