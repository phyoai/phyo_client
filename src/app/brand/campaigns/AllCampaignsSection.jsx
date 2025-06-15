// components/AllCampaignsSection.jsx
'use client'
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AllCampaignsSection = () => {
  // Sample campaign data
  const activeCampaigns = [
    {
      id: 1,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 2,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 3,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 4,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 5,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    }
  ];

  const campaignHistory = [
    {
      id: 1,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 2,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 3,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 4,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250'
    },
    {
      id: 5,
      brandName: 'Brand Name',
      status: 'Ongoing',
      budget: '$16.95',
      title: 'Hydration that delivers Energy',
      influencersInvited: 6,
      influencersAccepted: 2,
      image: '/api/placeholder/200/250',
      isGrayed: true
    }
  ];

  const CampaignCard = ({ campaign, isHistory = false }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${campaign.isGrayed ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">{campaign.brandName}</span>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{campaign.status}</span>
        </div>
      </div>

      {/* Product Image */}
      <div className="p-4">
        <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4">
          <div className="w-32 h-40 bg-gray-800 rounded-t-lg relative">
            {/* Bottle shape */}
            <div className="w-full h-full bg-gray-800 rounded-t-lg relative">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-blue-500 rounded-t"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                <div className="text-xs text-gray-800 font-bold text-center">BRAND<br/>LOGO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="mb-3">
          <span className="text-sm text-green-600 font-medium">Budget: {campaign.budget}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 mb-3">{campaign.title}</h3>

        {/* Stats */}
        <div className="space-y-1 text-xs text-gray-600">
          <div>Influencers Invited: {campaign.influencersInvited}</div>
          <div>Influencers Accepted: {campaign.influencersAccepted}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Campaigns</h1>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Create New Campaign
          </button>
        </div>

        {/* Active Campaigns Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900">Active Campaigns</h2>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium">
              View all
            </button>
          </div>

          {/* Active Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>

        {/* Campaigns History Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Campaigns History</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Campaign History Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {campaignHistory.map((campaign) => (
              <CampaignCard key={`history-${campaign.id}`} campaign={campaign} isHistory={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCampaignsSection;