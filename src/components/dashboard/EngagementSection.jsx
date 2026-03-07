'use client'
import React, { useState, memo, useCallback } from 'react';
import { LineChartLineResponsiveContainerTooltip } from 'recharts';
import { ArrowDownLine, ArrowUpLine } from '@phyoofficial/phyo-icon-library';

const EngagementSection = memo(({
  chartData = null,
  totalEngagement = 41122,
  dailyEngagement = 580000,
  engagementMetrics = null,
  selectedPeriod: initialPeriod = 'Year',
  periods = ['Year', 'Month', 'Week', 'Day'],
  onPeriodChange = null,
  backgroundColor = 'bg-[#F5F3EE]'
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  }, [onPeriodChange]);

  // Default chart data
  const defaultChartData = [
    { month: 'Jan', engagement: 35000 },
    { month: 'Feb', engagement: 38000 },
    { month: 'Mar', engagement: 42000 },
    { month: 'Apr', engagement: 39000 },
    { month: 'May', engagement: 41122 },
    { month: 'Jun', engagement: 40000 },
    { month: 'Jul', engagement: 43000 }
  ];

  const data = chartData || defaultChartData;

  // Default engagement metrics
  const defaultMetrics = [
    { label: 'Like', value: 234456 },
    { label: 'Comments', value: 12456 },
    { label: 'Engagement Rate', value: '2.34%' },
    { label: 'Cost Per Engagement', value: '$78' }
  ];

  const metrics = engagementMetrics || defaultMetrics;

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
    <div className={`${backgroundColor} py-8`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-4 rounded-3xl bg-neutral-base p-5">
          <h2 className="text-2xl font-bold text-gray-900">Engagement</h2>
        </div>
        <div className='bg-neutral-base p-6 rounded-3xl'>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Engagement Card */}
            <div className="bg-[#F3F2EB] rounded-3xl p-6 border border-gray-200 shadow-sm">
              {/* Header with Growth Indicator */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Total Engagement</h3>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUpLine className="h-4 w-4" />
                  <span className="text-sm font-medium">+465</span>
                </div>
              </div>

              {/* Main Metric */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{totalEngagement.toLocaleString()}k</span>
              </div>

              {/* Period Selector */}
              <div className="mb-6">
                <div className="relative inline-block">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm font-medium">{selectedPeriod}</span>
                    <ArrowDownLine className="h-4 w-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-32 bg-neutral-base border border-gray-200 rounded-lg shadow-lg z-10">
                      {periods.map((period) => (
                        <button
                          key={period}
                          onClick={() => handlePeriodChange(period)}
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
                  <LineChart data={data}>
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
                    {totalEngagement.toLocaleString()}
                  </div>
                  <div className="w-3 h-3 bg-green-600 rounded-full mx-auto mt-1"></div>
                  <div className="w-px h-4 bg-green-600 mx-auto border-dashed"></div>
                </div>
              </div>
            </div>

            {/* Daily Engagement Card */}
            <div className="bg-[#F3F2EB] rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Engagement</h3>

              {/* Main Metric */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{dailyEngagement.toLocaleString()}k</span>
              </div>

              {/* Metrics List */}
              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{metric.label}</span>
                    <span className="font-medium text-gray-900">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EngagementSection.displayName = 'EngagementSection';

export default EngagementSection;
