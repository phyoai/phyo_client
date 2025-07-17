'use client'
import React from 'react';
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

const CampaignsReport = () => {
  const metrics = [
    {
      title: 'Influencers',
      value: '273k',
      percentage: '+25.5%',
      icon: Users,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Post Live',
      value: '23k',
      percentage: '+25.5%',
      icon: Radio,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Engagement',
      value: '73k',
      percentage: '+25.5%',
      icon: Heart,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Budget Spent',
      value: '783k',
      percentage: '+25.5%',
      icon: DollarSign,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Cost Per View',
      value: '60k',
      percentage: '+25.5%',
      icon: Eye,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Cost Per Engagement',
      value: '93k',
      percentage: '+25.5%',
      icon: Target,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Total Views',
      value: '13k',
      percentage: '+25.5%',
      icon: BarChart3,
      iconBg: 'bg-green-600'
    },
    {
      title: 'Audience Sentiment',
      value: '73k',
      percentage: '+25.5%',
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
      </div>
    </div>
  );
};

export default CampaignsReport;



