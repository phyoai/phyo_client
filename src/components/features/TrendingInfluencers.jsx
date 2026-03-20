'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import PlanRestrictedError from '@/components/PlanRestrictedError';
import influencerService from '@/services/influencer.service';
import { getPlanRestrictionDetails } from '@/utils/planAccess';

export default function TrendingInfluencers({ limit = 8, category }) {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTrendingInfluencers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await influencerService.advancedSearch({
        sortBy: 'engagement',
        sortOrder: 'desc',
        limit,
        ...(category && { category })
      });

      setInfluencers(response.data?.slice(0, limit) || []);
    } catch (err) {
      console.error('Error fetching trending influencers:', err);
      const planDetails = getPlanRestrictionDetails(err);

      // Check if it's a plan tier restriction error
      if (planDetails) {
        setError({
          message: planDetails.message,
          upgradeRequired: true,
          requiredPlans: planDetails.requiredPlans,
          currentPlan: planDetails.currentPlan,
          canRetry: false
        });
      } else {
        // Better error message handling
        let errorMessage = 'Failed to load trending influencers';
        let canRetry = true;

        if (err?.response?.status === 401) {
          errorMessage = 'Please log in to view trending influencers';
          canRetry = false;
        } else if (err?.response?.status === 403) {
          errorMessage = 'You don\'t have permission to view this data';
          canRetry = false;
        } else if (err?.code === 'ERR_NETWORK' || !err?.response) {
          errorMessage = 'Network error. Ensure the backend server is running at http://localhost:4000. Please check your connection and try again.';
          canRetry = true;
        } else if (err?.response?.status === 404) {
          errorMessage = 'The influencers endpoint is not available on the backend server.';
          canRetry = true;
        } else if (err?.response?.status >= 500) {
          errorMessage = 'Backend server error. Please try again later.';
          canRetry = true;
        } else if (err?.message) {
          errorMessage = err.message;
          canRetry = true;
        } else if (err?.error) {
          errorMessage = err.error;
          canRetry = true;
        }

        setError({
          message: errorMessage,
          upgradeRequired: false,
          canRetry
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingInfluencers();
  }, [limit, category]);

  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    fetchTrendingInfluencers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    // Plan tier restriction error
    if (error.upgradeRequired) {
      return (
        <PlanRestrictedError
          message={error.message}
          currentPlan={error.currentPlan || 'BRONZE'}
          requiredPlans={error.requiredPlans}
          onUpgradeClick={() => {
            // Navigate to upgrade page or open modal
            window.location.href = '/settings/upgrade';
          }}
          variant="info"
        />
      );
    }

    // Generic error
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400 mb-3">{error.message}</p>
        {error.canRetry && (
          <button
            onClick={handleRetry}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {loading ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {influencers.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* Avatar */}
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center overflow-hidden">
              {influencer.avatar ? (
                <img src={influencer.avatar} alt={influencer.username} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl font-bold text-white">
                  {influencer.username?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">@{influencer.username}</h3>
              {influencer.verified && <span className="text-blue-500 text-sm">✓ Verified</span>}

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Followers</span>
                  <span className="font-semibold">{(influencer.followers / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Engagement</span>
                  <span className="font-semibold text-green-600">{(influencer.engagement * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rating</span>
                  <span className="font-semibold">⭐ {influencer.rating?.toFixed(1)}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-3 flex flex-wrap gap-1">
                {influencer.categories?.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded"
                  >
                    {cat}
                  </span>
                ))}
                {influencer.categories?.length > 2 && (
                  <span className="px-2 py-1 text-xs text-gray-500">+{influencer.categories.length - 2}</span>
                )}
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {influencers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No trending influencers found</p>
        </div>
      )}
    </div>
  );
}
