'use client'
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { campaignApi } from '@/api';
import { getTrendingInfluencers, getNearbyCampaigns } from '@/api/trending-nearby.api';
import CampaignCard from '@/components/cards/CampaignCard';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import SectionHeading from '@/components/SectionHeading';
import secureAuthStorage from '@/utils/secure-auth';
import api from '@/utils/api';

const CATEGORIES = ['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling'];
const BRAND_FALLBACK_COLORS = ['#a855f7', '#f59e0b', '#3b82f6', '#f97316', '#ec4899', '#eab308', '#10b981', '#ef4444'];

function DashboardContent() {
  const router = useRouter();
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [topInfluencers, setTopInfluencers] = useState([]);
  const [influencersLoading, setInfluencersLoading] = useState(true);

  const [topCampaigns, setTopCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  const [nearbyCampaigns, setNearbyCampaigns] = useState([]);
  const [nearbyCampaignsLoading, setNearbyCampaignsLoading] = useState(true);

  const [exploreBrands, setExploreBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const [topCategoryFilter, setTopCategoryFilter] = useState('All');
  const [nearbyCategoryFilter, setNearbyCategoryFilter] = useState('All');

  const searchSuggestions = [
    "Discover lifestyle influencers who align with your brand values and can effectively promote...",
    "Discover lifestyle influencers who align with your brand values and can effectively...",
    "Discover lifestyle influencers who align with your brand values and...",
  ];

  useEffect(() => {
    getTrendingInfluencers({ limit: 10 })
      .then((res) => setTopInfluencers(res.data || res.influencers || []))
      .catch(() => setTopInfluencers([]))
      .finally(() => setInfluencersLoading(false));
  }, []);

  useEffect(() => {
    campaignApi.getAllCampaigns({ status: 'Active' }, { page: 1, limit: 3 })
      .then((res) => setTopCampaigns(res.campaigns || []))
      .catch(() => setTopCampaigns([]))
      .finally(() => setCampaignsLoading(false));
  }, []);

  useEffect(() => {
    const userData = secureAuthStorage.getUserData();
    const location = userData?.location || userData?.profile?.location || {};
    getNearbyCampaigns({ city: location.city, state: location.state, country: location.country || 'India', limit: 3, page: 1 })
      .then((res) => {
        const data = res?.campaigns || res?.data?.campaigns || res?.data?.data || res?.data || [];
        setNearbyCampaigns(Array.isArray(data) ? data : []);
      })
      .catch(() => setNearbyCampaigns([]))
      .finally(() => setNearbyCampaignsLoading(false));
  }, []);

  useEffect(() => {
    api.get('/brands', { params: { page: 1, limit: 8 } })
      .then((res) => {
        const data = res.data?.data || res.data?.brands || res.data || [];
        setExploreBrands(Array.isArray(data) ? data.slice(0, 8) : []);
      })
      .catch(() => setExploreBrands([]))
      .finally(() => setBrandsLoading(false));
  }, []);

  const handleSearchClick = () => {
    setIsFadingOut(true);
    setTimeout(() => router.push('/user/influencer-search'), 300);
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const getInitialsColor = (id) => {
    const cols = ['bg-blue-600', 'bg-teal-600', 'bg-blue-500', 'bg-teal-500', 'bg-pink-600', 'bg-purple-600', 'bg-green-600'];
    return cols[(id?.charCodeAt?.(0) ?? 0) % cols.length];
  };

  const getTimeAgo = (date) => {
    if (!date) return 'recently';
    const diffMs = Date.now() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'just now';
  };

  return (
    <>
      <style jsx global>{`
        .fade-out-dashboard { animation: fadeOut 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes fadeOut { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.98); } }
      `}</style>

      <div className={`min-h-screen bg-[#000201] text-white transition-all duration-300 ${isFadingOut ? 'fade-out-dashboard' : ''}`}>
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-10">

          {/* Search Bar */}
          <div className="relative mb-[17px] cursor-pointer" onClick={handleSearchClick}>
            <div className="absolute inset-0 rounded-full blur-[8px] border-2 border-[#16a34a] pointer-events-none" />
            <div className="relative flex items-center bg-[rgba(255,255,255,0.08)] backdrop-blur-[6px] rounded-full border-[0.8px] border-[#16a34a] overflow-hidden pr-[9.6px] py-[10px] pl-[19.6px] gap-3 h-[60px]">
              <span className="flex-1 text-[#9b9b9b] text-[16px] truncate leading-[1.6]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Search influencers (e.g. I need influencers in Mumbai)...
              </span>
              <button
                onClick={handleSearchClick}
                className="flex items-center gap-2 bg-[#16a34a] text-white rounded-[20px] pl-[40px] pr-[16px] py-[8px] text-[16px] font-normal shrink-0 relative h-[40px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Search className="absolute left-[10px] h-[24px] w-[24px]" />
                Search
              </button>
            </div>
          </div>

          {/* Suggestion Pills */}
          <div className="flex flex-col items-center gap-[8px] mb-[68px]">
            {[640, 580, 520].map((maxW, index) => (
              <div
                key={index}
                className="bg-[#181818] px-[12px] py-[8px] rounded-[64px] cursor-pointer hover:bg-[#222] transition-colors overflow-hidden"
                style={{ width: '100%', maxWidth: `${maxW}px` }}
                onClick={handleSearchClick}
              >
                <p
                  className="text-[14px] font-medium text-[#808080] leading-[20px] tracking-[0.2px] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  {searchSuggestions[index]}
                </p>
              </div>
            ))}
          </div>

          {/* All Sections */}
          <div className="flex flex-col gap-[32px]">

            {/* Top Influencers */}
            <div>
              <SectionHeading title="Top Influencers" onViewAll={() => router.push('/user/influencers')} />
              {influencersLoading ? (
                <div className="flex gap-[20px] overflow-x-auto pb-2 scrollbar-hide">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-[8px] flex-shrink-0 w-[120px] animate-pulse">
                      <div className="w-full aspect-square bg-[#2f2f2f] rounded-full" />
                      <div className="h-3 bg-[#2f2f2f] rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : topInfluencers.length > 0 ? (
                <div className="flex gap-[20px] overflow-x-auto pb-2 scrollbar-hide">
                  {topInfluencers.map((inf, index) => (
                    <InfluencerAvatar
                      key={inf._id || inf.id || index}
                      name={inf.profile_name || inf.stage_name || inf.name || 'Unknown'}
                      avatar={inf.profile_pic_url || inf.profileImage || inf.profilePicture}
                      onClick={() => router.push(`/user/influencers/${inf._id || inf.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#9b9b9b] text-sm py-4">No trending influencers available</p>
              )}
            </div>

            {/* Top Campaigns */}
            <div>
              <SectionHeading title="Top Campaigns" onViewAll={() => router.push('/user/campaigns')} />
              <div className="flex gap-3 items-center mb-5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTopCategoryFilter(cat)}
                    className={`px-6 py-1 rounded-full text-sm capitalize transition-colors ${
                      topCategoryFilter === cat ? 'bg-[#16a34a] text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {campaignsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => <div key={i} className="bg-[#181818] rounded-2xl h-52 animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topCampaigns.length > 0 ? topCampaigns.map((campaign, index) => {
                    const id = campaign.campaignId || campaign._id || campaign.id;
                    const name = campaign.campaignName || campaign.brandId?.companyName || 'Campaign';
                    return (
                      <CampaignCard
                        key={id || index}
                        brandName={name}
                        brandInitials={getInitials(name)}
                        timeAgo={getTimeAgo(campaign.createdAt)}
                        campaignImage={campaign.productImages?.[0] || null}
                        initialsColor={getInitialsColor(id || String(index))}
                        onClick={() => router.push(`/user/campaigns/${id}`)}
                      />
                    );
                  }) : (
                    <p className="text-sm text-[#9b9b9b] col-span-full">No campaigns available</p>
                  )}
                </div>
              )}
            </div>

            {/* Explore Brands */}
            <div className="bg-[#181818] rounded-[24px] p-5 border border-white/5">
              <div className="flex items-start justify-between mb-5">
                <div className="flex flex-col gap-[8px]">
                  <p className="text-[12px] text-white uppercase tracking-widest font-normal leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    TOP BRANDS THIS MONTH
                  </p>
                  <h2 className="text-[24px] font-normal text-white leading-[1.2] capitalize" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
                    Explore Brands
                  </h2>
                </div>
                <button
                  onClick={() => router.push('/user/explore-brands')}
                  className="px-[24px] py-[12px] border border-white text-white rounded-full text-[16px] font-normal hover:bg-white/10 transition-colors shrink-0"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  View More
                </button>
              </div>
              {brandsLoading ? (
                <div className="flex gap-[12px] overflow-x-auto pb-1 scrollbar-hide">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-[8px] flex-shrink-0 w-[100px] animate-pulse">
                      <div className="w-full aspect-square bg-[#2f2f2f] rounded-full" />
                      <div className="h-3 bg-[#2f2f2f] rounded w-14" />
                    </div>
                  ))}
                </div>
              ) : exploreBrands.length > 0 ? (
                <div className="flex gap-[12px] overflow-x-auto pb-1 scrollbar-hide">
                  {exploreBrands.map((brand, index) => {
                    const name = brand.companyName || brand.name || 'Brand';
                    const initial = name.charAt(0).toUpperCase();
                    const color = BRAND_FALLBACK_COLORS[index % BRAND_FALLBACK_COLORS.length];
                    return (
                      <div
                        key={brand._id || brand.id || index}
                        className="flex flex-col items-center gap-[8px] flex-shrink-0 w-[100px] cursor-pointer"
                        onClick={() => router.push(`/user/brand-profile/${brand._id || brand.id}`)}
                      >
                        <div className="w-full aspect-square bg-[#2f2f2f] rounded-full overflow-hidden flex items-center justify-center hover:bg-[#3a3a3a] transition-colors">
                          {brand.company_logo ? (
                            <img src={brand.company_logo} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-base font-bold" style={{ color }}>{initial}</span>
                          )}
                        </div>
                        <span className="text-[#9A9A9A] text-sm text-center truncate w-full capitalize" style={{ fontFamily: 'Inter, sans-serif' }}>{name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#9b9b9b] py-4 text-center">No brands available</p>
              )}
            </div>

            {/* Nearby Campaigns */}
            <div>
              <SectionHeading title="Nearby Campaigns" onViewAll={() => router.push('/user/campaigns')} />
              <div className="flex gap-3 items-center mb-5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNearbyCategoryFilter(cat)}
                    className={`px-6 py-1 rounded-full text-sm capitalize transition-colors ${
                      nearbyCategoryFilter === cat ? 'bg-[#16a34a] text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {nearbyCampaignsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => <div key={i} className="bg-[#181818] rounded-2xl h-52 animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyCampaigns.length > 0 ? nearbyCampaigns.map((campaign, index) => {
                    const id = campaign.campaignId || campaign._id || campaign.id;
                    const name = campaign.campaignName || campaign.brandId?.companyName || 'Campaign';
                    return (
                      <CampaignCard
                        key={id || `nearby-${index}`}
                        brandName={name}
                        brandInitials={getInitials(name)}
                        timeAgo={getTimeAgo(campaign.createdAt)}
                        campaignImage={campaign.productImages?.[0] || null}
                        initialsColor={getInitialsColor(id || String(index))}
                        onClick={() => router.push(`/user/campaigns/${id}`)}
                      />
                    );
                  }) : (
                    <p className="text-sm text-[#9b9b9b] col-span-full">No nearby campaigns available</p>
                  )}
                </div>
              )}
            </div>

            {/* Premium CTA */}
            <div
              className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-white/5"
              style={{ background: 'linear-gradient(-56.7deg, #14532d 37.6%, #166534 98.8%)' }}
            >
              <p className="text-[11px] uppercase tracking-widest mb-3 font-medium" style={{ color: '#86efac', fontFamily: 'Inter, sans-serif' }}>
                PREMIUM ACCESS
              </p>
              <h2 className="text-2xl font-normal mb-3" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Boost your reach</h2>
              <p className="text-white/85 mb-6 text-sm leading-relaxed max-w-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                Upgrade to our premium plan to unlock exclusive analytics, brand deals, and premium campaigns.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/user/account/upgrade-plan')}
                  className="px-6 py-3 bg-white text-[#166534] rounded-full font-medium hover:bg-white/90 transition-colors text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Get Premium Access
                </button>
                <button
                  onClick={() => router.push('/user/learn-more')}
                  className="px-6 py-3 border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Learn More
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function UserDashboard() {
  return <DashboardContent />;
}
