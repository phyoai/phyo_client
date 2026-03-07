'use client'
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { SearchLine, BellLine, HeartLine, ArrowRightLine, ArrowLeftLine, MicLine, MoreLine, Notification2Line } from '@phyoofficial/phyo-icon-library';
import { useRouter } from 'next/navigation';
import IconButton from '@/components/IconButton';
import { colors } from '@/config/colors';

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

  // Handle search bar click - fade out and navigate
  const handleSearchClick = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      router.push('/influencer/influencer-search');
    }, 300);
  };

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
      
      <div className={`h-full transition-all duration-300 ${
        isFadingOut ? 'fade-out-dashboard' : ''
      }`} style={{ backgroundColor: colors.neutral.base, color: colors.text.neutral.base }}>
        {/* Sticky App Bar - Only Welcome header */}
        <div className="sticky top-0 z-40 border-b" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted }}>
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Welcome Section */}
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: colors.text.neutral.base }}>Welcome!</h1>
                <p className="text-xs sm:text-sm" style={{ color: colors.text.neutral.muted }}>SearchLine & Discover popular creators</p>
              </div>

              {/* Right Side - Notifications and Profile */}
              <div className="flex items-center gap-2 sm:gap-4">
                <IconButton
                  icon={Notification2Line}
                  onClick={() => router.push('/influencer/notifications')}
                  size="md"
                />
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base" style={{ backgroundColor: colors.brand.base }}>
                  P
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* SearchLine Bar - Clickable to activate search mode */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div
              className="relative w-full max-w-full sm:max-w-[70%] md:max-w-[50%] cursor-pointer"
              onClick={handleSearchClick}
            >
              <SearchLine className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.text.neutral.muted }} />
              <input
                type="text"
                placeholder="SearchLine"
                value={searchQuery}
                onChange={(e) => e.preventDefault()}
                onClick={handleSearchClick}
                className="w-full pl-6 pr-12 py-3 rounded-full border focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer"
                style={{
                  backgroundColor: colors.neutral.muted,
                  borderColor: colors.neutral.muted,
                  color: colors.text.neutral.base
                }}
                readOnly
              />
            </div>
          </div>

          {/* SearchLine Suggestions */}
          <div className="flex flex-col items-center gap-2 mb-8 sm:mb-12">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm cursor-pointer transition-colors max-w-full sm:max-w-[600px] text-center"
                style={{
                  backgroundColor: colors.neutral.muted,
                  color: colors.text.neutral.base
                }}
                onClick={handleSearchClick}
              >
                {suggestion}
              </div>
            ))}
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: colors.text.neutral.base }}>Top Influencers</h2>
              <button
                onClick={() => router.push('/influencer/influencers')}
                className="flex items-center hover:opacity-80 font-medium text-sm transition-opacity"
                style={{ color: colors.brand.base }}
              >
                view all
                <ArrowRightLine className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Horizontal Scroll of Influencers */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {topInfluencers.map((influencer) => (
                <div key={influencer.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer" onClick={() => router.push(`/influencer/influencers/${influencer.id}`)}>
                  <div className={`w-16 h-16 ${influencer.color} rounded-full flex items-center justify-center mb-2`}>
                    <img
                      src={influencer.avatar}
                      alt={influencer.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: colors.text.neutral.base }}>{influencer.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Campaigns Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: colors.text.neutral.base }}>Top Campaigns</h2>
              <button className="flex items-center hover:opacity-80 font-medium text-sm transition-opacity" style={{ color: colors.brand.base }}>
                view all
                <ArrowRightLine className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCampaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: colors.neutral.muted }}>
                  {/* Campaign Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: colors.brand.base }}>
                        {campaign.brandInitials}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: colors.text.neutral.base }}>{campaign.brandName}</h3>
                        <p className="text-xs" style={{ color: colors.text.neutral.muted }}>{campaign.timeAgo}</p>
                      </div>
                    </div>
                    <IconButton icon={HeartLine} size="sm" variant="default" />
                  </div>

                  {/* Campaign Image2Line */}
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




