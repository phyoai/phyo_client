'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Users, Target, Activity, DollarSign, Calendar } from 'lucide-react';
import { analyticsApi } from '@/api/analytics-api';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const MetricSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

const TrendSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
    <div className="space-y-3">
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default function AnalyticsDashboard() {
  const { isMobile } = useMobileOptimization();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await analyticsApi.getDashboardAnalytics(dateRange);
        setAnalytics(response);
      } catch (err) {
        setError(err?.message || 'Failed to load analytics dashboard');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const getMetricIcon = (label) => {
    switch (label) {
      case 'Total Campaigns':
        return <Target className="w-6 h-6 text-blue-600" />;
      case 'Total Influencers':
        return <Users className="w-6 h-6 text-purple-600" />;
      case 'Total Reach':
        return <Activity className="w-6 h-6 text-pink-600" />;
      case 'Total Engagement':
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'Conversion Rate':
        return <DollarSign className="w-6 h-6 text-yellow-600" />;
      case 'Average ROI':
        return <TrendingUp className="w-6 h-6 text-indigo-600" />;
      default:
        return <Activity className="w-6 h-6 text-gray-600" />;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Analytics Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track campaign performance and influencer metrics</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Date Range Filter */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
              <div className="flex-1 sm:flex-none">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full sm:w-auto px-3 py-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 sm:flex-none">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full sm:w-auto px-3 py-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {loading ? (
              <>
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
              </>
            ) : analytics?.metrics ? (
              Object.entries(analytics.metrics).map(([key, metric]) => (
                <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">{metric.label}</p>
                      <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(metric.value)}
                        {metric.unit && <span className="text-xs sm:text-sm ml-1">{metric.unit}</span>}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg flex-shrink-0">
                      {React.cloneElement(getMetricIcon(metric.label), { className: 'w-4 h-4 sm:w-6 sm:h-6' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {metric.changeDirection === 'up' ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400 font-medium">+{metric.change}%</span>
                      </>
                    ) : metric.changeDirection === 'down' ? (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-red-600 dark:text-red-400 font-medium">{metric.change}%</span>
                      </>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400 text-sm">No change</span>
                    )}
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>

        {/* Trends & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Top Campaigns */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Top Campaigns</h3>
            {loading ? (
              <TrendSkeleton />
            ) : analytics?.summary?.topCampaigns && analytics.summary.topCampaigns.length > 0 ? (
              <div className="space-y-3">
                {analytics.summary.topCampaigns.slice(0, 5).map((campaign, idx) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{campaign.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reach: {formatNumber(campaign.reach)}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {campaign.engagement} engagements
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">No campaign data available</p>
            )}
          </div>

          {/* Top Influencers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Influencers</h3>
            {loading ? (
              <TrendSkeleton />
            ) : analytics?.summary?.topInfluencers && analytics.summary.topInfluencers.length > 0 ? (
              <div className="space-y-3">
                {analytics.summary.topInfluencers.slice(0, 5).map((influencer, idx) => (
                  <div key={influencer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{influencer.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Followers: {formatNumber(influencer.followers)}</p>
                    </div>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {(influencer.engagementRate * 100).toFixed(2)}% engagement
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">No influencer data available</p>
            )}
          </div>
        </div>

        {/* Trends Charts Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trends</h3>
          {loading ? (
            <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ) : analytics?.trends && analytics.trends.length > 0 ? (
            <div className="space-y-6">
              {analytics.trends.map((trend, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{trend.title}</h4>
                    <div className="flex items-center gap-2">
                      {trend.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${trend.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trend.change}%
                      </span>
                    </div>
                  </div>
                  <div className="h-40 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Chart placeholder - {trend.data?.length || 0} data points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">No trend data available</p>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <a href="/analytics/campaigns" className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <h4 className="font-medium text-blue-900 dark:text-blue-200">Campaign Performance</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Detailed campaign metrics →</p>
          </a>
          <a href="/analytics/influencers" className="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
            <h4 className="font-medium text-purple-900 dark:text-purple-200">Influencer Metrics</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Influencer performance →</p>
          </a>
          <a href="/analytics/reports" className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
            <h4 className="font-medium text-green-900 dark:text-green-200">Monthly Reports</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">Period-based reports →</p>
          </a>
          <button className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
            <h4 className="font-medium text-indigo-900 dark:text-indigo-200">Export Data</h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">Download analytics →</p>
          </button>
        </div>
      </div>
    </div>
  );
}
