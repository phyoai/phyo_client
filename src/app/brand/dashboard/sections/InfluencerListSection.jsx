import React from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';

/**
 * Influencer List Section Component
 * Reusable component for displaying horizontal scrolling influencer lists
 */
export default function InfluencerListSection({ 
  title, 
  eyebrow,
  showViewAll = true 
}) {
  const router = useRouter();

  // Mock data - will be replaced with API
  const influencers = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Swagdeep',
    avatar: '/dummyAvatar.jpg',
    color: [
      'bg-red-400', 'bg-teal-600', 'bg-yellow-500', 'bg-blue-500',
      'bg-teal-700', 'bg-red-500', 'bg-blue-600', 'bg-teal-500',
      'bg-yellow-600', 'bg-blue-400'
    ][i % 10]
  }));

  return (
    <div className="mb-8">
      <SectionHeading 
        title={title}
        eyebrow={eyebrow}
        showViewAll={showViewAll}
        onViewAll={() => router.push('/brand/influencers')}
      />

      {/* Horizontal Scroll of Influencers */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {influencers.map((influencer) => (
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
