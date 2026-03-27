'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import { metaApi } from '@/api/meta-api';

const InsightSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
    <div className="grid grid-cols-4 gap-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default function CampaignInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncHistory, setSyncHistory] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [granularity, setGranularity] = useState('daily');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const [insightsResponse, historyResponse] = await Promise.all([
          metaApi.getFacebookInsights({
            campaignId: 'all',
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            granularity
          }),
          metaApi.getSyncHistory()
        ]);

        setInsights(insightsResponse || []);
        setSyncHistory(historyResponse || []);
      } catch (err) {
        setError(err?.message || 'Failed to load campaign insights');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [dateRange, granularity]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const totalMetrics = insights.reduce(
    (acc, insight) => ({
      impressions: acc.impressions + (insight.impressions || 0),
      clicks: acc.clicks + (insight.clicks || 0),
      spend: acc.spend + (insight.spend || 0),
      purchases: acc.purchases + (insight.purchases || 0),
      conversionValue: acc.conversionValue + (insight.conversionValue || 0),
      engagement: acc.engagement + (insight.engagement || 0),
      reach: acc.reach + (insight.reach || 0),
    }),
    { impressions: 0, clicks: 0, spend: 0, purchases: 0, conversionValue: 0, engagement: 0, reach: 0 }
  );

  const calculateCPC = () => totalMetrics.clicks > 0 ? (totalMetrics.spend / totalMetrics.clicks).toFixed(2) : 0;
  const calculateCPM = () => totalMetrics.impressions > 0 ? (totalMetrics.spend / totalMetrics.impressions * 1000).toFixed(2) : 0;
  const calculateCTR = () => totalMetrics.impressions > 0 ? ((totalMetrics.clicks / totalMetrics.impressions) * 100).toFixed(2) : 0;
  const calculateRAS = () => totalMetrics.spend > 0 ? (totalMetrics.conversionValue / totalMetrics.spend).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/integrations/facebook" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Facebook Connection
          </a>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Campaign Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">View Facebook campaign performance data imported from Meta</p>
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

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Impressions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(totalMetrics.impressions / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spend</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalMetrics.spend.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Conversions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMetrics.purchases}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total ROAS</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{calculateRAS()}x</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPC</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${calculateCPC()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPM</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${calculateCPM()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CTR</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateCTR()}%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reach</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(totalMetrics.reach / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Insights Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Campaign Performance Timeline</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Impressions</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Clicks</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Spend</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Purchases</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Value</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4">
                      <InsightSkeleton />
                    </td>
                  </tr>
                ) : insights.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No insights data available for the selected date range
                    </td>
                  </tr>
                ) : (
                  insights.map((insight, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {new Date(insight.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {(insight.impressions / 1000).toFixed(0)}K
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {insight.clicks}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                        ${insight.spend.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {insight.purchases}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-green-600 dark:text-green-400">
                        ${insight.conversionValue.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sync History */}
        {syncHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Sync History</h2>
            </div>

            <div className="space-y-2 p-6">
              {syncHistory.slice(0, 5).map((sync) => (
                <div key={sync.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Synced {new Date(sync.syncedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {sync.recordsImported} records imported • {sync.status}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sync.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                      : sync.status === 'failed'
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
                      : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {sync.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
