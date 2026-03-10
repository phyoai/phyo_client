'use client'
import React, { useState } from 'react';
import { SearchLine, Notification2Line } from '@phyoofficial/phyo-icon-library';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

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

function DashboardContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

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
                {t('search_discover')}
              </Caption>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <IconButton
                icon={Notification2Line}
                onClick={() => router.push('/brand/notifications')}
                size="md"
                className="relative"
              />
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base"
                style={{ backgroundColor: colors.brand.base }}
              >
                P
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: `${spacing.padding.section} ${spacing.padding.page}` }}>
          {/* Search Bar */}
          <div className="flex justify-center" style={{ marginBottom: spacing.margin.element }}>
            <div
              className="relative w-full max-w-full sm:max-w-[70%] md:max-w-[60%] cursor-pointer"
              onClick={handleSearchClick}
            >
              <SearchLine
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                style={{ color: colors.text.neutral.muted }}
              />
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
                }}
                readOnly
              />
            </div>
          </div>

          {/* Search Suggestions */}
          <div className="flex flex-col items-center gap-2 mb-8 sm:mb-12">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm cursor-pointer transition-colors max-w-full sm:max-w-[600px] text-center"
                style={{ backgroundColor: colors.neutral.muted, color: colors.text.neutral.base }}
                onClick={handleSearchClick}
              >
                {suggestion}
              </div>
            ))}
          </div>

          {/* Trending Influencers */}
          <TrendingInfluencersSection />

          {/* Top Campaigns */}
          <CampaignSection title={t('top_campaigns')} campaignsCount={3} />

          <InfluencerListSection title={t('influencers_near_you')} />

          <ExploreBrandsSection />

          <CampaignSection title={t('campaigns_near_you')} campaignsCount={2} />

          <InfluencerListSection title={t('influencers_near_you')} />

          <InlineConversionCard
            eyebrow={t('premium_access')}
            title={t('boost_your_reach')}
            description={t('upgrade_description')}
            primaryButtonText={t('get_pro')}
            secondaryButtonText={t('learn_more')}
          />

          <CampaignSection title={t('lifestyle_campaigns')} campaignsCount={3} />

          <InfluencerListSection title={t('lifestyle_creators')} />

          <InlineConversionCard
            eyebrow={t('premium_access')}
            title={t('boost_your_reach')}
            description={t('upgrade_description')}
            primaryButtonText={t('get_pro')}
            secondaryButtonText={t('learn_more')}
          />

          <CampaignSection title={t('sports_campaigns')} campaignsCount={3} />
        </div>
      </div>
    </>
  );
}

export default function BrandDashboard() {
  return <DashboardContent />;
}
