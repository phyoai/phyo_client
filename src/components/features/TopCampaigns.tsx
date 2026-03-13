'use client';

import { useEffect, useState } from 'react';
import { campaignService, type Campaign } from '@/services';
import { Loader, ArrowRight } from 'lucide-react';

interface TopCampaignsProps {
  limit?: number;
  category?: string;
  type?: 'all' | 'active' | 'trending';
}

export default function TopCampaigns({ limit = 6, category, type = 'active' }: TopCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await campaignService.getCampaigns({
          page: 1,
          limit: limit * 2 // Fetch more to filter
        });

        let filteredCampaigns = response.data || [];

        // Filter by status
        if (type === 'active') {
          filteredCampaigns = filteredCampaigns.filter((c) => c.status === 'active');
        } else if (type === 'trending') {
          filteredCampaigns = filteredCampaigns.sort((a, b) => b.budget - a.budget);
        }

        setCampaigns(filteredCampaigns.slice(0, limit));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load campaigns');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [limit, category, type]);

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
    <div className="w-full space-y-4">
      {campaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            {/* Rank Badge */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                #{index + 1}
              </div>
            </div>

            {/* Campaign Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {campaign.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Budget: </span>
                  <span className="font-semibold text-green-600">${campaign.budget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Influencers: </span>
                  <span className="font-semibold">{campaign.influencerCount}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Status: </span>
                  <span
                    className={`font-semibold px-2 py-1 rounded text-xs ${
                      campaign.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="mt-2 text-xs text-gray-500">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">
              View Details
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-2 rounded-lg font-semibold transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      ))}

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No campaigns found</p>
        </div>
      )}
    </div>
  );
}
