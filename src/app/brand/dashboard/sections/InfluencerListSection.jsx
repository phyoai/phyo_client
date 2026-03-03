import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import { influencerAPI } from '@/utils/api';

/**
 * Influencer List Section Component
 * Fetches and displays influencers dynamically
 */
export default function InfluencerListSection({
  title,
  eyebrow,
  limit = 10,
  showViewAll = true
}) {
  const router = useRouter();
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      try {
        const response = await influencerAPI.getInfluencers({ page: 1, limit });
        const influencersData = response.data || [];

        // Format and slice to limit
        const formattedInfluencers = influencersData
          .slice(0, limit)
          .map((influencer, index) => ({
            id: influencer.id,
            name: influencer.name || 'Influencer',
            avatar: influencer.avatar || '/dummyAvatar.jpg',
            color: getAvatarColor(index)
          }));

        setInfluencers(formattedInfluencers);
        setError(null);
      } catch (err) {
        console.error('Error fetching influencers:', err);
        setError('Failed to load influencers');
        setInfluencers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, [limit]);

  return (
    <div className="mb-8">
      <SectionHeading
        title={title}
        eyebrow={eyebrow}
        showViewAll={showViewAll}
        onViewAll={() => router.push('/brand/influencer-search')}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array(limit).fill(null).map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Horizontal Scroll of Influencers */}
      {!loading && !error && influencers.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {influencers.map((influencer, index) => (
            <InfluencerAvatar
              key={influencer.id || `influencer-${index}`}
              name={influencer.name}
              avatar={influencer.avatar}
              bgColor={influencer.color}
              onClick={() => router.push(`/brand/influencer/${influencer.id}`)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && influencers.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No influencers found</p>
        </div>
      )}
    </div>
  );
}

/**
 * Get a color for influencer avatar based on index
 */
function getAvatarColor(index) {
  const colors = [
    'bg-red-400',
    'bg-teal-600',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-teal-700',
    'bg-red-500',
    'bg-blue-600',
    'bg-teal-500',
    'bg-yellow-600',
    'bg-blue-400'
  ];
  return colors[index % colors.length];
}
