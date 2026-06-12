'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookmarkLine, ShareLine } from '@phyoofficial/phyo-icon-library';
import { Clock, Users } from 'lucide-react';

export default function BrandProfile() {
  const params = useParams();
  const [brand, setBrand] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchBrandProfile = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://phyo-node-server-586564333800.us-central1.run.app/api';
        const response = await fetch(
          `${apiBaseUrl}/brands/${params.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const apiBrand = responseData.data || responseData;

          // Merge API data with mock data for missing fields
          const brandData = {
            id: apiBrand._id || params.id,
            name: apiBrand.name || 'Brand',
            logo: apiBrand.name ? apiBrand.name.charAt(0).toUpperCase() : 'B',
            banner: apiBrand.banner || null,
            description: apiBrand.description || 'A brand on our platform',
            location: apiBrand.location || 'India',
            followers: apiBrand.followers || '0',
            engagement: apiBrand.engagement || '0%',
            about: apiBrand.about || 'Brand profile',
            verified: apiBrand.verified || false,
            activeCampaigns: apiBrand.activeCampaigns || [
              {
                id: 1,
                name: 'Campaign 1',
                hashtag: '#campaign1',
                closesDate: '20 Apr',
                enrolled: '30+ Enrolled',
                contentTypes: { reels: 3, stories: 5, posts: 1 },
                budget: '₹80K-1.5L',
                daysLeft: 6,
                spotsOpen: 12,
                status: 'On Going'
              }
            ],
            performance: apiBrand.performance || {
              campaignsRun: 0,
              avgEngagement: '0%',
              avgReach: '0',
              creatorSatisfaction: '0%',
              ageGroups: [
                { range: '12-18', value: 0 },
                { range: '19-24', value: 0 },
                { range: '24-34', value: 0 },
                { range: '35-45', value: 0 },
                { range: '46-55', value: 0 },
                { range: '65+', value: 0 },
              ]
            },
            connectedPlatforms: apiBrand.connectedPlatforms || [],
            reviews: apiBrand.reviews || {
              rating: 0,
              count: 0,
              items: []
            }
          };

          setBrand(brandData);
        } else {
          setMockBrand();
        }
      } catch (error) {
        console.error('Error fetching brand profile:', error);
        setMockBrand();
      }
    };

    const setMockBrand = () => {
      const mockBrand = {
        id: params.id,
        name: 'Lenskart',
        logo: 'L',
        banner: null,
        description: 'Fitness tracker branding tech reviews with wellness content. Known for high-trust, community-driven storytelling.',
        location: 'India',
        followers: '2.4M',
        engagement: '4.2%',
        about: 'Leading eyewear brand delivering premium spectacles, contact lenses, and eye care solutions.',
        verified: true,
        activeCampaigns: [
          {
            id: 1,
            name: 'Summer Launch',
            hashtag: '#MoveWithIPLT20',
            closesDate: '20 Apr',
            enrolled: '30+ User Enrolled',
            contentTypes: { reels: 3, stories: 5, posts: 1 },
            budget: '₹80K-1.5L',
            daysLeft: 6,
            spotsOpen: 12,
            status: 'On Going'
          },
          {
            id: 2,
            name: 'Summer Launch',
            hashtag: '#MoveWithIPLT20',
            closesDate: '20 Apr',
            enrolled: '30+ User Enrolled',
            contentTypes: { reels: 3, stories: 5, posts: 1 },
            budget: '₹80K-1.5L',
            daysLeft: 6,
            spotsOpen: 12,
            status: 'On Going'
          },
          {
            id: 3,
            name: 'Summer Launch',
            hashtag: '#MoveWithIPLT20',
            closesDate: '20 Apr',
            enrolled: '30+ User Enrolled',
            contentTypes: { reels: 3, stories: 5, posts: 1 },
            budget: '₹80K-1.5L',
            daysLeft: 6,
            spotsOpen: 12,
            status: 'On Going'
          },
        ],
        performance: {
          campaignsRun: 48,
          avgEngagement: '7.2%',
          avgReach: '1.8M',
          creatorSatisfaction: '94%',
          ageGroups: [
            { range: '12-18', value: 65 },
            { range: '19-24', value: 50 },
            { range: '24-34', value: 55 },
            { range: '35-45', value: 30 },
            { range: '46-55', value: 50 },
            { range: '65+', value: 40 },
          ]
        },
        connectedPlatforms: [
          { id: 1, name: 'Dadi Cool', handle: '@dadi_cool', engagement: '7.1%', followers: '1.4M' },
          { id: 2, name: 'Dadi Cool', handle: '@dadi_cool', engagement: '7.1%', followers: '1.4M' },
        ],
        reviews: {
          rating: 4.9,
          count: 31,
          items: [
            { brand: 'Nike India', role: 'Marketing Lead', rating: 5, review: 'Aanya delivered beyond brief. Authenticity was off the charts DMs flooded with leads.' },
            { brand: 'Nike India', role: 'Marketing Lead', rating: 5, review: 'Aanya delivered beyond brief. Authenticity was off the charts DMs flooded with leads.' },
          ]
        }
      };
      setBrand(mockBrand);
    };

    if (params.id) {
      fetchBrandProfile();
    }
  }, [params.id]);

  if (!brand) return <div className="min-h-screen bg-[#000201] flex items-center justify-center text-white">Loading...</div>;

  const initial = brand.name.charAt(0).toUpperCase();
  const maxHeight = Math.max(...brand.performance.ageGroups.map(g => g.value));

  return (
    <div className="min-h-screen bg-[#000201] pr-5 py-6 pb-24">
      <div className="w-full flex flex-col gap-6">

        {/* ── HERO BANNER + AVATAR ── */}
        <div className="relative">
          <div className="w-full h-[260px] rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2818 0%, #073d1b 40%, #16A34A22 100%)' }}>
            <div className="w-full h-full flex items-end p-8">
              <p className="text-white/10 font-black leading-none select-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 'clamp(48px, 8vw, 96px)' }}>
                {brand.name.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="absolute left-8 bottom-0 translate-y-1/2 w-[148px] h-[148px] rounded-full border-4 border-[#000201] overflow-hidden flex items-center justify-center z-10"
            style={{ background: 'linear-gradient(135deg,#16A34A,#0a4620)', boxShadow: '0px 0px 74px rgba(0,0,0,0.55)' }}>
            <span className="text-white font-black select-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 56 }}>{initial}</span>
          </div>

          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button onClick={() => setSaved(s => !s)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer' }}>
              <BookmarkLine className="w-5 h-5" style={{ color: saved ? '#16A34A' : '#fff' }} />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer' }}>
              <ShareLine className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* ── NAME + INFO ── */}
        <div className="flex flex-col gap-3" style={{ paddingTop: 12, paddingLeft: 196 }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[32px] font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-bricolage-grotesque)', letterSpacing: '-0.01em' }}>
              {brand.name}
            </h1>
            {brand.verified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#0a4620] text-[#16A34A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block" />
                verified
              </span>
            )}
          </div>
          <p className="text-[15px] text-[#9A9A9A]" style={{ fontFamily: 'Inter,sans-serif' }}>{brand.location} · {brand.followers} followers</p>
          <p className="text-[15px] leading-relaxed text-[#9A9A9A]" style={{ fontFamily: 'Inter, sans-serif' }}>{brand.description}</p>
        </div>

        {/* ── BIOGRAPHY ── */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h3 className="text-white text-[22px] font-semibold mb-3" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Biography</h3>
          <p className="text-[#9A9A9A] text-[15px] leading-relaxed" style={{ fontFamily: 'Inter,sans-serif' }}>{brand.about}</p>
        </div>

        {/* ── GRID: Active Campaigns + Campaign Performance + Connected Platforms ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ACTIVE CAMPAIGNS */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-[22px] font-semibold" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Active Campaigns</h3>
              <button className="flex items-center gap-1.5 text-[#16A34A] text-[14px]" style={{ fontFamily: 'Inter,sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                View All
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {brand.activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="bg-[#262625] rounded-3xl p-5 min-h-[280px] flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white text-[16px] font-semibold" style={{ fontFamily: 'Inter,sans-serif' }}>{campaign.name}</h4>
                      <p className="text-[#9B9B9B] text-[13px]" style={{ fontFamily: 'Inter,sans-serif' }}>{campaign.hashtag}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#0a4620] text-[#16A34A]" style={{ fontFamily: 'Inter,sans-serif' }}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-[13px] text-[#9B9B9B]" style={{ fontFamily: 'Inter,sans-serif' }}>
                      <Clock size={14} /> Closes {campaign.closesDate}
                      <span className="mx-1">·</span>
                      <Users size={14} /> {campaign.enrolled}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {[{ label: `${campaign.contentTypes.reels} Reels` }, { label: `${campaign.contentTypes.stories} Stories` }, { label: `${campaign.contentTypes.posts} Post` }].map((ct, i) => (
                      <span key={i} className="border border-[#9B9B9B] text-[#9B9B9B] px-3 py-1 rounded-full text-[11px]" style={{ fontFamily: 'Inter,sans-serif' }}>
                        {ct.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-white text-[16px] font-semibold" style={{ fontFamily: 'Inter,sans-serif' }}>{campaign.budget}</p>
                      <div className="flex items-center gap-2 text-[12px] mt-1">
                        <span className="text-[#ff4444]" style={{ fontFamily: 'Inter,sans-serif' }}>{campaign.daysLeft} days left</span>
                        <span className="text-[#9B9B9B]" style={{ fontFamily: 'Inter,sans-serif' }}>| {campaign.spotsOpen} spots open</span>
                      </div>
                    </div>
                    <button className="bg-[#16A34A] hover:bg-[#15803d] text-white px-6 py-2 rounded-full font-semibold transition" style={{ fontFamily: 'Inter,sans-serif' }}>
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Campaign Performance + Connected Platforms */}
          <div className="flex flex-col gap-6">
            {/* CAMPAIGN PERFORMANCE */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <h3 className="text-white text-[22px] font-semibold mb-4" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Campaign Performance</h3>

              <div className="space-y-4 mb-6">
                <div className="bg-[#262625] rounded-lg p-3">
                  <p className="text-[24px] font-bold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{brand.performance.campaignsRun}</p>
                  <p className="text-[#9B9B9B] text-[12px]" style={{ fontFamily: 'Inter,sans-serif' }}>Campaigns Run</p>
                </div>
                <div className="bg-[#262625] rounded-lg p-3">
                  <p className="text-[24px] font-bold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{brand.performance.avgEngagement}</p>
                  <p className="text-[#9B9B9B] text-[12px]" style={{ fontFamily: 'Inter,sans-serif' }}>Avg Engagement</p>
                </div>
                <div className="bg-[#262625] rounded-lg p-3">
                  <p className="text-[24px] font-bold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{brand.performance.avgReach}</p>
                  <p className="text-[#9B9B9B] text-[12px]" style={{ fontFamily: 'Inter,sans-serif' }}>Avg Reach</p>
                </div>
                <div className="bg-[#262625] rounded-lg p-3">
                  <p className="text-[24px] font-bold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{brand.performance.creatorSatisfaction}</p>
                  <p className="text-[#9B9B9B] text-[12px]" style={{ fontFamily: 'Inter,sans-serif' }}>Creator Satisfaction</p>
                </div>
              </div>

              <h4 className="text-white text-[16px] font-semibold mb-3" style={{ fontFamily: 'Inter,sans-serif' }}>Age groups</h4>
              <div className="flex items-end justify-around gap-1 h-[150px]">
                {brand.performance.ageGroups.map((group, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-7 bg-[#16A34A] rounded-sm" style={{ height: `${(group.value / maxHeight) * 100}px` }}></div>
                    <p className="text-[#9B9B9B] text-[10px]" style={{ fontFamily: 'Inter,sans-serif' }}>{group.range}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* End Campaign Performance */}

            {/* ── CONNECTED PLATFORMS ── */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-[22px] font-semibold" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Connected Platforms</h3>
                <button className="flex items-center gap-1.5 text-[#16A34A] text-[14px]" style={{ fontFamily: 'Inter,sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                View All
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
                </svg>
              </button>
              </div>
              <div className="space-y-3">
                {brand.connectedPlatforms.map((platform) => (
                  <div key={platform.id} className="bg-[#262625] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex-shrink-0"></div>
                      <div>
                        <p className="text-white text-[14px] font-medium" style={{ fontFamily: 'Inter,sans-serif' }}>{platform.name}</p>
                        <p className="text-[#9B9B9B] text-[12px]" style={{ fontFamily: 'Inter,sans-serif' }}>{platform.handle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#16A34A] text-[13px] font-semibold" style={{ fontFamily: 'Inter,sans-serif' }}>{platform.engagement} eng.</p>
                      <p className="text-[#9B9B9B] text-[12px]" style={{ fontFamily: 'Inter,sans-serif' }}>{platform.followers} followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* End Connected Platforms */}
          </div>
          {/* End Right Column */}
        </div>
        {/* End Grid */}

        {/* ── TOP CAMPAIGNS / REVIEWS ── */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[40px] font-bold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{brand.reviews.rating}</h3>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-[20px]">⭐</span>)}
                </div>
              </div>
              <p className="text-[#9B9B9B] text-[13px]" style={{ fontFamily: 'Inter,sans-serif' }}>{brand.reviews.count} Brand Reviews</p>
            </div>
            <button className="flex items-center gap-1.5 text-[#16A34A] text-[14px]" style={{ fontFamily: 'Inter,sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View All
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {brand.reviews.items.map((review, i) => (
              <div key={i} className="bg-[#262625] rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white text-[15px] font-semibold" style={{ fontFamily: 'Inter,sans-serif' }}>{review.brand}</p>
                    <p className="text-[#9B9B9B] text-[12px]" style={{ fontFamily: 'Inter,sans-serif' }}>{review.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => <span key={i} className="text-[16px]">⭐</span>)}
                  </div>
                </div>
                <p className="text-[#9B9B9B] text-[13px] leading-relaxed" style={{ fontFamily: 'Inter,sans-serif' }}>"{review.review}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
