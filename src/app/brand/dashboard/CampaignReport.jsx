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
      value: totalInfluencers,
      percentage: '+0%',
      icon: Users,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Post Live',
      value: totalLivePosts,
      percentage: '+0%',
      icon: Radio,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Engagement',
      value: totalEngagement,
      percentage: '+0%',
      icon: Heart,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Budget Spent',
      value: totalBudget,
      percentage: '+0%',
      icon: DollarSign,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Cost Per View',
      value: costPerView,
      percentage: '+0%',
      icon: Eye,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Cost Per Engagement',
      value: costPerEngagement,
      percentage: '+0%',
      icon: Target,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Total Views',
      value: totalViews,
      percentage: '+0%',
      icon: BarChart3,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Audience Sentiment',
      value: audienceSentiment,
      percentage: '+0%',
      icon: ThumbsUp,
      iconBg: 'bg-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <UserProfile />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campaigns Report</h1>
          <CampaignFilters />
        </div>

        {/* Metrics Grid */}
        {loading ? (
          <div className="text-center py-12">Loading metrics...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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



