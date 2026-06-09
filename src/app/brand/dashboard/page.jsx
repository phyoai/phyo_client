'use client'
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Search, Heart, ChevronRight, ArrowLeft, Mic, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { BookmarkLine, YoutubeFill, InstagramFill, TwitterXLine, UserAddLine, Message3Line, FacebookFill } from '@phyoofficial/phyo-icon-library';

// Dashboard Section Components
import TrendingInfluencersSection from './sections/TrendingInfluencersSection';
import ExploreBrandsSection from './sections/ExploreBrandsSection';
import CampaignSection from './sections/CampaignSection';
import InfluencerListSection from './sections/InfluencerListSection';
import NearbyCampaignsSection from './sections/NearbyCampaignsSection';
import InlineConversionCard from './sections/InlineConversionCard';


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

  const searchSuggestions = [
    t('search_suggestion_1'),
    t('search_suggestion_2'),
    t('search_suggestion_3'),
  ];

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
      
      <div className={`min-h-screen bg-[#000201] text-white transition-all duration-300 ${
        isFadingOut ? 'fade-out-dashboard' : ''
      }`}>
        {/* Scrollable Content Section */}
        <div className="pr-4 sm:pr-6 lg:pr-8 pt-6 pb-10" style={{ paddingLeft: 0 }}>

          {/* Search Bar */}
          <div className="relative mb-[17px] cursor-pointer" onClick={handleSearchClick}>
            <div className="absolute inset-0 rounded-full blur-[8px] border-2 border-[#16a34a] pointer-events-none" />
            <div className="relative flex items-center bg-[rgba(255,255,255,0.08)] backdrop-blur-[6px] rounded-full border-[0.8px] border-[#16a34a] overflow-hidden pr-[9.6px] py-[10px] pl-[19.6px] gap-3 h-[60px]">
              <span className="flex-1 text-[#9b9b9b] text-[16px] truncate leading-[1.6]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('search')} influencers (e.g. I need influencers in Mumbai)...
              </span>
              <button
                onClick={handleSearchClick}
                className="flex items-center gap-2 bg-[#16a34a] text-white rounded-[20px] pl-[40px] pr-[16px] py-[8px] text-[16px] font-normal shrink-0 relative h-[40px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Search className="absolute left-[10px] h-[24px] w-[24px]" />
                Search
              </button>
            </div>
          </div>

          {/* Prompt Suggestion Pills — pyramid: 640 / 580 / 520px, centered */}
          <div className="flex flex-col items-center gap-[8px] mb-[68px]">
            {[640, 580, 520].map((maxW, index) => (
              <div
                key={index}
                className="bg-[#181818] px-[12px] py-[8px] rounded-[64px] cursor-pointer hover:bg-[#222] transition-colors overflow-hidden"
                style={{ width: '100%', maxWidth: `${maxW}px` }}
                onClick={handleSearchClick}
              >
                <p
                  className="text-[14px] font-medium text-[#808080] leading-[20px] tracking-[0.2px] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  {searchSuggestions[index]}
                </p>
              </div>
            ))}
          </div>

          {/* Sections — gap-[32px] between each per Figma */}
          <div className="flex flex-col gap-[32px]">
            <TrendingInfluencersSection />

            <CampaignSection
              title={t('top_campaigns')}
              campaignsCount={3}
              showFilters
            />

            <ExploreBrandsSection />

            <InfluencerListSection title="Nearby Influencers" />

            <NearbyCampaignsSection />

            <InlineConversionCard
              eyebrow={t('premium_access')}
              title={t('boost_your_reach')}
              description={t('upgrade_description')}
              primaryButtonText={t('get_pro')}
              secondaryButtonText={t('learn_more')}
            />
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




