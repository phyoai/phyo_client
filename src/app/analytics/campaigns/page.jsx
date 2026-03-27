'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, ArrowLeft, Search, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import { analyticsApi } from '@/api/analytics-api';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const CampaignSkeleton = () => (
  <tr className="border-b border-gray-200 dark:border-gray-700 animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
  </tr>
);

export default function CampaignPerformance() {
  const { isMobile } = useMobileOptimization();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('reach');
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await analyticsApi.getCampaignAnalytics({
          ...dateRange,
          page,
          limit: 20
        });

        let filtered = response.campaigns || [];

        if (statusFilter) {
          filtered = filtered.filter(c => c.status === statusFilter);
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(c =>
            c.campaignName.toLowerCase().includes(query)
          );
        }

        // Sort campaigns
        if (sortBy === 'reach') {
          filtered.sort((a, b) => b.reach - a.reach);
        } else if (sortBy === 'roi') {
          filtered.sort((a, b) => b.roi - a.roi);
        } else if (sortBy === 'engagement') {
          filtered.sort((a, b) => b.engagementRate - a.engagementRate);
        }

        setCampaigns(filtered);
        setPagination(response.pagination || {});
        setSummary(response.summary || {});
      } catch (err) {
        setError(err?.message || 'Failed to load campaign analytics');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [dateRange, page]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200';
      case 'paused':
        return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const handleExport = async () => {
    try {
      const result = await analyticsApi.exportAnalytics({
        type: 'campaigns',
        format: 'csv',
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
    } catch (err) {
      setError('Failed to export data');
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
          <Link href="/analytics/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Campaign Performance</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track and compare campaign metrics and ROI</p>
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

        {/* Summary Stats */}
        {summary && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Total Reach</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(summary.totalReach || 0)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Total Impressions</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(summary.totalImpressions || 0)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Total Conversions</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(summary.totalConversions || 0)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Avg Engagement</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">{((summary.averageEngagementRate || 0) * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Total ROI</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">{((summary.totalROI || 0) * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-4 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Date Range - Stack on mobile */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full px-2 sm:px-3 py-2 h-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full px-2 sm:px-3 py-2 h-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="reach">Sort by Reach</option>
              <option value="roi">Sort by ROI</option>
              <option value="engagement">Sort by Engagement</option>
            </select>

            {/* Export */}
            <button
              onClick={handleExport}
              className="h-10 px-3 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <Download className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search campaigns by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Campaigns - Table on desktop, Stacked cards on mobile */}
        {!isMobile ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Campaign Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Reach</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Impressions</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Engagement</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Conversions</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">ROI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <CampaignSkeleton />
                  <CampaignSkeleton />
                  <CampaignSkeleton />
                </>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No campaigns found matching your filters
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{campaign.campaignName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(campaign.reach)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-gray-600 dark:text-gray-400">{formatNumber(campaign.impressions)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(campaign.engagementRate * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-gray-600 dark:text-gray-400">{formatNumber(campaign.conversions)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {campaign.roi > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400 rotate-180" />
                        )}
                        <span className={`font-semibold ${campaign.roi > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {(campaign.roi * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        ) : (
          // Mobile: Stacked cards view
          <div className="space-y-3">
            {loading ? (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </>
            ) : campaigns.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No campaigns found matching your filters</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{campaign.campaignName}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-gray-600 dark:text-gray-400">Reach</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(campaign.reach)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-gray-600 dark:text-gray-400">Impressions</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(campaign.impressions)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-gray-600 dark:text-gray-400">Engagement</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{(campaign.engagementRate * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-gray-600 dark:text-gray-400">ROI</p>
                      <p className={`font-semibold flex items-center gap-1 ${campaign.roi > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {campaign.roi > 0 ? '+' : ''}{(campaign.roi * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!pagination.hasPreviousPage}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === p
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
