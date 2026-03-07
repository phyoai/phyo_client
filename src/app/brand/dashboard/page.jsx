'use client'
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { SearchLine, BellLine, HeartLine, ArrowRightLine, ArrowLeftLine, MicLine, MoreLine, Notification2Line } from '@phyoofficial/phyo-icon-library';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { BookmarkLine, YoutubeFill, InstagramFill, TwitterXLine, UserAddLine, Message3Line, FacebookFill } from '@phyoofficial/phyo-icon-library';

// Design System Components
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { colors } from '@/config/colors';
import { Heading, Paragraph, Caption } from '@/components/Typography';
import { spacing } from '@/components/Spacing';
import { elevation } from '@/components/Elevation';

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
      
      <div className={`h-full transition-all duration-300 ${
        isFadingOut ? 'fade-out-dashboard' : ''
      }`} style={{ backgroundColor: colors.neutral.base, color: colors.text.neutral.base }}>
        {/* Sticky App Bar - Only Welcome header */}
        <div className="sticky top-0 z-40 border-b" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted, padding: spacing.padding.normal }}>
          <div className="flex items-center justify-between">
            {/* Welcome Section */}
            <div>
              <Heading level={1} size="xl" weight="semibold" style={{ color: colors.text.neutral.base }}>
                {t('welcome')}
              </Heading>
              <Caption size="sm" style={{ color: colors.text.neutral.muted }}>
                {t('search_discover')}
              </Caption>
            </div>

            {/* Right Side - Notifications and Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              <IconButton
                icon={Notification2Line}
                onClick={() => router.push('/brand/notifications')}
                size="md"
                className="relative"
              />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base" style={{ backgroundColor: colors.brand.base }}>
                P
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div style={{ padding: `${spacing.padding.section} ${spacing.padding.page}` }}>
          {/* SearchLine Bar - Clickable to activate search mode */}
          <div className="flex justify-center" style={{ marginBottom: spacing.margin.element }}>
            <div
              className="relative w-full max-w-full sm:max-w-[70%] md:max-w-[60%] cursor-pointer"
              onClick={handleSearchClick}
            >
              <SearchLine className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.text.neutral.muted }} />
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => e.preventDefault()}
                onClick={handleSearchClick}
                className="w-full pl-6 pr-12 py-3 rounded-full border focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer"
                style={{
                  backgroundColor: colors.neutral.muted,
                  borderColor: colors.neutral.muted,
                  color: colors.text.neutral.base,
                  focusRingColor: colors.brand.base
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
    <div className="w-full h-full relative rounded-lg overflow-y-auto" style={{ backgroundColor: colors.neutral.base }}>
      {/* Yellow Background - Sticky at top */}
      <div className="sticky top-0 bg-yellow-400 h-[250px] sm:h-[300px] z-0">
        {/* Profile Image2Line - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pt-4 sm:pt-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400"></div>
          </div>
        </div>

        {/* Top Action Buttons - Overlaid */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <IconButton
            icon={ArrowLeftLine}
            size="md"
            variant="default"
            style={{ backgroundColor: colors.neutral.base }}
          />
          <div className="flex gap-2">
            <IconButton
              icon={BookmarkLine}
              onClick={() => setShowSaveModal(true)}
              size="md"
              variant="default"
              style={{ backgroundColor: colors.neutral.base }}
            />
            <div className="relative" ref={moreMenuRef}>
              <IconButton
                icon={MoreLine}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                size="md"
                variant="default"
                style={{ backgroundColor: colors.neutral.base }}
              />

              {/* More Menu Dropdown */}
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50" style={{ backgroundColor: colors.neutral.base }}>
                  <button className="w-full px-4 py-2 text-left text-sm transition-colors" style={{ color: colors.text.neutral.base }}>Report</button>
                  <button className="w-full px-4 py-2 text-left text-sm transition-colors" style={{ color: colors.text.neutral.base }}>Not interested</button>
                  <button className="w-full px-4 py-2 text-left text-sm transition-colors" style={{ color: colors.text.neutral.base }}>Share</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content - Card */}
      <div className="relative rounded-t-3xl -mt-8 z-10 shadow-lg" style={{ backgroundColor: colors.neutral.base }}>
        <div className="px-4 py-6 pb-20">
          {/* Username and Name */}
          <div className="mb-6">
            <p className="text-base font-semibold leading-6 tracking-[0.24px] mb-1" style={{ color: colors.text.neutral.muted }}>{influencer.username}</p>
            <h2 className="text-3xl font-bold leading-[40px] tracking-[-0.32px]" style={{ color: colors.text.neutral.base }}>{influencer.name}</h2>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors" style={{ backgroundColor: colors.brand.base, color: colors.ui.white }}>
              <FacebookFill className="w-5 h-5" />
              <span className="text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.followers}</span>
            </div>
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors" style={{ backgroundColor: colors.brand.base, color: colors.ui.white }}>
              <InstagramFill className="w-5 h-5" />
              <span className="text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.following}</span>
            </div>
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors" style={{ backgroundColor: colors.brand.base, color: colors.ui.white }}>
              <YoutubeFill className="w-5 h-5" />
              <span className="text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.posts}</span>
            </div>
          </div>

          {/* Location and Age */}
          <div className="flex gap-5 mb-6">
            <div className="flex-1">
              <p className="text-sm font-semibold leading-7 tracking-[-0.14px] mb-1" style={{ color: colors.text.neutral.base }}>Location</p>
              <span className="text-sm leading-6" style={{ color: colors.text.neutral.muted }}>{influencer.location}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-7 tracking-[-0.14px] mb-1" style={{ color: colors.text.neutral.base }}>Age</p>
              <span className="text-sm leading-6" style={{ color: colors.text.neutral.muted }}>{influencer.age}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold leading-7 tracking-[-0.14px] mb-2" style={{ color: colors.text.neutral.base }}>About</h3>
            <p className="text-sm leading-6 text-justify" style={{ color: colors.text.neutral.muted }}>
              {influencer.about}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons - Sticky at bottom */}
      <div className="sticky bottom-0 border-t px-4 py-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted }}>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" icon={UserAddLine} fullWidth>
            <span className="hidden sm:inline">Invite</span>
            <span className="sm:hidden">Invite</span>
          </Button>
          <Button variant="primary" size="sm" icon={Message3Line} fullWidth>
            <span className="hidden sm:inline">Message</span>
            <span className="sm:hidden">Message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BrandDashboard() {
  return <DashboardContent />;
}




