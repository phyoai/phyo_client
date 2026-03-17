'use client';

import { useEffect } from 'react';
import { useInfluencers } from '@/hooks/useInfluencers';
import { Loader } from 'lucide-react';

interface TrendingInfluencersProps {
  limit?: number;
  category?: string;
}

export default function TrendingInfluencers({ limit = 8, category }: TrendingInfluencersProps) {
  const { influencers, loading, error, fetchTrendingInfluencers } = useInfluencers();

  useEffect(() => {
    fetchTrendingInfluencers({ limit: limit || 8 });
  }, [limit, fetchTrendingInfluencers]);

  const displayedInfluencers = (influencers || []).slice(0, limit || 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedInfluencers.map((influencer: any) => (
          <div
            key={influencer.id}
            className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* Avatar */}
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center overflow-hidden">
              {influencer.image ? (
                <img src={influencer.image} alt={influencer.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl font-bold text-white">
                  {(influencer.name || 'I').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">@{influencer.user_name || influencer.name}</h3>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Followers</span>
                  <span className="font-semibold">
                    {influencer.instagramData?.followers
                      ? (influencer.instagramData.followers / 1000).toFixed(1)
                      : '0'}
                    K
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Engagement</span>
                  <span className="font-semibold text-green-600">{influencer.averageEngagement?.toFixed(1) || '0'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category</span>
                  <span className="font-semibold text-xs">{influencer.categoryInstagram || 'N/A'}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayedInfluencers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No trending influencers found</p>
        </div>
      )}
    </div>
  );
}
