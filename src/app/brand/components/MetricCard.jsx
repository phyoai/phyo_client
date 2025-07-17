'use client'
import React from 'react';
import { MoreHorizontal, TrendingUp } from 'lucide-react';

const MetricCard = ({ title, value, percentage, icon: Icon, iconBg }) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="text-gray-700 font-medium">{title}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
          <TrendingUp className="h-3 w-3" />
          <span>{percentage}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;