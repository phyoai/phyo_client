'use client';

import { useEffect, useState } from 'react';
import { campaignService, type Campaign } from '@/services';
import { Loader } from 'lucide-react';

interface CategoryCampaignsProps {
  category: string;
  categoryLabel: string;
  icon?: string;
  limit?: number;
}

export default function CategoryCampaigns({
  category,
  categoryLabel,
  icon = '📱',
  limit = 6
}: CategoryCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch campaigns and filter by category
        const response = await campaignService.getCampaigns({
          page: 1,
          limit: limit * 2
        });

        const filtered = (response.data || [])
          .filter((c) => c.status === 'active')
          .slice(0, limit);

        setCampaigns(filtered);
      } catch (err: any) {
        setError(err?.response?.data?.message || `Failed to load ${categoryLabel} campaigns`);
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCampaigns();
  }, [category, limit, categoryLabel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl">{icon}</span>
        <div>
          <h2 className="text-2xl font-bold">{categoryLabel} Campaigns</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {campaigns.length} active {categoryLabel.toLowerCase()} campaigns available
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Campaign Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <h3 className="font-bold text-lg line-clamp-2">{campaign.title}</h3>
              <p className="text-sm opacity-90 line-clamp-1 mt-1">{campaign.description}</p>
            </div>

            {/* Campaign Body */}
            <div className="p-4 space-y-3">
              {/* Budget */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                <p className="text-2xl font-bold text-green-600">${campaign.budget.toLocaleString()}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <p className="text-gray-600 dark:text-gray-400">Influencers</p>
                  <p className="font-semibold">{campaign.influencerCount}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <p className="text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold capitalize">{campaign.status}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="text-xs text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-2">
                {new Date(campaign.startDate).toLocaleDateString()} to{' '}
                {new Date(campaign.endDate).toLocaleDateString()}
              </div>

              {/* Action */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No {categoryLabel.toLowerCase()} campaigns available</p>
        </div>
      )}

      {/* View All Link */}
      {campaigns.length >= limit && (
        <div className="mt-6 text-center">
          <a href={`/brand/campaigns?category=${category}`} className="text-blue-600 hover:underline font-semibold">
            View all {categoryLabel.toLowerCase()} campaigns →
          </a>
        </div>
      )}
    </div>
  );
}
