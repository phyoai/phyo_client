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
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.98); }
        }
      `}</style>

      <div className={`min-h-screen bg-[#000201] text-white transition-all duration-300 relative overflow-hidden ${
        isFadingOut ? 'fade-out-dashboard' : ''
      }`}>
        {/* Green ambient glow — Figma ellipse: rgba(22,163,74,0.28) blur(680px) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-308px',
            right: '-200px',
            width: 920,
            height: 926,
            background: 'rgba(22,163,74,0.28)',
            filter: 'blur(680px)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Scrollable Content Section */}
        <div className="pr-4 sm:pr-6 lg:pr-8 pt-6 pb-10 relative z-10" style={{ paddingLeft: 0 }}>

          {/* Search Bar — matches landing page style */}
          <div
            className="relative mb-[17px] cursor-pointer overflow-hidden rounded-full bg-[linear-gradient(270deg,#16A34A_0%,#FFFFFF_52.88%,#16A34A_100%)] p-[1px] shadow-[0_0_28px_rgba(22,163,74,0.45)]"
            onClick={handleSearchClick}
          >
            {/* Soft inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[#16A34A]/25 blur-l" />
            {/* Search box */}
            <div className="relative flex h-[72px] items-center gap-3 rounded-full bg-[#010a04]/90 px-5 py-2 backdrop-blur-md sm:pl-6 sm:pr-[10px]" style={{ boxShadow: 'inset 0 0 20px rgba(22, 163, 74, 0.1)' }}>
              <span className="min-w-0 flex-1 truncate text-left text-base leading-[1.6] text-[#9B9B9B] sm:text-[16px]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('search')} influencers (e.g. I need influencers in Mumbai)...
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleSearchClick(); }}
                className="inline-flex w-[115px] h-[48px] shrink-0 items-center gap-2 rounded-full bg-[#16A34A] px-3 text-base text-white transition duration-200 hover:bg-[#12803A]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Search className="h-6 w-6" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Prompt Suggestion Pills */}
          <div className="flex flex-col items-center gap-[8px] mb-[68px]">
            {[640, 580, 520].map((maxW, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 64,
                  background: '#181818',
                  width: '100%',
                  maxWidth: maxW,
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
                onClick={handleSearchClick}
              >
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  letterSpacing: '0.2px',
                  color: '#808080',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  margin: 0,
                }}>
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




