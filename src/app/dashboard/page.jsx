'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardAnalytics } from '@/store/slices/analyticsSlice';
import { getMyCampaigns } from '@/store/slices/campaignSlice';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const dispatch = useDispatch();

  const { dashboardAnalytics, loading } = useSelector((state) => state.analytics);
  const { myCampaigns } = useSelector((state) => state.campaign);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(getDashboardAnalytics());
      dispatch(getMyCampaigns({ limit: 5 }));
    }
  }, [user?.id, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Campaigns</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardAnalytics?.totalCampaigns || 0}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium">Active Campaigns</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardAnalytics?.activeCampaigns || 0}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Budget</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${dashboardAnalytics?.totalBudget?.toLocaleString() || 0}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium">ROI</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {dashboardAnalytics?.roi?.toFixed(1) || 0}%
            </p>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Campaigns</h2>
            {myCampaigns.length === 0 ? (
              <p className="text-gray-500 text-sm">No campaigns yet</p>
            ) : (
              <div className="space-y-3">
                {myCampaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-xs text-gray-500">{campaign.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${campaign.budget?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top Influencers */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Influencers</h2>
            {dashboardAnalytics?.topInfluencers?.length === 0 ? (
              <p className="text-gray-500 text-sm">No influencers yet</p>
            ) : (
              <div className="space-y-3">
                {dashboardAnalytics?.topInfluencers?.slice(0, 5).map((influencer) => (
                  <div
                    key={influencer.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">{influencer.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-gray-200 rounded">
                        <div
                          className="h-1 bg-blue-500 rounded"
                          style={{ width: `${influencer.performance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-8 text-right">
                        {influencer.performance}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
