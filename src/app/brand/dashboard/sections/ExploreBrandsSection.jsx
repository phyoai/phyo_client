import React from 'react';
import { useRouter } from 'next/navigation';
import BrandCard from '@/components/cards/BrandCard';

/**
 * Explore Brands Section
 * Displays a grid of brand cards with rounded backgrounds
 */
export default function ExploreBrandsSection() {
  const router = useRouter();

  // Mock data - will be replaced with API
  const brands = [
    { id: 1, name: 'Brand Name', initial: 'BN', color: 'bg-yellow-500' },
    { id: 2, name: 'Coca-Cola', initial: 'C', color: 'bg-green-600' },
    { id: 3, name: 'Nike', initial: 'N', color: 'bg-blue-600' },
    { id: 4, name: 'Nike', initial: 'N', color: 'bg-red-600' },
    { id: 5, name: 'Apple', initial: 'AE', color: 'bg-red-700' },
    { id: 6, name: 'Samsung', initial: 'AF', color: 'bg-yellow-500' },
    { id: 7, name: 'Tesla', initial: 'T', color: 'bg-green-600' },
    { id: 8, name: 'Tesla', initial: 'T', color: 'bg-blue-600' }
  ];

  return (
    <div className="mb-8 bg-[#C5D9C0] rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] text-gray-700 uppercase tracking-wide mb-1 font-medium">
            TOP BRANDS THIS MONTH
          </p>
          <h2 className="text-2xl font-bold text-gray-900">Explore Brands</h2>
        </div>
        <button 
          onClick={() => router.push('/brand/explore-brands')}
          className="px-4 py-1.5 border border-gray-800 text-gray-900 rounded-full font-medium text-sm hover:bg-gray-800 hover:text-white transition-colors"
        >
          More
        </button>
      </div>

      {/* Brands Grid - 4 columns */}
      <div className="grid grid-cols-4 gap-3">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            brandName={brand.name}
            brandInitial={brand.initial}
            bgColor={brand.color}
            onClick={() => router.push(`/brand/brand-profile/${brand.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
