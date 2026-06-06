import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandCard from '@/components/cards/BrandCard';
import { useAuth } from '@/app/context/AuthContext';
import { useBrands } from '@/hooks/useBrands';

/**
 * Explore Brands Section
 * Displays a grid of brand cards with rounded backgrounds
 */
export default function ExploreBrandsSection() {
  const router = useRouter();
  const { getUserType } = useAuth();
  const role = (getUserType() || 'user').toLowerCase();

  // Redux brands hook
  const { trendingBrands, loading, fetchTrendingBrands } = useBrands();

  // Format brands with color coding
  const brands = (() => {
    const colorOptions = [
      'bg-yellow-500', 'bg-green-600', 'bg-blue-600', 'bg-red-600',
      'bg-red-700', 'bg-yellow-500', 'bg-green-600', 'bg-blue-600'
    ];

    return (trendingBrands || []).slice(0, 8).map((brand, index) => ({
      id: brand._id || brand.id,
      name: brand.name || 'Unknown Brand',
      companyName: brand.companyName || brand.name || '',
      campaigns: brand.activeCampaigns || 0,
      totalBudget: brand.totalBudget || 0,
      initial: (brand.name || brand.companyName || 'B').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      color: colorOptions[index % colorOptions.length]
    }));
  })();

  useEffect(() => {
    fetchTrendingBrands({ limit: 8 });
  }, []);

  return (
    <div className="mb-8 bg-[#181818] rounded-3xl p-6 border border-white/5">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] text-[#9A9A9A] uppercase tracking-wide mb-1 font-medium">
            TOP BRANDS THIS MONTH
          </p>
          <h2 className="text-2xl font-normal text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Explore Brands</h2>
        </div>
        <button 
          onClick={() => router.push(`/${role}/brand/explore-brands`)}
          className="px-4 py-1.5 border border-white/10 text-white rounded-full font-medium text-sm hover:bg-white/5 transition-colors"
        >
          More
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-4 gap-3">
          {Array(8).fill(null).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-[#262626] rounded-3xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Brands Grid - 4 columns */}
      {!loading && (
        <div className="grid grid-cols-4 gap-3">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <BrandCard
                key={brand.id}
                brandName={brand.name}
                brandInitial={brand.initial}
                bgColor={brand.color}
                onClick={() => router.push(`/${role}/brand-profile/${brand.id}`)}
              />
            ))
          ) : (
            <div className="col-span-4 text-center py-4">
              <p className="text-[#9A9A9A] text-sm">No brands found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
