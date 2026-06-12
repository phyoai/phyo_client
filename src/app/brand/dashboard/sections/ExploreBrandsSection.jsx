import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { sanitizeName } from '@/utils/sanitize-name';

const FALLBACK_COLORS = ['#a855f7', '#f59e0b', '#3b82f6', '#f97316', '#ec4899', '#eab308', '#10b981', '#ef4444'];

export default function ExploreBrandsSection() {
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/brands', { params: { page: 1, limit: 8 } })
      .then((res) => {
        const data = res.data?.data || res.data?.brands || res.data || [];
        setBrands(Array.isArray(data) ? data.slice(0, 8) : []);
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  const getBrandName = (brand) => sanitizeName(brand.companyName || brand.name || 'Brand');

  return (
    <div className="bg-[#181818] rounded-[24px] p-5 border border-white/5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-[8px]">
          <p className="font-inter text-[12px] text-white uppercase tracking-widest font-normal leading-[1.2]">
            TOP BRANDS THIS MONTH
          </p>
          <h2
            className="text-[24px] font-normal text-white leading-[1.2] capitalize"
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}
          >
            Explore Brands
          </h2>
        </div>
        <button
          onClick={() => router.push('/brand/explore-brands')}
          className="font-inter px-[24px] py-[12px] border border-white text-white rounded-full text-[16px] font-normal hover:bg-white/10 transition-colors shrink-0"
        >
          View More
        </button>
      </div>

      <style>{`
        @keyframes scrollBrands {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-brands { animation: scrollBrands 26s linear infinite; }
        .scroll-brands-wrap:hover .scroll-brands { animation-play-state: paused; }
      `}</style>

      {/* Brands row */}
      {loading ? (
        <div className="flex gap-[12px] overflow-x-hidden pb-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-[8px] flex-shrink-0 w-[100px] animate-pulse">
              <div className="w-full aspect-square bg-[#2f2f2f] rounded-full" />
              <div className="h-3 bg-[#2f2f2f] rounded w-14" />
            </div>
          ))}
        </div>
      ) : (
        <div className="scroll-brands-wrap overflow-hidden">
          <div className="scroll-brands flex gap-[12px]" style={{ width: 'max-content' }}>
            {[...brands, ...brands].map((brand, index) => {
              const name = getBrandName(brand);
              const initial = name.charAt(0).toUpperCase();
              const color = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
              return (
                <div
                  key={`${brand._id || brand.id || index}-${index}`}
                  className="flex flex-col items-center gap-[8px] flex-shrink-0 w-[100px] cursor-pointer"
                  onClick={() => router.push(`/brand/brand-profile/${brand._id || brand.id}`)}
                >
                  <div className="w-full aspect-square bg-[#2f2f2f] rounded-full overflow-hidden flex items-center justify-center hover:bg-[#3a3a3a] transition-colors">
                    {brand.company_logo ? (
                      <img
                        src={brand.company_logo}
                        alt={name}
                        className="w-[60px] h-[60px] object-contain"
                      />
                    ) : (
                      <span className="text-xl font-bold" style={{ color }}>{initial}</span>
                    )}
                  </div>
                  <span className="font-inter text-[16px] font-normal text-white capitalize text-center leading-[1.2] w-full truncate">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
