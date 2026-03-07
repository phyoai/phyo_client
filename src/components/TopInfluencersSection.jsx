'use client';

import React, { useMemo } from 'react';
import InfluencerCard from './InfluencerCard';
import { LinkedinFillFillInstagramFillFillTwitterXLineXLineYoutubeFillFillFacebookFillFill } from '@phyoofficial/phyo-icon-library'; 
/**
 * TopInfluencersSection Component - SHARED
 * Consolidated from role-specific components
 * Displays a grid of influencers with optional customization
 */
const TopInfluencersSection = React.memo(({
  influencers = [],
  title = 'Top influencers',
  onViewAll,
  columnsClassName = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  loading = false,
}) => {
  const displayInflencers = useMemo(() => influencers, [influencers]);

  if (loading) {
    return (
      <div className="bg-[#F3F2EB] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-3xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!displayInflencers || displayInflencers.length === 0) {
    return (
      <div className="bg-[#F3F2EB] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">No influencers found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F2EB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 bg-neutral-base p-5 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              View all
            </button>
          )}
        </div>

        {/* Influencers Grid */}
        <div className={`grid ${columnsClassName} gap-6 bg-neutral-base p-6 sm:p-8 rounded-3xl shadow-sm`}>
          {displayInflencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              name={influencer.name}
              description={influencer.description}
              avatar={influencer.avatar}
              rating={influencer.rating}
              reviewCount={influencer.reviewCount}
              platforms={influencer.platforms}
              onViewProfile={influencer.onViewProfile}
              onSendMessage={influencer.onSendMessage}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

TopInfluencersSection.displayName = 'TopInfluencersSection';
export default TopInfluencersSection;
