'use client'
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Search, Bell, Heart, ChevronRight, ArrowLeft, Mic, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { BookmarkLine, YoutubeFill, InstagramFill, TwitterXLine, UserAddLine, Message3Line, FacebookFill } from '@phyoofficial/phyo-icon-library';

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
  const { t } = useLanguage();
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
    t('search_suggestion_1'),
    t('search_suggestion_2'),
    t('search_suggestion_3'),
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
      
      <div className={`h-full bg-[#FFFFFF] dark:bg-[#121212] text-black dark:text-white transition-all duration-300 ${
        isFadingOut ? 'fade-out-dashboard' : ''
      }`}>
        {/* Sticky App Bar - Only Welcome header */}
        <div className="sticky top-0 z-40 bg-[#FFFFFF] dark:bg-[#1e1e1e] border-b border-gray-100 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Welcome Section */}
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{t('welcome')}</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('search_discover')}</p>
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
          <div className="flex justify-center mb-2">
            <div 
              className="relative w-full max-w-full sm:max-w-[70%] md:max-w-[60%] cursor-pointer"
              onClick={handleSearchClick}
            >
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#808080]" />
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => e.preventDefault()}
                onClick={handleSearchClick}
                className="w-full pl-6 pr-12 py-3 bg-[#F0F0F0] dark:bg-[#2a2a2a] rounded-full border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer dark:text-white dark:placeholder-gray-400"
                readOnly
              />
            </div>
          </div>

          {/* Search Suggestions */}
          <div className="flex flex-col items-center gap-2 mb-8 sm:mb-12">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-[#C5CBC2] dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm cursor-pointer hover:bg-gray-400 dark:hover:bg-[#4a4a4a] transition-colors max-w-full sm:max-w-[600px] text-center"
                onClick={handleSearchClick}
              >
                {suggestion}
              </div>
            ))}
          </div>

          {/* Influencers near you */}
          <div className="mb-10">
            <SectionHeading
              title={t('influencers_near_you')}
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
                  onClick={() => router.push(`/brand/influencers/${influencer.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Top Campaigns Section */}
          <CampaignSection
            title={t('top_campaigns')}
            campaignsCount={3}
          />

          <InfluencerListSection
            title={t('influencers_near_you')}
          />

          <ExploreBrandsSection />

          <CampaignSection
            title={t('campaigns_near_you')}
            campaignsCount={2}
          />

          <InfluencerListSection
            title={t('influencers_near_you')}
          />

          <InlineConversionCard
            eyebrow={t('premium_access')}
            title={t('boost_your_reach')}
            description={t('upgrade_description')}
            primaryButtonText={t('get_pro')}
            secondaryButtonText={t('learn_more')}
          />

          <CampaignSection
            title={t('lifestyle_campaigns')}
            campaignsCount={3}
          />

          <InfluencerListSection
            title={t('lifestyle_creators')}
          />

          <InlineConversionCard
            eyebrow={t('premium_access')}
            title={t('boost_your_reach')}
            description={t('upgrade_description')}
            primaryButtonText={t('get_pro')}
            secondaryButtonText={t('learn_more')}
          />

          <CampaignSection
            title={t('sports_campaigns')}
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

// Influencer Profile Component for Modal
function InfluencerProfile({ influencer }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const moreMenuRef = useRef(null);

  // Sample lists data
  const [savedLists, setSavedLists] = useState([
    { id: 1, name: 'Favorites', initials: 'AB', color: '#0066ff' },
    { id: 2, name: 'Campaign 1', initials: 'AB', color: '#0066ff' }
  ]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const handleSaveToList = (listId) => {
    console.log('Saving to list:', listId);
    setShowSaveModal(false);
  };

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      const newList = {
        id: savedLists.length + 1,
        name: newListName,
        initials: 'AB',
        color: '#0066ff'
      };
      setSavedLists([...savedLists, newList]);
      setNewListName('');
      setShowNewListModal(false);
      setShowSaveModal(true);
    }
  };

  return (
    <div className="w-full h-full relative rounded-lg overflow-y-auto bg-white dark:bg-[#121212]">
      {/* Yellow Background - Sticky at top */}
      <div className="sticky top-0 bg-yellow-400 h-[250px] sm:h-[300px] z-0">
        {/* Profile Image - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pt-4 sm:pt-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400"></div>
          </div>
        </div>

        {/* Top Action Buttons - Overlaid */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
            >
              <BookmarkLine className="h-5 w-5" />
            </button>
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {/* More Menu Dropdown */}
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Report</button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Not interested</button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Share</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content - White card */}
      <div className="relative bg-white dark:bg-[#121212] rounded-t-3xl -mt-8 z-10 shadow-lg">
        <div className="px-4 py-6 pb-20">
          {/* Username and Name */}
          <div className="mb-6">
            <p className="text-[#808080] text-base font-semibold leading-6 tracking-[0.24px] mb-1">{influencer.username}</p>
            <h2 className="text-[#242527] dark:text-white text-3xl font-bold leading-[40px] tracking-[-0.32px]">{influencer.name}</h2>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <FacebookFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.followers}</span>
            </div>
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <InstagramFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.following}</span>
            </div>
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <YoutubeFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.posts}</span>
            </div>
          </div>

          {/* Location and Age */}
          <div className="flex gap-5 mb-6">
            <div className="flex-1">
              <p className="text-[#242527] dark:text-white text-sm font-semibold leading-7 tracking-[-0.14px] mb-1">Location</p>
              <span className="text-[#808080] text-sm leading-6">{influencer.location}</span>
            </div>
            <div className="flex-1">
              <p className="text-[#242527] dark:text-white text-sm font-semibold leading-7 tracking-[-0.14px] mb-1">Age</p>
              <span className="text-[#808080] text-sm leading-6">{influencer.age}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-[#242527] dark:text-white text-sm font-semibold leading-7 tracking-[-0.14px] mb-2">About</h3>
            <p className="text-[#808080] text-sm leading-6 text-justify">
              {influencer.about}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons - Sticky at bottom */}
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 px-4 py-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-4 py-2 bg-[#dae3d1] rounded-full text-[#43573b] text-sm font-semibold hover:bg-[#c9d9ba] transition-colors">
            <UserAddLine className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Invite</span>
            <span className="sm:hidden">Invite</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-4 py-2 bg-[#43573b] rounded-full text-white text-sm font-semibold hover:bg-[#374829] transition-colors">
            <Message3Line className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Message</span>
            <span className="sm:hidden">Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BrandDashboard() {
  return <DashboardContent />;
}




