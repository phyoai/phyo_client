'use client'
import React, { Suspense, useState } from 'react';
import { Search, Bell, Heart, ChevronRight } from 'lucide-react';

// Commented out old components - will integrate with APIs later
// import CampaignReport from './CampaignReport';
// import TopInfluencer from './TopInfluencer';
// import PostTimeLine from './PostTimeLine'
// import InfluencersTable from './InfluencersTable'
// import EngagementSection from './EngagementSection'
// import PostLiveAndTotalViewsSection from './PostLiveAndTotalViewsSection'
// import BudgetAndAudienceSection from './BudgetAndAudienceSection'

function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with API calls
  const searchSuggestions = [
    "Discover lifestyle influencers who align with your brand values and can effectively p...",
    "Discover lifestyle influencers who align with your brand values and can effe...",
    "Discover lifestyle influencers who align with your brand values and..."
  ];

  const topInfluencers = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Swagdeep',
    avatar: '/dummyAvatar.jpg',
    color: ['bg-red-400', 'bg-teal-600', 'bg-yellow-500', 'bg-blue-500', 'bg-teal-700', 'bg-red-500', 'bg-blue-600', 'bg-teal-500', 'bg-yellow-600', 'bg-blue-400'][i % 10]
  }));

  const topCampaigns = Array(3).fill(null).map((_, i) => ({
    id: i + 1,
    brandName: 'Lenskart',
    brandInitials: 'AB',
    timeAgo: '3d ago',
    bgColor: 'from-teal-800 to-teal-900'
  }));

  return (
    <div className='min-h-screen bg-[#FFFFFF] text-black mb-3'>
      {/* Header Section */}
      <div className="bg-[#FFFFFF] px-8">
        <div className="flex items-center justify-between mb-6 py-2">
          {/* Welcome Section */}
          <div >
            <h1 className="text-2xl font-semibold text-gray-900">Welcome!</h1>
            <p className="text-sm text-gray-600">Search & Discover popular creators</p>
          </div>

          {/* Right Side - Notifications and Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
              P
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-[50%]">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#808080]" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-4 py-3 bg-[#F0F0F0] rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Suggestions */}
        <div className="flex flex-col items-center gap-2 mb-8">
          {searchSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-[#C5CBC2] text-gray-700 px-6 py-2.5 rounded-full text-sm cursor-pointer hover:bg-gray-400 transition-colors max-w-[600px] text-center"
            >
              {suggestion}
            </div>
          ))}
        </div>

        {/* Top Influencers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Top Influencers</h2>
            <button className="flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm">
              view all
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Horizontal Scroll of Influencers */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {topInfluencers.map((influencer) => (
              <div key={influencer.id} className="flex flex-col items-center flex-shrink-0">
                <div className={`w-16 h-16 ${influencer.color} rounded-full flex items-center justify-center mb-2`}>
                  <img 
                    src={influencer.avatar} 
                    alt={influencer.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-700 font-medium">{influencer.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Campaigns Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Top Campaigns</h2>
            <button className="flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm">
              view all
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-[#F0F0F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Campaign Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {campaign.brandInitials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.brandName}</h3>
                      <p className="text-xs text-gray-500">{campaign.timeAgo}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Campaign Image */}
                <div className={`relative h-[60%] bg-gradient-to-br ${campaign.bgColor} p-6 flex items-center justify-center`}>
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 opacity-20 ">
                    <div className="absolute top-4 left-4 text-yellow-300 text-2xl">🎬</div>
                    <div className="absolute top-6 right-6 text-yellow-300 text-xl">🚀</div>
                    <div className="absolute bottom-6 left-6 text-yellow-300 text-2xl">☕</div>
                    <div className="absolute bottom-8 right-8 text-yellow-300 text-xl">👁️</div>
                    <div className="absolute top-1/2 left-1/4 text-white text-sm">★</div>
                    <div className="absolute top-1/3 right-1/3 text-white text-sm">✦</div>
                  </div>
                  
                  {/* Main Text */}
                  <div className="relative z-10 text-center ">
                    <h3 className="text-white text-3xl font-bold mb-2 leading-tight">
                      WE CREATE<br />STORIES NOT ADS
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Old components commented out - will integrate with APIs later */}
      {/* 
      <CampaignReport/>
      <TopInfluencer/>
      <PostTimeLine/>
      <InfluencersTable/>
      <EngagementSection/>
      <PostLiveAndTotalViewsSection/>
      <BudgetAndAudienceSection/>
      */}
    </div>
  );
}

export default function BrandDashboard() {
  return <DashboardContent />;
}




