import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandCard from '@/components/cards/BrandCard';
import { useAuth } from '@/app/context/AuthContext';
import { campaignService } from '@/services';

/**
 * Explore Brands Section
 * Displays a grid of brand cards with rounded backgrounds
 */
export default function ExploreBrandsSection() {
  const router = useRouter();
  const { getUserType } = useAuth();
  const role = (getUserType() || 'user').toLowerCase();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        // Get campaigns and extract unique brands
        const response = await campaignService.getCampaigns({
          page: 1,
          limit: 24
        });

        const brandsMap = new Map();
        (response.data || []).forEach((campaign) => {
          const brandKey = campaign.brand?.id || 'unknown';
          if (!brandsMap.has(brandKey)) {
            brandsMap.set(brandKey, {
              id: campaign.brand?.id || Math.random(),
              name: `${campaign.brand?.firstName || ''} ${campaign.brand?.lastName || 'Unknown Brand'}`.trim(),
              companyName: campaign.brand?.companyName || '',
              campaigns: 0,
              totalBudget: 0
            });
          }
          const brand = brandsMap.get(brandKey);
          brand.campaigns += 1;
          brand.totalBudget += campaign.budget || 0;
        });

        // Format brands with color coding
        const colorOptions = [
          'bg-yellow-500', 'bg-green-600', 'bg-blue-600', 'bg-red-600',
          'bg-red-700', 'bg-yellow-500', 'bg-green-600', 'bg-blue-600'
        ];

        const formattedBrands = Array.from(brandsMap.values()).slice(0, 8).map((brand, index) => ({
          ...brand,
          initial: (brand.name || brand.companyName || 'B').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
          color: colorOptions[index % colorOptions.length]
        }));

        setBrands(formattedBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Fallback to empty array
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

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
          onClick={() => router.push(`/${role}/brand/explore-brands`)}
          className="px-4 py-1.5 border border-gray-800 text-gray-900 rounded-full font-medium text-sm hover:bg-gray-800 hover:text-white transition-colors"
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
              className="aspect-square bg-gray-300 rounded-lg animate-pulse"
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
                onClick={() => router.push(`/${role}/brand/brand-profile/${brand.id}`)}
              />
            ))
          ) : (
            <div className="col-span-4 text-center py-4">
              <p className="text-gray-500 text-sm">No brands found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
