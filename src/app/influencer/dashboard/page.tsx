'use client';

import { useEffect, useState } from 'react';
import { campaignService, influencerService, userService, type Campaign } from '@/services';
import { useApiQuery } from '@/hooks/useApi';
import { TopCampaigns, CategoryCampaigns, ExploreBrands } from '@/components/features';
import { Briefcase, TrendingUp, Users, Award, Clock } from 'lucide-react';

export default function InfluencerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalEarnings: 0,
    collaborations: 0,
    averageEngagement: 0
  });

  // Fetch user profile
  const { data: profileData } = useApiQuery(() => userService.getProfile(), []);

  // Fetch campaigns
  const { data: campaignsData } = useApiQuery(
    () => campaignService.getCampaigns({ page: 1, limit: 10 }),
    []
  );

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (campaignsData?.data) {
      const campaigns = campaignsData.data as Campaign[];
      setStats({
        activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
        totalEarnings: campaigns.reduce((sum, c) => sum + (c.budget || 0), 0),
        collaborations: campaigns.length,
        averageEngagement: 4.5
      });
    }
  }, [campaignsData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Profile */}
        <div className="mb-8 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-6">
            {/* Profile Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                {profile?.firstName?.charAt(0)}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{profile?.email}</p>
              <div className="flex gap-4 mt-4">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Edit Profile
                </button>
                <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  View Public Profile
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-shrink-0 text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Joined 6 months ago</p>
              <p className="text-2xl font-bold text-green-600 mt-2">⭐ 4.8/5.0</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Campaigns */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.activeCampaigns}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  ${(stats.totalEarnings / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Collaborations */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Collaborations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.collaborations}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Average Engagement */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Engagement</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.averageEngagement}%
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'campaigns', label: 'Available Campaigns' },
            { id: 'brands', label: 'Explore Brands' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Available Campaigns */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Available Campaigns For You
                </h2>
                <TopCampaigns limit={4} type="active" />
              </div>

              {/* Featured Categories */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Browse By Category</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CategoryCampaigns
                    category="lifestyle"
                    categoryLabel="Lifestyle"
                    icon="🌟"
                    limit={3}
                  />
                  <CategoryCampaigns category="sports" categoryLabel="Sports" icon="⚽" limit={3} />
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all">
                  <Clock className="w-8 h-8 mb-2" />
                  <h3 className="font-bold text-lg">Deadlines Coming</h3>
                  <p className="text-sm opacity-90 mt-2">2 campaigns closing soon</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all">
                  <Award className="w-8 h-8 mb-2" />
                  <h3 className="font-bold text-lg">Performance</h3>
                  <p className="text-sm opacity-90 mt-2">Check your engagement stats</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all">
                  <Users className="w-8 h-8 mb-2" />
                  <h3 className="font-bold text-lg">Brand Requests</h3>
                  <p className="text-sm opacity-90 mt-2">3 brands interested in you</p>
                </div>
              </div>
            </div>
          )}

          {/* Available Campaigns Tab */}
          {selectedTab === 'campaigns' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Available Campaigns</h2>
              <TopCampaigns limit={12} type="active" />
            </div>
          )}

          {/* Explore Brands Tab */}
          {selectedTab === 'brands' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Explore Brands</h2>
              <ExploreBrands limit={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
