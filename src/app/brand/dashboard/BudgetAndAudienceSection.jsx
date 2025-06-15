// components/BudgetAndAudienceSection.jsx
'use client'
import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, MoreHorizontal, Plus, Minus } from 'lucide-react';

const BudgetAndAudienceSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Budget Spend Data
  const budgetData = [
    { date: 'Jan 12', amount: 30 },
    { date: 'Jan 18', amount: 55 },
    { date: 'Jan 20', amount: 75 },
    { date: 'Jan 23', amount: 180 },
    { date: 'Jan 27', amount: 65 },
    { date: 'Jan 28', amount: 90 },
    { date: 'Jan 29', amount: 60 }
  ];

  // Audience Sentiment Data
  const sentimentData = [
    { name: 'Positive', value: 57.42, color: '#059669' },
    { name: 'Neutral', value: 21.36, color: '#34d399' },
    { name: 'Negative', value: 21.22, color: '#6ee7b7' }
  ];

  const periods = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year'];

  // Custom tooltip for budget chart
  const BudgetTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-green-600 text-white px-3 py-2 rounded shadow-lg">
          <p className="text-xs">{label}</p>
          <p className="text-sm font-medium">${payload[0].value}</p>
          <p className="text-xs">25k Amount</p>
          <p className="text-xs">Almost complete</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Budget Spent</h2>
          <h2 className="text-2xl font-bold text-gray-900">Audience Sentiment</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Money Spend Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Money Spend</h3>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-900 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-800 transition-colors"
                >
                  <span>{selectedPeriod}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} barCategoryGap="20%">
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    domain={[0, 200]}
                  />
                  <Tooltip content={<BudgetTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="#059669" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audience Sentiment Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Employee Structure</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Donut Chart with Labels */}
            <div className="relative mb-6">
              <div className="w-64 h-64 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Percentage Labels */}
              <div className="absolute top-8 left-4 text-sm font-medium text-gray-900">57.42%</div>
              <div className="absolute top-8 right-4 text-sm font-medium text-gray-900">21.22%</div>
              <div className="absolute bottom-12 right-8 text-sm font-medium text-gray-900">21.36%</div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Positive</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Neutral</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-300 rounded flex items-center justify-center">
                  <Minus className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Negative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAndAudienceSection;