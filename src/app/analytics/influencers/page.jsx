'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Star, ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { analyticsApi } from '@/api/analytics-api';

const InfluencerSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default function InfluencerMetrics() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nicheFilter, setNicheFilter] = useState('');
  const [sortBy, setSortBy] = useState('engagement');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState(null);
  const [niches, setNiches] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await analyticsApi.getInfluencerAnalytics({
          page,
          limit: 20,
          niche: nicheFilter || undefined
        });

        let filtered = response.influencers || [];

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(i =>
            i.influencerName.toLowerCase().includes(query) ||
            (i.niche && i.niche.toLowerCase().includes(query))
          );
        }

        // Extract unique niches for filter dropdown
        const uniqueNiches = [...new Set(filtered.map(i => i.niche).filter(Boolean))];
        setNiches(uniqueNiches);

        // Sort influencers
        if (sortBy === 'engagement') {
          filtered.sort((a, b) => b.engagementRate - a.engagementRate);
        } else if (sortBy === 'followers') {
          filtered.sort((a, b) => b.followers - a.followers);
        } else if (sortBy === 'reach') {
          filtered.sort((a, b) => b.reachPerPost - a.reachPerPost);
        } else if (sortBy === 'score') {
          filtered.sort((a, b) => b.performanceScore - a.performanceScore);
        }

        setInfluencers(filtered);
        setPagination(response.pagination || {});
        setSummary(response.summary || {});
      } catch (err) {
        setError(err?.message || 'Failed to load influencer analytics');
        console.error('Error fetching influencers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, nicheFilter]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200';
    if (score >= 75) return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200';
    return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/analytics/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Influencer Metrics</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze influencer performance and engagement</p>
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
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {((summary.averageEngagementRate || 0) * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Performance Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(summary.averagePerformanceScore || 0).toFixed(1)}/100
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Performer</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {summary.topPerformer?.influencerName || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Niche Filter */}
            <select
              value={nicheFilter}
              onChange={(e) => {
                setNicheFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Niches</option>
              {niches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="engagement">Sort by Engagement</option>
              <option value="followers">Sort by Followers</option>
              <option value="reach">Sort by Reach/Post</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search influencers by name or niche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Influencers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <InfluencerSkeleton />
              <InfluencerSkeleton />
              <InfluencerSkeleton />
            </>
          ) : influencers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No influencers found</p>
            </div>
          ) : (
            influencers.map((influencer) => (
              <div key={influencer.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{influencer.influencerName}</h3>
                    {influencer.niche && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{influencer.niche}</p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(influencer.performanceScore)}`}>
                    {influencer.performanceScore.toFixed(0)}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Followers</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(influencer.followers)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {(influencer.engagementRate * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reach/Post</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(influencer.reachPerPost)}</span>
                  </div>
                </div>

                {/* Social Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(influencer.avgLikes)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(influencer.avgComments)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Shares</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(influencer.avgShares)}</p>
                  </div>
                </div>

                {/* Campaign Info */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">{influencer.activeCampaigns} of {influencer.totalCampaigns} campaigns active</p>
                    <p className="text-gray-600 dark:text-gray-400">Revenue: ${(influencer.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <Star className="w-5 h-5 text-yellow-400 dark:text-yellow-300 fill-yellow-400 dark:fill-yellow-300" />
                </div>
              </div>
            ))
          )}
        </div>

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
