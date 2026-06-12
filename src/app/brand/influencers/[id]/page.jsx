'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookmarkLine, UserAddLine, Message3Line } from '@phyoofficial/phyo-icon-library';
import { influencerApi } from '@/api/influencer-api';

/* ── chart data from Figma ── */
const AGE_BARS = [
  { label: '12-18', h: 150 },
  { label: '19-24', h: 110 },
  { label: '24-34', h: 120 },
  { label: '35-45', h: 70  },
  { label: '46-55', h: 110 },
  { label: '65+',   h: 90  },
];
const LOC_BARS = [
  { label: 'In',  h: 150, primary: true  },
  { label: 'DL',  h: 140, primary: false },
  { label: 'USA', h: 120, primary: true  },
  { label: 'NY',  h: 140, primary: false },
  { label: 'UK',  h: 110, primary: true  },
  { label: 'Lon', h: 85,  primary: false },
];
const MAX_H = 150;
const CHART_H = 160;

function VerticalBarChart({ bars }) {
  const barW = 22; const gap = 30; const labW = 36;
  const w = labW + bars.length * (barW + gap) - gap + 8;
  const yLabels = ['100%', '80%', '60%', '40%', '20%', '0%'];
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${CHART_H + 28}`} style={{ overflow: 'visible' }}>
      {yLabels.map((l, i) => (
        <text key={l} x={labW - 4} y={4 + (CHART_H / 5) * i} fontSize="9" fill="#9B9B9B" textAnchor="end" fontFamily="Inter,sans-serif" dominantBaseline="middle">{l}</text>
      ))}
      {yLabels.map((_, i) => (
        <line key={i} x1={labW} y1={4 + (CHART_H / 5) * i} x2={w} y2={4 + (CHART_H / 5) * i} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {bars.map((b, i) => {
        const bh = (b.h / MAX_H) * CHART_H;
        const x  = labW + i * (barW + gap);
        return (
          <g key={b.label}>
            <rect x={x} y={CHART_H - bh + 4} width={barW} height={bh} rx="4" fill={b.primary === false ? '#8FC2A5' : '#067635'} />
            <text x={x + barW / 2} y={CHART_H + 18} fontSize="9" fill="#9B9B9B" textAnchor="middle" fontFamily="Inter,sans-serif">{b.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GenderPie() {
  const r = 52; const cx = 62; const cy = 62;
  const maleAng = 2 * Math.PI * 0.62;
  const femAng  = 2 * Math.PI * 0.36;
  const arc = (s, e, rad) => {
    const x1 = cx + rad * Math.cos(s - Math.PI / 2), y1 = cy + rad * Math.sin(s - Math.PI / 2);
    const x2 = cx + rad * Math.cos(e - Math.PI / 2), y2 = cy + rad * Math.sin(e - Math.PI / 2);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${rad} ${rad} 0 ${e - s > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`;
  };
  return (
    <div className="flex items-center gap-5">
      <svg width="124" height="124" viewBox="0 0 124 124" className="flex-shrink-0">
        <path d={arc(0, maleAng, r)} fill="#067635" />
        <path d={arc(maleAng, maleAng + femAng, r)} fill="#8FC2A5" />
        <circle cx={cx} cy={cy} r={r * 0.5} fill="#262626" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="Bricolage Grotesque,sans-serif">62%</text>
      </svg>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#067635] flex-shrink-0" />
          <span className="text-white text-[13px]" style={{ fontFamily: 'Inter,sans-serif' }}>Male — <strong>62%</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8FC2A5] flex-shrink-0" />
          <span className="text-white text-[13px]" style={{ fontFamily: 'Inter,sans-serif' }}>Female — <strong>36%</strong></span>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, children }) {
  return (
    <div className="bg-[#262626] rounded-2xl p-4 flex flex-col gap-3">
      <p className="text-white text-[15px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque,sans-serif', letterSpacing: '-0.02em' }}>{title}</p>
      {children}
    </div>
  );
}

export default function InfluencerDetailPage() {
  const params  = useParams();
  const router  = useRouter();

  const [apiData,  setApiData]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    influencerApi.getInfluencerById(params.id)
      .then(setApiData).catch(console.error).finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#000201]">
      <div className="w-10 h-10 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!apiData) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#000201]">
      <p className="text-sm text-[#9A9A9A]">Influencer not found</p>
    </div>
  );

  const name     = apiData.profile?.name        || apiData.name        || 'Influencer';
  const username = `@${apiData.profile?.username || apiData.username   || 'unknown'}`;
  const location = apiData.profile?.location    || 'Mumbai, India';
  const bio      = apiData.profile?.bio          || apiData.about       || 'Fitness-first creator blending tech reviews with wellness content. Known for high-trust, community-driven storytelling. Works best with purpose-led brands focused on real outcomes.';
  const avatar   = apiData.profile?.profileImage || apiData.profileImage || null;
  const tags     = (apiData.profile?.niche ? [apiData.profile.niche] : ['Fitness', 'Comedy', 'Lifestyle', 'Real Estate', 'Travel', 'Infra']);
  const followers  = String(apiData.stats?.followers  || '2.4M');
  const engagement = `${(apiData.stats?.avgEngagementRate || 6.8).toFixed(1)}%`;
  const campaigns  = String(apiData.stats?.campaigns  || '48');
  const initial    = name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#000201] pr-5 py-6 pb-24">
      <div className="w-full flex flex-col gap-5">

        {/* ── HERO BANNER + AVATAR ── */}
        <div className="relative">
          <div className="w-full h-[260px] rounded-3xl overflow-hidden">
            {avatar ? (
              <Image src={avatar} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-end p-8" style={{ background: 'linear-gradient(135deg, #0d2818 0%, #073d1b 40%, #16A34A22 100%)' }}>
                <p className="text-white/10 font-black leading-none select-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 'clamp(48px, 8vw, 96px)' }}>
                  {name.toUpperCase()}
                </p>
              </div>
            )}
          </div>
          {/* Avatar overlapping */}
          <div className="absolute left-8 bottom-0 translate-y-1/2 w-[148px] h-[148px] rounded-full border-4 border-[#000201] overflow-hidden flex items-center justify-center z-10"
            style={{ background: 'linear-gradient(135deg,#16A34A,#0a4620)', boxShadow: '0px 0px 74px rgba(0,0,0,0.55)' }}>
            {avatar
              ? <Image src={avatar} alt={name} width={148} height={148} className="w-full h-full object-cover" />
              : <span className="text-white font-black select-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 56 }}>{initial}</span>
            }
          </div>
          {/* Online dot */}
          <div className="absolute z-20 rounded-full bg-[#16A34A] border-2 border-[#000201]" style={{ left: 128, bottom: -52, width: 18, height: 18 }} />
          {/* Bookmark + more top-right */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button onClick={() => setSaved(s => !s)} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer' }}>
              <BookmarkLine className="w-5 h-5" style={{ color: saved ? '#16A34A' : '#fff' }} />
            </button>
          </div>
        </div>

        {/* ── NAME + INFO — indented to clear avatar ── */}
        <div className="flex flex-col gap-3" style={{ paddingTop: 12, paddingLeft: 196 }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[32px] font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-bricolage-grotesque)', letterSpacing: '-0.01em' }}>
              {name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#0a4620] text-[#16A34A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block" />
              verified
            </span>
          </div>
          <p className="text-[15px] text-[#9A9A9A]" style={{ fontFamily: 'Inter,sans-serif' }}>{username}&nbsp;&nbsp;·&nbsp;&nbsp;{location}</p>
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-[12px] font-medium bg-[rgba(255,255,255,0.1)] text-white">
                {t}
              </span>
            ))}
          </div>
          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              className="h-12 px-8 rounded-full text-white bg-[#16A34A] hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 400 }}
              onClick={() => console.log('hire')}
            >
              Hire Influencer
            </button>
            <button
              className="h-12 px-8 rounded-full text-white border border-[#444] hover:border-[#16A34A] transition-colors"
              style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 400 }}
              onClick={() => router.push(`/brand/inbox/${params?.id}`)}
            >
              Send Message
            </button>
          </div>
        </div>

        {/* ── TWO-COLUMN GRID ── */}
        <div className="grid grid-cols-2 gap-5">

          {/* LEFT */}
          <div className="flex flex-col gap-5">

            {/* Stats + Bio */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-[#4A4A4A]">
                {[
                  { v: followers,  l: 'Followers'  },
                  { v: engagement, l: 'Engagement' },
                  { v: campaigns,  l: 'Campaigns'  },
                ].map((s) => (
                  <div key={s.l} className="flex flex-col items-center gap-1 px-3">
                    <p className="text-white text-[22px] font-normal" style={{ fontFamily: 'var(--font-bricolage-grotesque)', lineHeight: '120%' }}>{s.v}</p>
                    <p className="text-[#9B9B9B] text-[14px]" style={{ fontFamily: 'Inter,sans-serif' }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="h-px bg-[#262525]" />
              {/* Bio */}
              <div>
                <p className="text-white text-[22px] font-semibold mb-3" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Biography</p>
                <p className="text-[#9A9A9A] text-[15px] leading-relaxed" style={{ fontFamily: 'Inter,sans-serif' }}>{bio}</p>
              </div>
            </div>

            {/* Top Campaigns */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="text-white text-[22px] font-semibold" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Top Campaigns</p>
                <button className="flex items-center gap-1.5 text-[#16A34A] text-[14px]" style={{ fontFamily: 'Inter,sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  View All
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
                  </svg>
                </button>
              </div>
              <div className="h-px bg-[#262525]" />
              <div className="flex flex-col gap-2">
                {[
                  { color: '#067635' }, { color: '#8B5CF6' }, { color: '#EC4899' },
                ].map((c, i) => (
                  <div key={i} className="bg-[#262626] rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: c.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[15px] font-medium leading-tight" style={{ fontFamily: 'Bricolage Grotesque,sans-serif' }}>Dadi Cool</p>
                      <p className="text-[#9B9B9B] text-[12px] mt-0.5" style={{ fontFamily: 'Inter,sans-serif' }}>@dadi_cool</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#067635] text-[14px] font-semibold" style={{ fontFamily: 'Inter,sans-serif' }}>7.1% eng.</p>
                      <p className="text-[#9B9B9B] text-[12px] mt-0.5" style={{ fontFamily: 'Inter,sans-serif' }}>1.4M followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Highlights */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="text-white text-[22px] font-semibold" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Content Highlights</p>
                <span className="bg-[#262626] text-white px-3 py-1 rounded-full text-[13px] flex items-center gap-1" style={{ fontFamily: 'Inter,sans-serif' }}>Reels ▼</span>
              </div>
              <div className="h-px bg-[#262525]" />
              <div className="flex gap-3">
                {[
                  'linear-gradient(160deg,#EC4899,#D946EF)',
                  'linear-gradient(160deg,#8B5CF6,#6366F1)',
                  'linear-gradient(160deg,#067635,#16A34A)',
                ].map((bg, i) => (
                  <div key={i} className="flex-1 rounded-2xl overflow-hidden relative" style={{ aspectRatio: '160/260', background: bg }}>
                    <div className="absolute inset-x-0 bottom-0 pt-6 pb-2 flex justify-center gap-3" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.65),transparent)' }}>
                      <span className="text-white text-[10px]" style={{ fontFamily: 'Inter,sans-serif' }}>♥ 62K</span>
                      <span className="text-white text-[10px]" style={{ fontFamily: 'Inter,sans-serif' }}>💬 10K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT — Audience Insights */}
          <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-4">
            <p className="text-white text-[22px] font-semibold" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Audience Insights</p>
            <div className="h-px bg-[#262525]" />

            <InsightCard title="Gender">
              <GenderPie />
            </InsightCard>

            <InsightCard title="Age groups">
              <VerticalBarChart bars={AGE_BARS} />
            </InsightCard>

            <InsightCard title="Top locations">
              <VerticalBarChart bars={LOC_BARS} />
              <div className="flex gap-4 pl-8">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#067635]" />
                  <span className="text-white text-[11px]" style={{ fontFamily: 'Inter,sans-serif' }}>Top Countries</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8FC2A5]" />
                  <span className="text-white text-[11px]" style={{ fontFamily: 'Inter,sans-serif' }}>Top Cities</span>
                </div>
              </div>
            </InsightCard>
          </div>

        </div>

        {/* ── CAMPAIGN REVIEWS (full width) ── */}
        <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-white text-[22px] font-semibold" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Campaign Reviews</p>
            <button className="flex items-center gap-1.5 text-[#16A34A] text-[14px]" style={{ fontFamily: 'Inter,sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View All
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
              </svg>
            </button>
          </div>
          <div className="h-px bg-[#262525]" />
          {/* Overall rating */}
          <div className="flex items-center gap-5">
            <p className="text-white font-bold leading-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 64 }}>4.9</p>
            <div>
              <div className="flex gap-1 mb-1.5">
                {[1,2,3,4,5].map(s => <span key={s} className="text-[#FAB70C] text-[20px]">★</span>)}
              </div>
              <p className="text-[#9A9A9A] text-[14px]" style={{ fontFamily: 'Inter,sans-serif' }}>31 brand reviews</p>
            </div>
          </div>
          {/* Review cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { brand: 'Nike India', role: 'Marketing Lead', quote: '"Aanya delivered beyond brief. Authenticity was off the charts — DMs flooded with leads."' },
              { brand: 'Nike India', role: 'Marketing Lead', quote: '"Aanya delivered beyond brief. Authenticity was off the charts — DMs flooded with leads."' },
            ].map((r, i) => (
              <div key={i} className="bg-[#262626] rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0d2818] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#16A34A] font-bold text-[16px]">N</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-[18px]" style={{ fontFamily: 'Bricolage Grotesque,sans-serif' }}>{r.brand}</p>
                      <p className="text-[#9A9A9A] text-[13px] font-medium mt-0.5" style={{ fontFamily: 'Inter,sans-serif' }}>{r.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-[#FAB70C] text-[13px]">★</span>)}
                  </div>
                </div>
                <p className="text-[#9A9A9A] text-[13px] leading-[1.5]" style={{ fontFamily: 'Inter,sans-serif' }}>{r.quote}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── STICKY BOTTOM BUTTONS ── */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-5 px-6 py-3 bg-[#000201] border-t border-white/5 z-50">
        <button
          className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.1)', fontFamily: 'Inter,sans-serif', fontSize: 16, border: 'none', cursor: 'pointer' }}
          onClick={() => console.log('hire')}
        >
          <UserAddLine className="w-4 h-4" />
          Hire employee
        </button>
        <button
          className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-white bg-[#16A34A] hover:opacity-90 transition-opacity"
          style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, border: 'none', cursor: 'pointer' }}
          onClick={() => router.push(`/brand/inbox/${params?.id}`)}
        >
          <Message3Line className="w-4 h-4" />
          Send Message
        </button>
      </div>
    </div>
  );
}
