import React from 'react';
import { X } from 'lucide-react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-900',
    primary: 'bg-blue-100 text-blue-900',
    success: 'bg-green-100 text-green-900',
    warning: 'bg-yellow-100 text-yellow-900',
    error: 'bg-red-100 text-red-900',
    info: 'bg-cyan-100 text-cyan-900',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2
        rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity ml-1"
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
};

export default Badge;
