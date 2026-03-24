'use client'
import React, { useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';

const CampaignFilters = () => {
  const [platform, setPlatform] = useState('LinkedIn');
  const [timeframe, setTimeframe] = useState('Lifetime');

  return (
    <div className="flex items-center space-x-3">
      {/* Platform Filter */}
      <div className="relative">
        <button className="flex items-center space-x-2.5 bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-all shadow-sm font-medium text-sm">
          <div className="w-4 h-4 bg-white rounded flex items-center justify-center">
            <span className="text-teal-600 text-xs font-bold">in</span>
          </div>
          <span>{platform}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Timeframe Filter */}
      <div className="relative">
        <button className="flex items-center space-x-2.5 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:shadow-md transition-all font-medium text-sm">
          <span className="text-gray-700">{timeframe}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* AI Campaign Analyser Button */}
      <button className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-all shadow-sm font-semibold text-sm">
        AI Campaign Analyser
      </button>

      {/* Download Button */}
      <button className="bg-teal-600 text-white p-2.5 rounded-lg hover:bg-teal-700 transition-all shadow-sm">
        <Download className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CampaignFilters;