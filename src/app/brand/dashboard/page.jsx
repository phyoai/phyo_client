'use client'
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Search, Bell, Heart, ChevronRight, ArrowLeft, Mic, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dashboard Section Components
import TrendingInfluencersSection from './sections/TrendingInfluencersSection';
import ExploreBrandsSection from './sections/ExploreBrandsSection';
import CampaignSection from './sections/CampaignSection';
import InfluencerListSection from './sections/InfluencerListSection';
import InlineConversionCard from './sections/InlineConversionCard';

// Reusable Components
import SectionHeading from '@/components/SectionHeading';
import CampaignCard from '@/components/cards/CampaignCard';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';

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
      router.push('/brand/influencer-search');
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
                  onClick={() => router.push('/brand/notifications')}
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

          {/* Influencers near you */}
          <div className="mb-10">
            <SectionHeading 
              title="Influencers near you" 
              onViewAll={() => router.push('/brand/influencers')}
            />

            {/* Horizontal Scroll of Influencers */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {topInfluencers.map((influencer) => (
                <InfluencerAvatar
                  key={influencer.id}
                  name={influencer.name}
                  avatar={influencer.avatar}
                  bgColor={influencer.color}
                  onClick={() => router.push(`/brand/influencer/${influencer.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Top Campaigns Section */}
          <CampaignSection 
            title="Top Campaigns"
            campaignsCount={3}
          />

          {/* Influencers near you */}
          <InfluencerListSection 
            title="Influencers near you"
          />

          {/* Explore Brands Section */}
          <ExploreBrandsSection />

          {/* Campaigns Near you */}
          <CampaignSection 
            title="Campaigns Near you"
            campaignsCount={2}
          />

          {/* Influencers near you */}
          <InfluencerListSection 
            title="Influencers near you"
          />

          {/* Conversion Card 1 */}
          <InlineConversionCard />

          {/* Lifestyle campaingns */}
          <CampaignSection 
            title="Lifestyle campaingns"
            campaignsCount={3}
          />

          {/* Lifestyle creators */}
          <InfluencerListSection 
            title="Lifestyle creators"
          />

          {/* Conversion Card 2 */}
          <InlineConversionCard 
            eyebrow="PREMIUM ACCESS"
            title="Boost your reach"
            description="Upgrade to Influencer Pro or Brand Premium to unlock exclusive analytics and campaigns."
            primaryButtonText="Get Pro"
            secondaryButtonText="Learn more"
          />

          {/* Sports Campaigns */}
          <CampaignSection 
            title="Sports Campaigns"
            campaignsCount={3}
          />
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




