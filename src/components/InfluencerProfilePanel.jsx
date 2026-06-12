'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkLine, Message3Line, UserAddLine } from '@phyoofficial/phyo-icon-library';

const C = {
  panel: '#181818',
  card:  '#262626',
  green: '#16A34A',
  white: '#FFFFFF',
  gray:  '#9B9B9B',
};

const DEFAULT_PROFILE = {
  name: 'Dadi Cool',
  username: '@dadi_cool',
  location: 'Mumbai, India',
  followers: '2.4M',
  engagement: '6.8%',
  campaigns: '48',
  about: 'Fitness-first creator blending tech reviews with wellness content. Known for high-trust, community-driven storytelling. Works best with purpose-led brands focused on real outcomes.',
  categories: ['Fitness', 'Comedy', 'Travel', 'Infra', 'Label', 'Comedy'],
  gender: { female: 60, male: 40 },
  ageGroups: [
    { range: '12-18', val: 75 }, { range: '19-24', val: 45 },
    { range: '24-34', val: 55 }, { range: '35-45', val: 30 },
    { range: '46-55', val: 40 }, { range: '56-65', val: 25 },
    { range: '65+',   val: 35 },
  ],
  locations: [
    { country: 'IN',  val: 70 }, { country: 'DL',  val: 60 },
    { country: 'USA', val: 50 }, { country: 'NY',  val: 45 },
    { country: 'UK',  val: 40 }, { country: 'LON', val: 35 },
    { country: 'UAE', val: 30 }, { country: 'DUB', val: 25 },
  ],
  topCampaigns: [
    { name: 'Nike Campaign',    engagement: '71%', followers: '1.4M' },
    { name: 'Apple Campaign',   engagement: '65%', followers: '1.2M' },
    { name: 'Samsung Campaign', engagement: '58%', followers: '1.1M' },
  ],
  reviews: [
    { brand: 'Nike India', role: 'Marketing Lead', rating: 5, text: 'Aarya delivered beyond brief. Authenticity was off the charts — DMs flooded with leads.' },
    { brand: 'Nike India', role: 'Marketing Lead', rating: 5, text: 'Aarya delivered beyond brief. Authenticity was off the charts — DMs flooded with leads.' },
  ],
};

export default function InfluencerProfilePanel({ inf = {}, profileData, isInvited, onInvite, onBack }) {
  const router = useRouter();
  const [toast, setToast] = useState(false);

  const handleInvite = () => {
    if (onInvite) { onInvite(); setToast(true); setTimeout(() => setToast(false), 2500); }
  };

  const profile = { ...DEFAULT_PROFILE, ...profileData };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: C.panel }}>
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl text-sm shadow-xl" style={{ background: '#333', color: C.white }}>
          Invite sent
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* ── HERO BANNER + OVERLAPPING AVATAR ── */}
        <div className="relative flex-shrink-0">
          <div className="w-full h-[200px] overflow-hidden" style={{ borderRadius: '28px 28px 0 0' }}>
            <div className="w-full h-full flex items-end px-6 pb-6" style={{ background: 'linear-gradient(135deg,#0d2818 0%,#073d1b 40%,rgba(22,163,74,0.13) 100%)' }}>
              <p className="text-white/10 font-black leading-none select-none" style={{ fontFamily: 'Bricolage Grotesque,sans-serif', fontSize: 'clamp(36px,5vw,68px)' }}>
                {profile.name.toUpperCase()}
              </p>
            </div>
          </div>
          <div
            className="absolute left-6 bottom-0 translate-y-1/2 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center z-10"
            style={{ width: 100, height: 100, background: inf.avatarColor || '#067635', border: '4px solid #181818', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
          />
          <div className="absolute z-20 rounded-full bg-[#16A34A]" style={{ left: 86, bottom: -40, width: 14, height: 14, border: '2px solid #181818' }} />
          <button className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 hover:bg-white/10" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
            <BookmarkLine className="w-4 h-4" style={{ color: C.white }} />
          </button>
        </div>

        {/* ── NAME + INFO ── */}
        <div className="px-5 pb-4" style={{ paddingLeft: 144, paddingTop: 10 }}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-[22px] leading-[1.2] font-bold" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{profile.name}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: '#0a4620', color: C.green }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block" />verified
            </span>
          </div>
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif' }}>
            {profile.username}{profile.location ? ` · ${profile.location}` : ''}
          </p>
        </div>

        {/* ── CATEGORIES + STATS ── */}
        <div className="px-5 pb-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {profile.categories.map((cat, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.12)', color: C.white, fontFamily: 'Inter, sans-serif' }}>
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Followers',  val: profile.followers },
              { label: 'Engagement', val: profile.engagement },
              { label: 'Campaigns',  val: profile.campaigns },
            ].map(({ label, val }) => (
              <div key={label} className="text-center rounded-[12px] py-4" style={{ background: C.card }}>
                <p className="text-[22px] leading-[1.2] font-normal" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{val}</p>
                <p className="text-[14px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Biography */}
        <div className="px-5 pt-2 pb-5">
          <p className="mb-2" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Biography</p>
          <p className="text-sm leading-6" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{profile.about}</p>
        </div>

        {/* Top Campaigns */}
        <div className="px-5 mb-5 pb-5">
          <div className="flex justify-between items-center mb-3">
            <p style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Top Campaigns</p>
            <button className="flex items-center gap-1.5 text-xs" style={{ color: C.green, fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View All
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {profile.topCampaigns.map((camp, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-[8px]" style={{ background: C.card }}>
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-[4px]" style={{ background: inf.avatarColor || '#555' }} />
                  <div>
                    <span className="block" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 16 }}>{camp.name}</span>
                    <span className="block text-xs" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{profile.username}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[16px]" style={{ color: C.green, fontFamily: 'Inter, sans-serif' }}>{camp.engagement} eng.</span>
                  <span className="block text-[13px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{camp.followers} followers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Insights */}
        <div className="px-5 mb-5 pb-5">
          <p className="mb-4" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Audience Insights</p>

          {/* Gender */}
          <div className="mb-6 rounded-[24px] p-5 relative overflow-hidden" style={{ background: C.card, minHeight: 220 }}>
            <p className="text-[16px] font-semibold mb-2" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Gender</p>
            <div className="absolute right-5 top-5 flex gap-4 text-[12px]" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>
              <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#8FC2A5' }} />Female</span>
              <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: C.green }} />Male</span>
            </div>
            <div className="flex items-center justify-center pt-2">
              <div className="relative w-[171px] h-[171px] rounded-full border-[18px]" style={{ borderColor: 'rgba(67,160,71,0.18)' }}>
                <div className="absolute inset-0 rounded-full border-[18px] border-transparent border-r-[#8FC2A5] border-b-[#8FC2A5] border-l-transparent border-t-transparent rotate-45" />
                <div className="absolute left-[118px] top-[33px] bg-[#8FC2A5] text-black text-[12px] rounded-[4px] px-2 py-1 font-semibold">{profile.gender.female}%</div>
                <div className="absolute left-[20px] bottom-[25px] bg-[#067635] text-white text-[12px] rounded-[4px] px-2 py-1 font-semibold">{profile.gender.male}%</div>
              </div>
            </div>
          </div>

          {/* Age Groups */}
          <div className="mb-6 rounded-[24px] p-5" style={{ background: C.card }}>
            <p className="text-[16px] font-semibold mb-3" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Age groups</p>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between h-[226px] text-[12px]" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>
                <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
              </div>
              <div className="flex-1 flex items-end gap-1 h-[226px]">
                {profile.ageGroups.map((group, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full rounded-t-[8px]" style={{ background: C.green, height: `${Math.max(group.val * 1.8, 8)}px` }} />
                    <p className="text-[12px] mt-2" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>{group.range}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Locations */}
          <div className="rounded-[24px] p-5" style={{ background: C.card }}>
            <p className="text-[16px] font-semibold mb-3" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Top locations</p>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between h-[226px] text-[12px]" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>
                <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
              </div>
              <div className="flex-1 flex items-end gap-1 h-[226px]">
                {profile.locations.map((loc, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full rounded-t-[8px]" style={{ background: i % 2 === 0 ? C.green : '#8FC2A5', height: `${Math.max(loc.val * 1.8, 8)}px` }} />
                    <p className="text-[12px] mt-2" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>{loc.country}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Highlights */}
        <div className="px-5 mb-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <p style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Content highlights</p>
            <div className="px-3 py-1 rounded-full text-[14px]" style={{ background: C.card, color: C.white, fontFamily: 'Inter, sans-serif' }}>Reels</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[0.62] rounded-[16px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#EC4899,#D946EF)' }}>
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 flex items-end p-3">
                  <div className="flex gap-1 text-[12px]" style={{ color: C.white, fontFamily: 'Work Sans, sans-serif' }}>
                    <span>❤️ 62K</span>
                    <span>💬 10K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Reviews */}
        <div className="px-5 mb-32">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[64px] leading-none font-bold" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>4.9</div>
            <div className="text-right">
              <div className="text-yellow-400 text-[18px]">★★★★★</div>
              <p className="text-[14px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>31 brand reviews</p>
            </div>
          </div>
          <p className="mb-3" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Campaign Reviews</p>
          <div className="space-y-3">
            {profile.reviews.map((review, i) => (
              <div key={i} className="rounded-[16px] p-4 border border-white/5" style={{ background: C.card }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[20px] font-bold" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{review.brand}</p>
                    <p className="text-[14px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{review.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <span key={j} style={{ color: '#FCD34D', fontSize: '14px' }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-[14px] leading-6" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-white/10 bg-[#0d0d0d] flex gap-3">
        <button
          onClick={handleInvite}
          className="flex-1 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            background: C.card,
            color: C.white,
            borderRadius: 40,
            padding: '10px 24px',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <UserAddLine style={{ width: 18, height: 18 }} />
          {isInvited ? '✓ Invited' : 'Invite'}
        </button>
        <button
          onClick={() => router.push(`/brand/inbox/${inf.id || ''}?name=${encodeURIComponent(profile.name)}`)}
          className="flex-1 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            background: C.green,
            color: C.white,
            borderRadius: 40,
            padding: '10px 24px',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Message3Line style={{ width: 18, height: 18 }} />
          Send Message
        </button>
      </div>
    </div>
  );
}
