'use client'
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Search, Bell, Heart, ChevronRight, ArrowLeft, Mic, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { influencerApi } from '@/api';
import { campaignApi } from '@/api';

// Commented out old components - will integrate with APIs later
// import CampaignReport from './CampaignReport';
// import TopInfluencer from './TopInfluencer';
// import PostTimeLine from './PostTimeLine'
// import InfluencersTable from './InfluencersTable'
// import EngagementSection from './EngagementSection'
// import PostLiveAndTotalViewsSection from './PostLiveAndTotalViewsSection'
// import BudgetAndAudienceSection from './BudgetAndAudienceSection'

function DashboardContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Top Influencers State
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [influencersLoading, setInfluencersLoading] = useState(true);
  const [influencersError, setInfluencersError] = useState(null);

  // Top Campaigns State
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState(null);

  // Color palette for avatars
  const colors = [
    'bg-red-400', 'bg-teal-600', 'bg-yellow-500', 'bg-blue-500', 'bg-teal-700',
    'bg-red-500', 'bg-blue-600', 'bg-teal-500', 'bg-yellow-600', 'bg-blue-400'
  ];

  const campaignGradients = [
    'from-teal-800 to-teal-900',
    'from-blue-800 to-blue-900',
    'from-purple-800 to-purple-900'
  ];

  // Fetch top influencers
  useEffect(() => {
    const fetchTopInfluencers = async () => {
      try {
        setInfluencersLoading(true);
        setInfluencersError(null);
        const response = await influencerApi.getAllInfluencers({}, { page: 1, limit: 10 });
        setTopInfluencers(response.influencers || []);
      } catch (err) {
        console.error('Error fetching top influencers:', err);
        setInfluencersError(err?.message || 'Failed to load influencers');
        setTopInfluencers([]);
      } finally {
        setInfluencersLoading(false);
      }
    };

    fetchTopInfluencers();
  }, []);

  // Fetch top campaigns
  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        setCampaignsLoading(true);
        setCampaignsError(null);
        const response = await campaignApi.getAllCampaigns(
          { status: 'Active' },
          { page: 1, limit: 3 }
        );
        setTopCampaigns(response.campaigns || []);
      } catch (err) {
        console.error('Error fetching top campaigns:', err);
        setCampaignsError(err?.message || 'Failed to load campaigns');
        setTopCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchTopCampaigns();
  }, []);

  // Mock data - search suggestions
  const searchSuggestions = [
    "Discover lifestyle influencers who align with your brand values and can effectively p...",
    "Discover lifestyle influencers who align with your brand values and can effe...",
    "Discover lifestyle influencers who align with your brand values and..."
  ];

  // Handle search click - navigate to search page
  const handleSearchClick = () => {
    router.push('/influencer/influencer-search');
  };

  return (
    <>
      {/* Custom CSS for fade out transition */}
      <style jsx global>{`
        .fade-out-dashboard {
          animation: fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.98);
          }
        }
      `}</style>
      
      <div className={`h-full bg-[#FFFFFF] text-black transition-all duration-300 ${
        isFadingOut ? 'fade-out-dashboard' : ''
      }`}>
        {/* Sticky App Bar - Only Welcome header */}
        <div className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-gray-100">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Welcome Section */}
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Welcome!</h1>
                <p className="text-xs sm:text-sm text-gray-600">Search & Discover popular creators</p>
              </div>

              {/* Right Side - Notifications and Profile */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button 
                  onClick={() => router.push('/influencer/notifications')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                >
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  P
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search Bar - Clickable to activate search mode */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div 
              className="relative w-full max-w-full sm:max-w-[70%] md:max-w-[50%] cursor-pointer"
              onClick={handleSearchClick}
            >
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#808080]" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => e.preventDefault()}
                onClick={handleSearchClick}
                className="w-full pl-6 pr-12 py-3 bg-[#F0F0F0] rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {/* Search Suggestions */}
          <div className="flex flex-col items-center gap-2 mb-8 sm:mb-12">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-[#C5CBC2] text-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm cursor-pointer hover:bg-gray-400 transition-colors max-w-full sm:max-w-[600px] text-center"
                onClick={handleSearchClick}
              >
                {suggestion}
              </div>
            ))}
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Top Influencers</h2>
              <button
                onClick={() => router.push('/influencer/influencers')}
                className="flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                view all
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Loading State */}
            {influencersLoading && (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} className="flex flex-col items-center flex-shrink-0 animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-2" />
                    <div className="h-3 bg-gray-300 rounded w-12" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!influencersLoading && influencersError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{influencersError}</p>
              </div>
            )}

            {/* Horizontal Scroll of Influencers */}
            {!influencersLoading && !influencersError && (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {topInfluencers.map((influencer, index) => (
                  <div
                    key={influencer.id}
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                    onClick={() => router.push(`/influencer/influencers/${influencer.id}`)}
                  >
                    <div className={`w-16 h-16 ${colors[index % colors.length]} rounded-full flex items-center justify-center mb-2 overflow-hidden border-2 border-white shadow-sm`}>
                      <img
                        src={influencer.profileImage || influencer.avatar || '/dummyAvatar.jpg'}
                        alt={influencer.name || 'Influencer'}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-700 font-medium truncate max-w-16 text-center">
                      {influencer.name || influencer.username || 'Unknown'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!influencersLoading && !influencersError && topInfluencers.length === 0 && (
              <p className="text-sm text-gray-500">No influencers available</p>
            )}
          </div>

          {/* Top Campaigns Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Top Campaigns</h2>
              <button
                onClick={() => router.push('/influencer/campaigns')}
                className="flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                view all
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Loading State */}
            {campaignsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-300 rounded-2xl overflow-hidden h-64 animate-pulse" />
                ))}
              </div>
            )}

            {/* Error State */}
            {!campaignsLoading && campaignsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{campaignsError}</p>
              </div>
            )}

            {/* Campaigns Grid */}
            {!campaignsLoading && !campaignsError && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="bg-[#F0F0F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/influencer/campaigns/${campaign.id}`)}
                  >
                    {/* Campaign Header */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                          {campaign.brandId?.charAt(0).toUpperCase() || campaign.campaignName?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{campaign.campaignName}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement add to favorites
                        }}
                      >
                        <Heart className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Campaign Image */}
                    <div className={`relative h-40 bg-gradient-to-br ${campaignGradients[index % campaignGradients.length]} p-6 flex items-center justify-center`}>
                      {/* Decorative Elements */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 text-yellow-300 text-2xl">🎬</div>
                        <div className="absolute top-6 right-6 text-yellow-300 text-xl">🚀</div>
                        <div className="absolute bottom-6 left-6 text-yellow-300 text-2xl">☕</div>
                        <div className="absolute bottom-8 right-8 text-yellow-300 text-xl">👁️</div>
                        <div className="absolute top-1/2 left-1/4 text-white text-sm">★</div>
                        <div className="absolute top-1/3 right-1/3 text-white text-sm">✦</div>
                      </div>

                      {/* Main Text */}
                      <div className="relative z-10 text-center">
                        <h3 className="text-white text-2xl font-bold mb-1 leading-tight line-clamp-2">
                          {campaign.campaignName}
                        </h3>
                        <p className="text-white text-xs opacity-80">{campaign.campaignType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!campaignsLoading && !campaignsError && topCampaigns.length === 0 && (
              <p className="text-sm text-gray-500">No campaigns available</p>
            )}
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
    </>
  );
}

export default function BrandDashboard() {
  return <DashboardContent />;
}




