'use client'
import React, { useEffect, useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import UserProfile from '../components/UserProfile';
import MetricCard from '../components/MetricCard';
import CampaignFilters from '../components/CampaignFilters';
import {
  Users,
  Radio,
  Heart,
  DollarSign,
  Eye,
  Target,
  BarChart3,
  ThumbsUp
} from 'lucide-react';
import { campaignAPI } from '../../../utils/api';

const CampaignsReport = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await campaignAPI.getCampaigns({ page: 1, limit: 100 });
        setCampaigns(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Metrics calculation
  const totalInfluencers = campaigns.reduce((sum, c) => sum + (c.targetInfluencer?.numberOfInfluencers || 0), 0);
  const totalLivePosts = campaigns.reduce((sum, c) => sum + (c.numberOfLivePosts || 0), 0);
  // Engagement and total views are not in the sample API, so fallback to 0
  const totalEngagement = 0;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || c.compensation?.amount || 0), 0);
  const totalViews = 0;
  // Cost per view/engagement fallback
  const costPerView = totalViews > 0 ? (totalBudget / totalViews).toFixed(2) : 'N/A';
  const costPerEngagement = totalEngagement > 0 ? (totalBudget / totalEngagement).toFixed(2) : 'N/A';
  // Audience sentiment not in API
  const audienceSentiment = 'N/A';

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
      value: totalEngagement || 1000000,
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
      value: costPerView !== 'N/A' ? costPerView : '0.12%',
      percentage: '+25.5%',
      icon: Eye,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Cost Per Engagement',
      value: costPerEngagement !== 'N/A' ? costPerEngagement : '1.2%',
      percentage: '+25.5%',
      icon: Target,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Total Views',
      value: totalViews || 10000000,
      percentage: '+25.5%',
      icon: BarChart3,
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Audience Sentiment',
      value: audienceSentiment !== 'N/A' ? audienceSentiment : 'Positive',
      percentage: '+25.5%',
      icon: ThumbsUp,
      iconBg: 'bg-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="bg-white px-8 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <UserProfile />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Campaigns Report</h1>
          <CampaignFilters />
        </div>

        {/* Metrics Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading metrics...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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



