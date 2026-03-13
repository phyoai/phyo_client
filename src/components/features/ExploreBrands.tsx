'use client';

import { useEffect, useState } from 'react';
import { campaignService, type Campaign } from '@/services';
import { Loader } from 'lucide-react';

interface ExploreBrandsProps {
  limit?: number;
}

export default function ExploreBrands({ limit = 8 }: ExploreBrandsProps) {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch campaigns to extract brands
        const response = await campaignService.getCampaigns({
          page: 1,
          limit: limit * 3 // Fetch more to have unique brands
        });

        // Group by brand and get unique brands with campaign count
        const brandsMap = new Map();
        (response.data || []).forEach((campaign) => {
          const brandKey = campaign.brand?.id || 'unknown';
          if (brandsMap.has(brandKey)) {
            const existing = brandsMap.get(brandKey);
            existing.campaignCount += 1;
          } else {
            brandsMap.set(brandKey, {
              id: campaign.brand?.id || Math.random(),
              name: campaign.brand?.firstName + ' ' + campaign.brand?.lastName || 'Unknown Brand',
              email: campaign.brand?.email || '',
              campaigns: 1,
              totalBudget: campaign.budget || 0,
              avatar: campaign.brand?.avatar || null
            });
          }
        });

        const uniqueBrands = Array.from(brandsMap.values()).slice(0, limit);
        setBrands(uniqueBrands);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load brands');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [limit]);

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
