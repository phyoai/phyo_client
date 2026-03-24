import React from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';

/**
 * Trending Influencers Section
 * Displays a horizontal scrollable list of trending influencers
 */
export default function TrendingInfluencersSection() {
  const router = useRouter();

  // Mock data - will be replaced with API
  const trendingInfluencers = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Swagdeep',
    avatar: '/dummyAvatar.jpg',
    color: [
      'bg-pink-500', 'bg-purple-600', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-red-500', 'bg-indigo-600', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500'
    ][i % 10]
  }));

  return (
    <div className="mb-8">
      <SectionHeading 
        title="Trending Influencers" 
        onViewAll={() => router.push('/brand/influencers')}
      />

      {/* Horizontal Scroll of Influencers */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {trendingInfluencers.map((influencer) => (
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
  );
}
