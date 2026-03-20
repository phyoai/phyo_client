'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDashboardAnalytics,
  getAllCampaignAnalytics,
  getProfileAnalytics,
  setDateRange,
} from '@/store/slices/analyticsSlice';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const dispatch = useDispatch();

  const { dashboardAnalytics, campaignAnalytics, profileAnalytics, loading, dateRange } =
    useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(getDashboardAnalytics(dateRange));
    dispatch(getAllCampaignAnalytics(dateRange));
    dispatch(getProfileAnalytics(dateRange));
  }, [dispatch, dateRange]);

  const handleDateChange = (type, date) => {
    const newRange = { ...dateRange };
    if (type === 'start') {
      newRange.startDate = date;
    } else {
      newRange.endDate = date;
    }
    dispatch(setDateRange(newRange));
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 size={32} />
            Analytics
          </h1>
          <p className="text-gray-600 mt-2">Track your performance and insights</p>
        </div>

        {/* Date Range Filter */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Metrics */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <p className="text-gray-600 text-sm font-medium">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(dashboardAnalytics?.totalViews || profileAnalytics?.totalViews)}
                  </p>
                </Card>

                <Card className="p-6">
                  <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(
                      dashboardAnalytics?.totalClicks || profileAnalytics?.totalClicks
                    )}
                  </p>
                </Card>

                <Card className="p-6">
                  <p className="text-gray-600 text-sm font-medium">Conversions</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatNumber(
                      dashboardAnalytics?.totalConversions || profileAnalytics?.totalConversions
                    )}
                  </p>
                </Card>

                <Card className="p-6">
                  <p className="text-gray-600 text-sm font-medium">Engagement Rate</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {(
                      dashboardAnalytics?.engagementRate ||
                      profileAnalytics?.engagementRate ||
                      0
                    ).toFixed(1)}
                    %
                  </p>
                </Card>
              </div>
            </div>

            {/* Campaign Analytics */}
            {campaignAnalytics && campaignAnalytics.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Performance</h2>
                <div className="grid grid-cols-1 gap-6">
                  {campaignAnalytics.slice(0, 5).map((campaign) => (
                    <Card key={campaign.campaignId} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {campaign.campaignName}
                        </h3>
                        <span className="text-xs font-medium text-gray-500">
                          {campaign.period}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Views</p>
                          <p className="font-semibold text-gray-900">
                            {formatNumber(campaign.totalViews)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Clicks</p>
                          <p className="font-semibold text-gray-900">
                            {formatNumber(campaign.totalClicks)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Conversions</p>
                          <p className="font-semibold text-gray-900">
                            {formatNumber(campaign.totalConversions)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Engagement</p>
                          <p className="font-semibold text-gray-900">
                            {campaign.engagementRate?.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Analytics */}
            {profileAnalytics && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <p className="text-gray-600 text-sm font-medium">Profile Name</p>
                    <p className="text-xl font-semibold text-gray-900 mt-2">
                      {profileAnalytics.profileName}
                    </p>
                  </Card>

                  <Card className="p-6">
                    <p className="text-gray-600 text-sm font-medium">Followers</p>
                    <p className="text-xl font-semibold text-gray-900 mt-2">
                      {formatNumber(profileAnalytics.followers)}
                    </p>
                  </Card>

                  <Card className="p-6">
                    <p className="text-gray-600 text-sm font-medium">Growth</p>
                    <p className="text-xl font-semibold text-green-600 mt-2">
                      +{profileAnalytics.growth?.toFixed(1) || 0}%
                    </p>
                  </Card>

                  <Card className="p-6">
                    <p className="text-gray-600 text-sm font-medium">Avg Engagement</p>
                    <p className="text-xl font-semibold text-blue-600 mt-2">
                      {profileAnalytics.avgEngagement?.toFixed(1) || 0}%
                    </p>
                  </Card>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!dashboardAnalytics && !profileAnalytics && (
              <Card className="p-12 text-center">
                <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
                <p className="text-gray-600">
                  Analytics data will appear here once campaigns are created and active.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
