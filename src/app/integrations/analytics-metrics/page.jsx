'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, TrendingUp, RefreshCw, Download, Calendar, Activity } from 'lucide-react';
import { metaApi } from '@/api/meta-api';
import { analyticsApi } from '@/api/analytics-api';

const MetricSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
  </div>
);

const ComparisonSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function AnalyticsMetrics() {
  const [facebookMetrics, setFacebookMetrics] = useState([]);
  const [internalMetrics, setInternalMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [facebookResponse, internalResponse, dashboardResponse] = await Promise.all([
          metaApi.getFacebookMetrics({
            campaignId: 'all',
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
          analyticsApi.getCampaignAnalytics({
            page: 1,
            limit: 100,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
          metaApi.getMetaDashboard(),
        ]);

        setFacebookMetrics(facebookResponse || []);
        setInternalMetrics(internalResponse?.data || {});

        if (dashboardResponse?.lastSyncedAt) {
          setLastSyncTime(new Date(dashboardResponse.lastSyncedAt).toLocaleString());
        }
        setSyncStatus(dashboardResponse?.syncStatus || 'synced');
      } catch (err) {
        setError(err?.message || 'Failed to load analytics metrics');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [dateRange]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncStatus('syncing');
      await metaApi.syncFacebookMetrics('all');

      // Refresh metrics after sync
      const [facebookResponse, dashboardResponse] = await Promise.all([
        metaApi.getFacebookMetrics({
          campaignId: 'all',
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        metaApi.getMetaDashboard(),
      ]);

      setFacebookMetrics(facebookResponse || []);
      setSyncStatus(dashboardResponse?.syncStatus || 'synced');

      if (dashboardResponse?.lastSyncedAt) {
        setLastSyncTime(new Date(dashboardResponse.lastSyncedAt).toLocaleString());
      }
    } catch (err) {
      setError(err?.message || 'Failed to sync metrics');
      setSyncStatus('error');
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    try {
      await analyticsApi.exportAnalytics({
        format: 'csv',
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: 'facebook',
      });
    } catch (err) {
      setError('Failed to export metrics');
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  // Calculate totals
  const facebookTotals = facebookMetrics.reduce((acc, metric) => ({
    impressions: acc.impressions + (metric.impressions || 0),
    clicks: acc.clicks + (metric.clicks || 0),
    spend: acc.spend + (metric.spend || 0),
    purchases: acc.purchases + (metric.purchases || 0),
    conversionValue: acc.conversionValue + (metric.conversionValue || 0),
  }), { impressions: 0, clicks: 0, spend: 0, purchases: 0, conversionValue: 0 });

  const internalTotals = internalMetrics?.data?.reduce?.((acc, campaign) => ({
    reach: acc.reach + (campaign.reach || 0),
    engagement: acc.engagement + (campaign.engagement || 0),
    conversions: acc.conversions + (campaign.conversions || 0),
  }), { reach: 0, engagement: 0, conversions: 0 }) || { reach: 0, engagement: 0, conversions: 0 };

  // Calculate performance metrics
  const facebookCPC = facebookTotals.clicks > 0 ? (facebookTotals.spend / facebookTotals.clicks).toFixed(2) : 0;
  const facebookCPM = facebookTotals.impressions > 0 ? (facebookTotals.spend / facebookTotals.impressions * 1000).toFixed(2) : 0;
  const facebookCTR = facebookTotals.impressions > 0 ? ((facebookTotals.clicks / facebookTotals.impressions) * 100).toFixed(2) : 0;
  const facebookROAS = facebookTotals.spend > 0 ? (facebookTotals.conversionValue / facebookTotals.spend).toFixed(2) : 0;

  const internalEngagementRate = internalTotals.reach > 0 ? ((internalTotals.engagement / internalTotals.reach) * 100).toFixed(2) : 0;
  const internalConversionRate = internalMetrics?.meta?.totalCampaigns ? ((internalTotals.conversions / internalMetrics.meta.totalCampaigns) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/integrations/facebook" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Facebook Connection
          </a>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Metrics</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Compare Facebook campaign metrics with internal analytics data</p>
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

        {/* Sync Status & Controls */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                syncStatus === 'synced' ? 'bg-green-500' :
                'bg-red-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Sync Status: <span className="capitalize">{syncStatus}</span>
                </p>
                {lastSyncTime && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">Last synced: {lastSyncTime}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white text-sm rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-4">
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
          </div>
        </div>

        {/* Facebook Metrics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Facebook Ads Metrics</h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <MetricSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(facebookTotals.impressions / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">across all campaigns</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spend</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${facebookTotals.spend.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">budget allocated</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Conversions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{facebookTotals.purchases}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">purchases completed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg ROAS</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{facebookROAS}x</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">return on spend</p>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPC</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${facebookCPC}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">cost per click</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPM</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${facebookCPM}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">cost per 1K impressions</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CTR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{facebookCTR}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">click through rate</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{facebookTotals.clicks.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">click interactions</p>
            </div>
          </div>
        </div>

        {/* Internal Analytics Metrics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Internal Analytics Metrics</h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <MetricSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reach</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(internalTotals.reach / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">people reached</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Engagement</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(internalTotals.engagement / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">interactions</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{internalEngagementRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">of reach engaged</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{internalConversionRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">campaigns converting</p>
              </div>
            </div>
          )}
        </div>

        {/* Comparison View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Facebook Campaigns */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Facebook Campaigns</h3>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : facebookMetrics.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No Facebook campaign data available
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {facebookMetrics.slice(0, 10).map((metric, idx) => (
                  <div key={idx} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">{metric.campaignName}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Impressions:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{(metric.impressions / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Spend:</span>
                        <p className="font-medium text-gray-900 dark:text-white">${metric.spend.toFixed(0)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Conversions:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{metric.purchases}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">ROAS:</span>
                        <p className="font-medium text-green-600 dark:text-green-400">{metric.roas.toFixed(2)}x</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Campaigns Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Performing Campaigns</h3>
            </div>

            {loading ? (
              <div className="p-6">
                <ComparisonSkeleton />
              </div>
            ) : internalMetrics?.data?.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No internal campaign data available
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700 p-6 space-y-4">
                {internalMetrics?.data?.slice(0, 5).map((campaign, idx) => (
                  <div key={idx} className="pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{campaign.name}</p>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {campaign.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Reach:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{(campaign.reach / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Engagement:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{campaign.engagement}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Score:</span>
                        <p className="font-medium text-green-600 dark:text-green-400">{campaign.score || 0}/100</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Data Integration</h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
            This dashboard combines Facebook Ads Manager metrics with your internal platform analytics to provide a comprehensive view of campaign performance across channels.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-200 mb-2">Facebook Ads Data</p>
              <ul className="text-blue-800 dark:text-blue-300 space-y-1">
                <li>✓ Campaign impressions & clicks</li>
                <li>✓ Spend & cost metrics</li>
                <li>✓ Conversions & ROAS</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-200 mb-2">Platform Analytics</p>
              <ul className="text-blue-800 dark:text-blue-300 space-y-1">
                <li>✓ Reach & engagement metrics</li>
                <li>✓ Campaign performance scoring</li>
                <li>✓ Influencer participation data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
