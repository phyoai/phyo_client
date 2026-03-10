'use client'
import React, { useEffect, useState } from 'react';
import { SearchLine, Notification2Line } from '@phyoofficial/phyo-icon-library';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { useAuth } from '@/app/context/AuthContext';

// Design System Components
import { colors } from '@/config/colors';
import { Heading, Caption } from '@/components/Typography';
import { spacing } from '@/components/Spacing';
import IconButton from '@/components/IconButton';

// Dashboard Section Components
import TrendingInfluencersSection from './sections/TrendingInfluencersSection';
import ExploreBrandsSection from './sections/ExploreBrandsSection';
import CampaignSection from './sections/CampaignSection';
import InfluencerListSection from './sections/InfluencerListSection';
import InlineConversionCard from './sections/InlineConversionCard';

// Role-specific dashboard content
function BrandDashboardContent({ t, role }) {
  return (
    <>
      <TrendingInfluencersSection />
      <CampaignSection title={t('top_campaigns')} campaignsCount={3} role={role} />
      <InfluencerListSection title={t('influencers_near_you')} role={role}/>
      <ExploreBrandsSection role={role}/>
      <CampaignSection title={t('campaigns_near_you')} campaignsCount={2} role={role}/>
      <InfluencerListSection title={t('influencers_near_you')} role={role} />
      <InlineConversionCard
        eyebrow={t('premium_access')}
        title={t('boost_your_reach')}
        description={t('upgrade_description')}
        primaryButtonText={t('get_pro')}
        secondaryButtonText={t('learn_more')}
      />
      <CampaignSection title={t('lifestyle_campaigns')} campaignsCount={3} role={role} />
      <InfluencerListSection title={t('lifestyle_creators')} role={role}  />
      <InlineConversionCard
        eyebrow={t('premium_access')}
        title={t('boost_your_reach')}
        description={t('upgrade_description')}
        primaryButtonText={t('get_pro')}
        secondaryButtonText={t('learn_more')}
        role={role}
      />
      <CampaignSection title={t('sports_campaigns')} campaignsCount={3} role={role} />
    </>
  );
}

function InfluencerDashboardContent({ t, role }) {
  return (
    <>
      <TrendingInfluencersSection />
      <CampaignSection title={t('top_campaigns')} campaignsCount={3} role={role} />
      <InfluencerListSection title={t('influencers_near_you')} role={role}/>
      <CampaignSection title={t('campaigns_near_you')} campaignsCount={2} role={role}/>
      <InfluencerListSection title={t('influencers_near_you')} role={role} />
      <CampaignSection title={t('campaigns_near_you')} campaignsCount={2} role={role}/>
      <CampaignSection title={t('lifestyle_campaigns')} campaignsCount={3} role={role} />
      <InfluencerListSection title={t('lifestyle_creators')} role={role}  />
      <InlineConversionCard
        eyebrow={t('premium_access')}
        title={t('boost_your_reach')}
        description={t('upgrade_description')}
        primaryButtonText={t('get_pro')}
        secondaryButtonText={t('learn_more')}
      />
      <CampaignSection title={t('sports_campaigns')} campaignsCount={3} role={role} />
    </>
  );
}

function UserDashboardContent({ t, role }) {
  return (
    <>
      <TrendingInfluencersSection />
      <CampaignSection title={t('top_campaigns')} campaignsCount={3} role={role} />
      <InfluencerListSection title={t('influencers_near_you')} role={role} />
      <ExploreBrandsSection role={role} />
      <CampaignSection title={t('campaigns_near_you')} campaignsCount={2} role={role} />
      <InfluencerListSection title={t('influencers_near_you')} role={role} />
      <InlineConversionCard
        eyebrow={t('premium_access')}
        title={t('boost_your_reach')}
        description={t('upgrade_description')}
        primaryButtonText={t('get_pro')}
        secondaryButtonText={t('learn_more')}
      />
      <CampaignSection title={t('lifestyle_campaigns')} campaignsCount={3} role={role} />
      <InfluencerListSection title={t('lifestyle_creators')} role={role}  />
      <InlineConversionCard
        eyebrow={t('premium_access')}
        title={t('boost_your_reach')}
        description={t('upgrade_description')}
        primaryButtonText={t('get_pro')}
        secondaryButtonText={t('learn_more')}
      />
      <CampaignSection title={t('sports_campaigns')} campaignsCount={3} role={role} />
    </>
  );
}

const ROLE_CONFIG = {
  BRAND: {
    searchRoute: '/brand/influencer-search',
    notificationRoute: '/brand/notifications',
    subtitleKey: 'search_discover',
    maxSuggestions: 6,
    Content: BrandDashboardContent,
  },
  INFLUENCER: {
    searchRoute: '/influencer/campaigns/all-campaigns',
    notificationRoute: '/influencer/notifications',
    subtitleKey: 'search_discover',
    maxSuggestions: 6,
    Content: InfluencerDashboardContent,
  },
  USER: {
    searchRoute: '/user/influencer-search',
    notificationRoute: '/user/notifications',
    subtitleKey: 'search_discover',
    maxSuggestions: 3,
    Content: UserDashboardContent,
  },
};

const SEARCH_CREDIT_KEY = 'user_search_credits_used';
const MAX_USER_SEARCH_CREDITS = 3;

function DashboardContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const { getUserType, user, logout } = useAuth();
  const [searchQuery] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(0);

  const role = getUserType() || 'USER';
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.USER;
  const { Content } = config;

  const getCreditsUsed = () => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(SEARCH_CREDIT_KEY) || '0', 10);
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = parseInt(localStorage.getItem(SEARCH_CREDIT_KEY) || '0', 10);
      setCreditsUsed(stored);
    }
  }, []);

  const creditsLeft = Math.max(0, MAX_USER_SEARCH_CREDITS - creditsUsed);
  const isSearchLocked = role === 'USER' && creditsLeft === 0;

  const handleSearchClick = (query = '') => {
    if (role === 'USER') {
      const used = getCreditsUsed();
      if (used >= MAX_USER_SEARCH_CREDITS) {
        setShowUpgradeModal(true);
        return;
      }
      // localStorage.setItem(SEARCH_CREDIT_KEY, String(used + 1));
      const newUsed = used + 1;
      localStorage.setItem(SEARCH_CREDIT_KEY, String(newUsed));
      setCreditsUsed(newUsed);
    }
    setIsFadingOut(true);
    setTimeout(() => {
      const path = query && role === 'INFLUENCER'
        ? `${config.searchRoute}?q=${encodeURIComponent(query)}`
        : config.searchRoute;
      router.push(path);
    }, 300);
  };

  const allSuggestions = [
    t('search_suggestion_1'),
    t('search_suggestion_2'),
    t('search_suggestion_3'),
    t('search_suggestion_4'),
    t('search_suggestion_5'),
    t('search_suggestion_6'),
  ];
  const searchSuggestions = allSuggestions.slice(0, config.maxSuggestions);

  const userInitial = user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'P';

  return (
    <>
      <style jsx global>{`
        .fade-out-dashboard {
          animation: fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.98); }
        }
      `}</style>

      <div
        className={`h-full transition-all duration-300 ${isFadingOut ? 'fade-out-dashboard' : ''}`}
        style={{ backgroundColor: colors.neutral.base, color: colors.text.neutral.base }}
      >
        {/* Sticky App Bar */}
        <div
          className="sticky top-0 z-40 border-b"
          style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted, padding: spacing.padding.normal }}
        >
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1} size="xl" weight="semibold" style={{ color: colors.text.neutral.base }}>
                {t('welcome')}
              </Heading>
              <Caption size="sm" style={{ color: colors.text.neutral.muted }}>
                {t(config.subtitleKey)}
              </Caption>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <IconButton
                icon={Notification2Line}
                onClick={() => router.push(config.notificationRoute)}
                size="md"
                className="relative"
              />

              {/* Avatar + Dropdown */}
              <div className="relative">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base cursor-pointer"
                  style={{ backgroundColor: colors.brand.base }}
                  onClick={() => setIsProfileModalOpen((prev) => !prev)}
                >
                  {userInitial}
                </div>

                {isProfileModalOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileModalOpen(false)} />
                    <div
                      className="fixed top-16 right-4 w-56 rounded-xl shadow-lg z-50 overflow-hidden"
                      style={{ backgroundColor: colors.neutral.base, border: `1px solid ${colors.neutral.muted}` }}
                    >
                      {/* User info */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: colors.neutral.muted }}>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                          style={{ backgroundColor: colors.brand.base }}
                        >
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: colors.text.neutral.base }}>
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs truncate" style={{ color: colors.text.neutral.muted }}>
                            {user?.email || ''}
                          </p>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:opacity-70 transition-opacity"
                          style={{ color: colors.text.neutral.base }}
                          onClick={() => { setIsProfileModalOpen(false); router.push('/profile'); }}
                        >
                          <span className="text-sm">👤</span>
                          <span className="text-sm">Profile</span>
                        </button>
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:opacity-70 transition-opacity"
                          style={{ color: colors.text.neutral.base }}
                          onClick={() => { setIsProfileModalOpen(false); router.push('/settings'); }}
                        >
                          <span className="text-sm">⚙️</span>
                          <span className="text-sm">Settings</span>
                        </button>
                        <div className="border-t my-1" style={{ borderColor: colors.neutral.muted }} />
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:opacity-70 transition-opacity"
                          style={{ color: '#EF4444' }}
                          onClick={() => { setIsProfileModalOpen(false); logout(); }}
                        >
                          <span className="text-sm">🚪</span>
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: `${spacing.padding.section} ${spacing.padding.page}` }}>
          {/* Search Bar */}
          <div className="flex flex-col items-center" style={{ marginBottom: spacing.margin.element }}>
            <div
              className={`relative w-full max-w-full sm:max-w-[90%] md:max-w-[70%] ${isSearchLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => isSearchLocked ? setShowUpgradeModal(true) : handleSearchClick()}
            >
              <SearchLine
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                style={{ color: colors.text.neutral.muted }}
              />
              <input
                type="text"
                placeholder={isSearchLocked ? 'Upgrade to search more' : t('search')}
                value={searchQuery}
                onChange={(e) => e.preventDefault()}
                onClick={(e) => { e.stopPropagation(); isSearchLocked ? setShowUpgradeModal(true) : handleSearchClick(); }}
                className="w-full pl-6 pr-12 py-3 rounded-full border focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer"
                style={{
                  backgroundColor: colors.neutral.muted,
                  borderColor: colors.neutral.muted,
                  color: colors.text.neutral.base,
                }}
                readOnly
              />
            </div>

            {/* Credit indicator for USER role */}
            {role === 'USER' && (
              <p className="text-xs mt-2" style={{ color: colors.text.neutral.muted }}>
                {creditsLeft > 0
                  ? `${creditsLeft} free search${creditsLeft !== 1 ? 'es' : ''} remaining`
                  : 'No searches left — upgrade to continue'}
              </p>
            )}
          </div>

          {/* Search Suggestions */}
          <div className="flex flex-col items-center gap-2 mt-2 mb-8 sm:mb-12">
            {role !== 'INFLUENCER' &&
              searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition-colors max-w-full sm:max-w-[600px] text-center ${isSearchLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  style={{ backgroundColor: colors.neutral.muted, color: colors.text.neutral.base }}
                  onClick={() =>
                    isSearchLocked ? setShowUpgradeModal(true) : handleSearchClick(suggestion)
                  }
                >
                  {suggestion}
                </div>
              ))
            }
          </div>

          {/* Role-based sections */}
          <Content t={t} role={role} />
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowUpgradeModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 text-center"
            style={{ backgroundColor: colors.neutral.base }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.brand.base + '20' }}>
              <SearchLine className="w-7 h-7" style={{ color: colors.brand.base }} />
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: colors.text.neutral.base }}>
              Search limit reached
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.text.neutral.muted }}>
              You've used all {MAX_USER_SEARCH_CREDITS} free searches. Upgrade your plan to unlock unlimited searches.
            </p>
            <button
              className="w-full py-3 rounded-xl font-semibold text-white mb-3"
              style={{ backgroundColor: colors.brand.base }}
              onClick={() => { setShowUpgradeModal(false); router.push('/user/account/upgrade-plan'); }}
            >
              Upgrade Plan
            </button>
            <button
              className="w-full py-2 text-sm"
              style={{ color: colors.text.neutral.muted }}
              onClick={() => setShowUpgradeModal(false)}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
