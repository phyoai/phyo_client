'use client';

import React, { useMemo } from 'react';
import MoreLine from '@phyoofficial/phyo-icon-library';

const MetricCard = React.memo(({ title, value, percentage, icon: Icon, iconBg = 'bg-[#00674F]' }) => {
  const formatValue = useMemo(() => {
    if (typeof value === 'number') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M+`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K+`;
      return value;
    }
    return value;
  }, [value]);

  return (
    <div className="bg-[#F3F2EB] rounded-2xl p-5 border border-[#00674F1A] hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center shadow-sm`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="text-gray-900 font-medium text-sm">{title}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreLine className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{formatValue}</span>
        {percentage && (
          <div className="flex items-center space-x-1 bg-[#00674F] text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
            <span>+</span>
            <span>{percentage}</span>
          </div>
        )}
      </div>
    </div>
  );
});

MetricCard.displayName = 'MetricCard';
export default MetricCard;
