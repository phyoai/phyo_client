// components/EngagementSection.jsx
'use client'
import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, TrendingUp } from 'lucide-react';

const EngagementSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Year');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sample data for the engagement chart
  const chartData = [
    { month: 'Jan', engagement: 35000 },
    { month: 'Feb', engagement: 38000 },
    { month: 'Mar', engagement: 42000 },
    { month: 'Apr', engagement: 39000 },
    { month: 'May', engagement: 41122 },
    { month: 'Jun', engagement: 40000 },
    { month: 'Jul', engagement: 43000 },
  ];

  const periods = ['Year', 'Month', 'Week', 'Day'];

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-green-600 text-white px-3 py-2 rounded shadow-lg">
          <p className="text-sm font-medium">{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Engagement</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Engagement Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            {/* Header with Growth Indicator */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Total Engagement</h3>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+465</span>
              </div>
            </div>

            {/* Main Metric */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">41,122k</span>
            </div>

            {/* Period Selector */}
            <div className="mb-6">
              <div className="relative inline-block">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm font-medium">{selectedPeriod}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mini Chart */}
            <div className="h-24 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#059669' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Data Point Indicator */}
              <div className="absolute top-0 right-1/3 transform translate-x-1/2">
                <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                  41,122
                </div>
                <div className="w-3 h-3 bg-green-600 rounded-full mx-auto mt-1"></div>
                <div className="w-px h-4 bg-green-600 mx-auto border-dashed"></div>
              </div>
            </div>
          </div>

          {/* Daily Engagement Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Engagement</h3>
            
            {/* Main Metric */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">580k</span>
            </div>

            {/* Metrics List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Like</span>
                <span className="font-medium text-gray-900">234,456</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Comments</span>
                <span className="font-medium text-gray-900">12,456</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Engagement Rate</span>
                <span className="font-medium text-gray-900">2.34%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cost Per Engagement</span>
                <span className="font-medium text-gray-900">$78</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementSection;