import React from 'react';

const TextArea = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = '',
      disabled = false,
      required = false,
      rows = 4,
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

        <textarea
          ref={ref}
          disabled={disabled}
          rows={rows}
          className={`
            w-full px-4 py-2
            border rounded-lg
            font-normal text-gray-900
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            resize-vertical
            ${error ? 'border-red-500' : 'border-gray-300'}
            transition-all duration-200
            ${className}
          `}
          {...props}
        />

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

TextArea.displayName = 'TextArea';

export default TextArea;
