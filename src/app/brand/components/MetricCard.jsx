'use client'
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const MetricCard = ({ title, value, percentage, icon: Icon, iconBg }) => {
  // Format large numbers
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M+`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K+`;
      }
      return val;
    }
    return val;
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="text-gray-900 font-medium text-sm">{title}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{formatValue(value)}</span>
        <div className="flex items-center space-x-1 bg-teal-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
          <span>↗</span>
          <span>{percentage}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;