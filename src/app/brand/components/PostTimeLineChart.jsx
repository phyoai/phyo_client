'use client'
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

const PostTimelineChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Year');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sample data for the chart
  const chartData = [
    { year: '2014', postView: 20, postEngagement: 18 },
    { year: '2015', postView: 25, postEngagement: 15 },
    { year: '2016', postView: 52, postEngagement: 20 },
    { year: '2017', postView: 45, postEngagement: 22 },
    { year: '2018', postView: 72, postEngagement: 24 },
    { year: '2019', postView: 58, postEngagement: 16 },
    { year: '2020', postView: 45, postEngagement: 23 },
    { year: '2021', postView: 35, postEngagement: 25 },
    { year: '2022', postView: 48, postEngagement: 14 },
    { year: '2023', postView: 38, postEngagement: 18 }
  ];

  const periods = ['Year', 'Month', 'Week', 'Day'];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`Year: ${label}`}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-800 rounded-full"></div>
              <span className="text-sm text-gray-600">User Click: {payload[0].value}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              <span className="text-sm text-gray-600">User Open: {payload[1].value}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Post Engagement Timeline</h3>
        
        {/* Period Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span className="text-sm font-medium">{selectedPeriod}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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

      {/* Legend */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-800 rounded-full"></div>
          <span className="text-sm text-gray-600">Post view</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-300 rounded-full"></div>
          <span className="text-sm text-gray-600">Post Engagement</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 80]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Post View Line */}
            <Line
              type="monotone"
              dataKey="postView"
              stroke="#166534"
              strokeWidth={3}
              fill="#166534"
              fillOpacity={0.1}
              dot={{ fill: '#166534', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#166534', strokeWidth: 2 }}
            />
            
            {/* Post Engagement Line */}
            <Line
              type="monotone"
              dataKey="postEngagement"
              stroke="#86efac"
              strokeWidth={3}
              fill="#86efac"
              fillOpacity={0.1}
              dot={{ fill: '#86efac', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#86efac', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Data Point Info */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-green-800 rounded-full"></div>
              <span className="text-2xl font-bold text-gray-900">42%</span>
            </div>
            <span className="text-sm text-gray-600">User Click</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              <span className="text-2xl font-bold text-gray-900">58%</span>
            </div>
            <span className="text-sm text-gray-600">User Open</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostTimelineChart;