'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import { getTrendingInfluencers } from '@/api/trending-nearby.api';

/**
 * Trending Influencers Section
 * Displays a horizontal scrollable list of trending influencers fetched from API
 */
export default function TrendingInfluencersSection() {
  const router = useRouter();
  const [trendingInfluencers, setTrendingInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color palette for avatar backgrounds
  const colors = [
    'bg-pink-500', 'bg-purple-600', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-red-500', 'bg-indigo-600', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500'
  ];

  // Fetch trending influencers on mount
  useEffect(() => {
    const fetchTrendingInfluencers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTrendingInfluencers({ limit: 10 });
        setTrendingInfluencers(response.influencers || []);
      } catch (err) {
        console.error('Error fetching trending influencers:', err);
        setError(err?.message || 'Failed to load trending influencers');
        // Fallback to empty array
        setTrendingInfluencers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingInfluencers();
  }, []);

  // Loading skeleton
  const SkeletonLoader = () => (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 animate-pulse">
          <div className="w-16 h-16 bg-gray-300 rounded-full" />
          <div className="h-3 bg-gray-300 rounded w-12" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="mb-8">
      <SectionHeading
        title="Trending Influencers"
        onViewAll={() => router.push('/brand/influencers')}
      />

      {/* Loading State */}
      {loading && <SkeletonLoader />}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Content - Horizontal Scroll of Influencers */}
      {!loading && !error && trendingInfluencers.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {trendingInfluencers.map((influencer, index) => (
            <InfluencerAvatar
              key={influencer.id}
              name={influencer.name || influencer.username || 'Unknown'}
              avatar={influencer.profileImage || influencer.avatar || '/dummyAvatar.jpg'}
              bgColor={colors[index % colors.length]}
              onClick={() => router.push(`/brand/influencers/${influencer.id}`)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && trendingInfluencers.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p className="text-sm">No trending influencers available</p>
        </div>
      )}
    </div>
  );
}
