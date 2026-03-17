'use client';

import { useEffect } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Loader } from 'lucide-react';

interface ExploreBrandsProps {
  limit?: number;
}

export default function ExploreBrands({ limit = 8 }: ExploreBrandsProps) {
  const { campaigns, loading, error, fetchCampaigns } = useCampaigns();

  useEffect(() => {
    fetchCampaigns({ limit: limit ? limit * 3 : 24 });
  }, [limit, fetchCampaigns]);

  // Generate mock brands from campaigns for display
  const brands = (campaigns || [])
    .slice(0, limit || 8)
    .map((campaign: any, index: number) => ({
      id: campaign.id || `brand-${index}`,
      name: `Brand ${index + 1}`,
      email: `brand${index + 1}@example.com`,
      campaigns: index + 1,
      totalBudget: campaign.budget || 0,
      avatar: null,
    }));

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
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* Brand Header */}
            <div className="bg-gradient-to-br from-orange-400 to-red-600 h-24 relative">
              {brand.avatar && (
                <img src={brand.avatar} alt={brand.name} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Brand Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{brand.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{brand.email}</p>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Campaigns</span>
                  <span className="font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs">
                    {brand.campaigns}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Budget</span>
                  <span className="font-semibold text-green-600">${(brand.totalBudget / 1000).toFixed(1)}K</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                View Campaigns
              </button>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No brands found</p>
        </div>
      )}
    </div>
  );
}
