'use client'
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CampaignFilters = () => {
  const [platform, setPlatform] = useState('LinkedIn');
  const [timeframe, setTimeframe] = useState('Lifetime');

  return (
    <div className="flex items-center space-x-4">
      {/* Platform Filter */}
      <div className="relative">
        <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <div className="w-4 h-4 bg-white rounded flex items-center justify-center">
            <span className="text-green-600 text-xs font-bold">in</span>
          </div>
          <span>{platform}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Timeframe Filter */}
      <div className="relative">
        <button className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-gray-700">{timeframe}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* AI Campaign Analyser Button */}
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
        AI Campaign Analyser
      </button>
    </div>
  );
};

export default CampaignFilters;