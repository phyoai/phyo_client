'use client'
import React, { useEffect, useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import UserProfile from '../components/UserProfile';
import MetricCard from '../components/MetricCard';
import {
  Users,
  Radio,
  Heart,
  DollarSign,
  Eye,
  Target,
  BarChart3,
  ThumbsUp,
  ChevronDown,
  Download
} from 'lucide-react';
import { campaignAPI, userAPI } from '../../../utils/api';

const CampaignsReport = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [campaignsResponse, userResponse] = await Promise.all([
          campaignAPI.getBrandCampaigns({ page: 1, limit: 100 }),
          userAPI.getUserProfile()
        ]);
        setCampaigns(campaignsResponse.data || []);
        setUser(userResponse.data || null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Metrics calculation
  const totalInfluencers = campaigns.reduce((sum, c) => sum + (c.targetInfluencer?.numberOfInfluencers || 0), 0);
  const totalLivePosts = campaigns.reduce((sum, c) => sum + (c.numberOfLivePosts || 0), 0);
  const totalEngagement = 0;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || c.compensation?.amount || 0), 0);
  const totalViews = 0;
  const costPerView = totalViews > 0 ? (totalBudget / totalViews).toFixed(2) : '0.12';
  const costPerEngagement = totalEngagement > 0 ? (totalBudget / totalEngagement).toFixed(2) : '1.2';

  const metrics = [
    {
      title: 'Influencers',
      value: totalInfluencers || 50,
      percentage: '+25.5%',
      icon: Users,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Post Live',
      value: totalLivePosts || 50,
      percentage: '+25.5%',
      icon: Radio,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Engagement',
      value: totalEngagement > 0 ? totalEngagement.toLocaleString() : '1M+',
      percentage: '+25.5%',
      icon: Heart,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Budget Spent',
      value: `${(totalBudget || 1200000).toLocaleString()}+`,
      percentage: '+25.5%',
      icon: DollarSign,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Cost Per View',
      value: `${costPerView}%`,
      percentage: '+25.5%',
      icon: Eye,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Cost Per Engagement',
      value: `${costPerEngagement}%`,
      percentage: '+25.5%',
      icon: Target,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Total Views',
      value: totalViews > 0 ? totalViews.toLocaleString() : '10M+',
      percentage: '+25.5%',
      icon: BarChart3,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Audience Sentiment',
      value: 'Positive',
      percentage: '+25.5%',
      icon: ThumbsUp,
      iconBg: 'bg-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F2EB]">
      {/* Top Navigation Bar */}
      <div className="bg-[#F3F2EB] px-8 py-4  border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-sm">
            <SearchBar placeholder="Search influencer" />
          </div>
          <UserProfile user={user} />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-2">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 bg-white p-5 rounded-3xl">
          <h1 className="text-3xl  font-semibold text-gray-900">Campaigns Report</h1>
          
          {/* Filters and Actions */}
          <div className="flex items-center gap-4">
            {/* LinkedIn Filter */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#F3F2EB]  rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span className="text-blue-600">in</span> LinkedIn
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Lifetime Filter */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#F3F2EB]  rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Lifetime
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* AI Campaign Analyser Button */}
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00B48A] to-[#00674F] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
              AI Campaign Analyser
            </button>

            {/* Download Button */}
            <button className="flex items-center justify-center w-10 h-10 bg-[#00674F] text-white rounded-lg hover:bg-teal-600 transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        {loading ? (
          // Metrics Cards Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-2xl">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12 font-medium">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg- p-6 rounded-2xl bg-white">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                percentage={metric.percentage}
                icon={metric.icon}
                iconBg={metric.iconBg}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsReport;

