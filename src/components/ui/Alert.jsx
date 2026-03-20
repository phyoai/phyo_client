import React from 'react';
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
  closeable = true,
}) => {
  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: InfoIcon,
      iconColor: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-800',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bg} ${config.border}
        border rounded-lg p-4
        flex items-start gap-3
        ${className}
      `}
    >
      <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} />

      <div className="flex-1">
        {title && <p className={`font-semibold ${config.title}`}>{title}</p>}
        {message && <p className={`text-sm ${config.message} ${title ? 'mt-1' : ''}`}>{message}</p>}
      </div>

      {closeable && onClose && (
        <button
          onClick={onClose}
          className={`${config.iconColor} hover:opacity-70 flex-shrink-0 transition-opacity`}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;
