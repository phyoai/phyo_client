// components/BudgetAndAudienceSection.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, MoreHorizontal, Plus, Minus } from 'lucide-react';
import { campaignAPI } from '../../../utils/api';

const BudgetAndAudienceSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignAPI.getBrandCampaigns({ page: 1, limit: 100 });
        setCampaigns(response.data || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Calculate budget data from campaigns
  const calculateBudgetData = () => {
    if (campaigns.length === 0) {
      return [
        { date: 'Jan 12', amount: 30 },
        { date: 'Jan 18', amount: 55 },
        { date: 'Jan 20', amount: 75 },
        { date: 'Jan 23', amount: 180 },
        { date: 'Jan 27', amount: 65 },
        { date: 'Jan 28', amount: 90 },
        { date: 'Jan 29', amount: 60 }
      ];
    }

    // Group campaigns by date and sum budgets
    const budgetByDate = {};
    campaigns.forEach(campaign => {
      const date = new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const budget = campaign.budget || campaign.compensation?.amount || 0;
      if (budgetByDate[date]) {
        budgetByDate[date] += budget;
      } else {
        budgetByDate[date] = budget;
      }
    });

    // Convert to array format for chart
    return Object.entries(budgetByDate)
      .slice(-7) // Last 7 entries
      .map(([date, amount]) => ({ date, amount }));
  };

  const budgetData = calculateBudgetData();

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
    <div className="bg-[#F5F3EE] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 ">
          <h2 className="text-2xl font-bold text-gray-900 bg-white p-4 rounded-3xl">Budget Spent</h2>
          <h2 className="text-2xl font-bold text-gray-900 bg-white p-4 rounded-3xl">Audience Sentiment</h2>
        </div>

        {loading ? (
          // Budget and Audience Skeleton
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Spent Skeleton */}
            <div className="bg-white rounded-3xl p-8">
              <div className="bg-[#F3F2EB] p-6 border border-gray-200 shadow-sm rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audience Sentiment Skeleton */}
            <div className="bg-white rounded-3xl p-8">
              <div className="bg-[#F3F2EB] p-6 border border-gray-200 shadow-sm rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-1 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Money Spend Card */}

            <div className=' bg-white rounded-3xl p-8'>
            <div className="bg-[#F3F2EB]  p-6 border border-gray-200 shadow-sm rounded-3xl">
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
</div>


            {/* Audience Sentiment Card */}

            <div className=' bg-white rounded-3xl p-8'>
            <div className="bg-[#F3F2EB]  p-6 border border-gray-200 shadow-sm rounded-3xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Employee Structure</h3>
                <button className="text-white  bg-black p-1 rounded-lg">
                  <MoreHorizontal className="h-5 w-5 rotate-90" />
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
        )}
      </div>
    </div>
  );
};

export default BudgetAndAudienceSection;
