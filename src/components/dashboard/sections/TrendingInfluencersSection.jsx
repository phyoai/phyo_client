import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import { useAuth } from '@/app/context/AuthContext';
import { useInfluencers } from '@/hooks/useInfluencers';

/**
 * Trending Influencers Section
 * Displays a horizontal scrollable list of trending influencers
 */
export default function TrendingInfluencersSection() {
  const { getUserType } = useAuth();
  const role = (getUserType() || 'user').toLowerCase();
  const router = useRouter();

  // Redux influencers hook
  const { trendingInfluencers, loading, fetchTrendingInfluencers } = useInfluencers();

  // Format influencers with color coding
  const formattedInfluencers = (trendingInfluencers || []).slice(0, 10).map((influencer, index) => ({
    id: influencer._id || influencer.id || index,
    name: influencer.name || 'Influencer',
    avatar: influencer.avatar || '/dummyAvatar.jpg',
    color: [
      'bg-pink-500', 'bg-purple-600', 'bg-blue-500', 'bg-green-500',
      'bg-yellow-500', 'bg-red-500', 'bg-indigo-600', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500'
    ][index % 10]
  }));

  useEffect(() => {
    fetchTrendingInfluencers({ limit: 10 });
  }, [role]);

  return (
    <div className="mb-8">
      <SectionHeading
        title="Trending Influencers"
        onViewAll={() => router.push(`/${role}/influencers`)}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array(10).fill(null).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-[#262626] rounded-full flex-shrink-0 animate-pulse border border-white/5"
              />
          ))}
        </div>
      )}

      {/* Horizontal Scroll of Influencers */}
      {!loading && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {formattedInfluencers.length > 0 ? (
            formattedInfluencers.map((influencer) => (
              <InfluencerAvatar
                key={influencer.id}
                name={influencer.name}
                avatar={influencer.avatar}
                bgColor={influencer.color}
                onClick={() => router.push(`/${role}/influencers/${influencer.id}`)}
              />
            ))
          ) : (
            <p className="text-[#9A9A9A] text-sm">No trending influencers found</p>
          )}
        </div>
      )}
    </div>
  );
}
