'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LineChartLine, UserLine, BarChartLine } from '@phyoofficial/phyo-icon-library';
import { useRoleContext } from '@/app/context/RoleContext';
import { campaignApi } from '@/api';
import { SpendingBudgetGraph } from '@/components/SpendingBudgetGraph';
import { LineChartGraph } from '@/components/AudienceEngagementGraphs';
import { useCampaigns } from '@/hooks/useCampaigns';

/* ─── normalisers ─── */
const normalizeId = (item, fallback = '') => item?._id || item?.id || fallback;
const normalizeList = (value) => (Array.isArray(value) ? value : []);

const normalizeApplication = (a) => ({
  ...a,
  id: normalizeId(a),
  name: a?.influencer?.name || a?.name || a?.profile?.name || 'Unknown',
  username: a?.influencer?.username || a?.username || '',
  avatar: a?.influencer?.profilePicture || a?.avatar || a?.profilePicture || '/dummyAvatar.jpg',
  bio: a?.influencer?.bio || a?.bio || a?.message || a?.description || '',
  status: a?.status || 'pending',
  followerCount: a?.influencer?.followerCount || a?.followerCount,
  engagementRate: a?.influencer?.engagementRate || a?.engagementRate,
  niche: normalizeList(a?.influencer?.niche || a?.niche),
  influencerId: normalizeId(a?.influencer || { _id: a?.influencerId }),
});


/* ─── field helpers from actual API shape ─── */
function parseCampaignTypes(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function fmtFollower(n) {
  if (!n && n !== 0) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusLabel(s) {
  const map = { PUBLISHED: 'published', ACTIVE: 'on going', DRAFT: 'draft', COMPLETED: 'completed' };
  return map[s] || (s?.toLowerCase() ?? 'draft');
}

/* ─── UI atoms ─── */
function SectionCard({ title, children, action }) {
  return (
    <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, lineHeight: '120%', textTransform: 'capitalize' }}>
          {title}
        </p>
        {action}
      </div>
      <div className="h-px bg-[#949494]" />
      {children}
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, lineHeight: '120%' }}>{label}</span>
      {children}
    </div>
  );
}

function TagPill({ children }) {
  return (
    <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#0d2818] text-[#16A34A] border border-[#16A34A]/20">
      {children}
    </span>
  );
}

function GrayPill({ children }) {
  return (
    <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#262525] text-[#9A9A9A]">
      {children}
    </span>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { role } = useRoleContext();
  const campaignId = params.id;

  const { selectedCampaign, loading, fetchCampaignById } = useCampaigns();
  const [activeTab, setActiveTab] = useState('overview');

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignById(campaignId);
      fetchApplications(campaignId);
    }
  }, [campaignId, fetchCampaignById]);

  const fetchApplications = async (id) => {
    setLoadingApplications(true);
    try {
      const res = await campaignApi.getCampaignApplications(id, { page: 1, limit: 10 });
      setApplications(normalizeList(res.applications).map(normalizeApplication));
    } catch {
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };


  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#000201]">
        <div className="w-10 h-10 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const campaign = selectedCampaign;
  if (!campaign) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#000201]">
        <p className="text-sm text-[#9A9A9A]">Campaign not found</p>
      </div>
    );
  }

  /* ── derive display values from actual API fields ── */
  const brandName = campaign.brandId?.companyName || campaign.campaignName || 'Brand';
  const brandInitial = brandName.charAt(0).toUpperCase();
  const productImages = normalizeList(campaign.productImages);

  const campaignTypes = parseCampaignTypes(campaign.campaignType || campaign.types);
  const interests = normalizeList(campaign.targetInfluencer?.targetNiche || campaign.targetInfluencer?.interests);
  const countries = normalizeList(campaign.targetInfluencer?.countries);
  const genders = normalizeList(campaign.targetInfluencer?.gender);
  const infCount = campaign.targetInfluencer?.numberOfInfluencers;
  const ageMin = campaign.targetInfluencer?.ageRange?.min ?? 18;
  const ageMax = campaign.targetInfluencer?.ageRange?.max ?? 35;
  const followerMin = campaign.targetInfluencer?.followerCount?.min;
  const followerMax = campaign.targetInfluencer?.followerCount?.max;
  const followerStr = followerMin != null && followerMax != null
    ? `${fmtFollower(followerMin)} – ${fmtFollower(followerMax)}`
    : '—';

  const startDate = campaign.timelines?.campaignStartDate || campaign.timelines?.startDate;
  const endDate = campaign.timelines?.campaignEndDate || campaign.timelines?.endDate;
  const appDeadline = campaign.timelines?.applicationDeadline;
  const createdAt = campaign.createdAt;

  const budget = campaign.budget;
  const compensation = campaign.compensation;

  const deliverables = normalizeList(campaign.deliverables);
  const status = campaign.status;
  const isActive = status === 'ACTIVE' || status === 'PUBLISHED';

  const TABS = ['overview', 'influencers', 'analytics'];

  return (
    <div className="min-h-screen bg-[#000201] pr-8 py-6">
      <div className="w-full flex flex-col gap-5">

        {/* ── HERO BANNER + AVATAR ── */}
        <div className="relative">
          {/* Banner */}
          <div className="w-full h-[260px] rounded-3xl overflow-hidden">
            {productImages[0] ? (
              <img src={productImages[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-end p-8"
                style={{ background: 'linear-gradient(135deg, #0d2818 0%, #073d1b 40%, #16A34A22 100%)' }}
              >
                <p
                  className="text-white/10 font-black leading-none select-none"
                  style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 'clamp(48px, 8vw, 96px)' }}
                >
                  {brandName.toUpperCase()}
                </p>
              </div>
            )}
          </div>

          {/* Avatar — half inside banner, half below */}
          <div
            className="absolute left-8 bottom-0 translate-y-1/2 w-[148px] h-[148px] rounded-full border-4 border-[#000201] overflow-hidden flex items-center justify-center z-10"
            style={{ background: 'linear-gradient(135deg, #16A34A, #0a4620)' }}
          >
            <span className="text-white font-black select-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 56 }}>
              {brandInitial}
            </span>
          </div>
        </div>

        {/* ── CAMPAIGN INFO — indented to clear avatar ── */}
        <div className="flex flex-col gap-3" style={{ paddingTop: 12, paddingLeft: 180 }}>
          {/* name + status */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-white leading-tight" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 32, fontWeight: 400, lineHeight: '120%' }}>
              {campaign.campaignName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#0a4620] text-[#16A34A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block" />
              {statusLabel(status)}
            </span>
          </div>

          {campaign.campaignBrief && (
            <p className="leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#E4E4E4', lineHeight: '160%' }}>
              {campaign.campaignBrief}
            </p>
          )}

          {/* action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              className="h-12 px-8 rounded-full text-white bg-[#16A34A] hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400 }}
              onClick={() => router.push(`/${role}/campaigns/new-applications?campaignId=${campaignId}`)}
            >
              Join Campaign
            </button>
            <button
              className="h-12 px-8 rounded-full text-white border border-[#444] hover:border-[#16A34A] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400 }}
              onClick={() => router.push(`/${role}/campaigns/preview-campaign?campaignId=${campaignId}`)}
            >
              Preview Campaign
            </button>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="flex bg-[#181818] rounded-full p-1.5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 h-12 rounded-full transition-all"
              style={{
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#000' : '#9b9b9b',
                fontFamily: 'Inter, sans-serif',
                fontSize: 20,
                fontWeight: 400,
              }}
            >
              {tab === 'overview' ? 'Overview' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ══════════════ OVERVIEW ══════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* 2-col grid */}
            <div className="grid grid-cols-2 gap-5">

              {/* LEFT */}
              <div className="flex flex-col gap-5">

                {/* Campaign Details - Figma Design */}
                <SectionCard title="Campaign Details">
                  <div className="flex flex-col gap-5">
                    {/* Campaign Type */}
                    <div className="flex flex-col gap-2">
                      <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Campaign Type</span>
                      <div className="flex flex-wrap gap-3">
                        {campaignTypes.length > 0
                          ? campaignTypes.map((t) => (
                            <div
                              key={t}
                              className="px-6 py-1 rounded-full"
                              style={{
                                border: '1px solid #9B9B9B',
                                backgroundColor: 'transparent',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 14,
                                fontWeight: 400,
                                color: '#9B9B9B',
                                lineHeight: '120%',
                                textTransform: 'capitalize'
                              }}
                            >
                              {t}
                            </div>
                          ))
                          : <span style={{ color: '#9B9B9B' }}>—</span>}
                      </div>
                    </div>

                    {/* Target Countries */}
                    <div className="flex flex-col gap-2">
                      <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Target Countries</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#9B9B9B', lineHeight: '120%' }}>
                        {countries.length > 0 ? countries.join(', ') : '—'}
                      </span>
                    </div>

                    {/* Campaign Period */}
                    <div className="flex flex-col gap-2">
                      <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Campaign Period</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#9B9B9B', lineHeight: '120%' }}>
                        {startDate && endDate ? `${fmtDate(startDate)} → ${fmtDate(endDate)}` : '—'}
                      </span>
                    </div>

                    {/* Campaign Budget */}
                    <div className="flex flex-col gap-2">
                      <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Campaign Budget</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#9B9B9B', lineHeight: '120%' }}>
                        {budget ? `₹${Number(budget).toLocaleString('en-IN')}` : '—'}
                      </span>
                    </div>
                  </div>
                </SectionCard>

                {/* Influencer Targeting - Simplified Design */}
                <SectionCard title="Influencer Targeting">
                  <div className="flex flex-col gap-5">
                    {/* Influencers Count */}
                    <div className="flex flex-col gap-2">
                      <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Influencers</span>
                      <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, color: '#FFFFFF', lineHeight: '120%' }}>
                        {infCount ?? '—'}
                      </span>
                    </div>

                    {/* Follower Range */}
                    <div className="flex flex-col gap-2">
                      <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Follower Range</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#9B9B9B', lineHeight: '120%' }}>
                        {followerStr}
                      </span>
                    </div>

                    {/* Age Range */}
                    <div className="flex flex-col gap-2">
                      <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Age Range</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#9B9B9B', lineHeight: '120%' }}>
                        {ageMin} – {ageMax} Years
                      </span>
                    </div>

                    {/* Interests */}
                    {interests.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '120%' }}>Interests</span>
                        <div className="flex flex-wrap gap-3">
                          {interests.map((i) => (
                            <div
                              key={i}
                              className="px-3 py-1 rounded-full"
                              style={{
                                background: '#181818',
                                border: '1px solid #9B9B9B',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 12,
                                fontWeight: 400,
                                color: '#9B9B9B',
                                lineHeight: '120%',
                                textTransform: 'capitalize'
                              }}
                            >
                              {i}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-5">

                {/* Action Required - Exact Figma Design */}
                <SectionCard title="Action Required">
                  {applications.length > 0 ? (
                    <div className="rounded-[16px] relative w-full" style={{ background: '#432004', height: '220px' }}>
                      {/* Header: Status + Time - stretches full width */}
                      <div className="absolute w-full px-5" style={{ top: '10px', height: '16px' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: '#9B9B9B', lineHeight: '16px', letterSpacing: '1.33%' }}>
                          Pending Review • 2 hours ago
                        </span>
                      </div>

                      {/* Avatar + Info - stretches with padding */}
                      <div className="absolute w-full px-5 flex items-center gap-2" style={{ top: '40px' }}>
                        {/* Avatar 40x40 */}
                        <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-[#763d06]" style={{ width: '40px', height: '40px' }}>
                          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 24, fontWeight: 500, color: '#FFFFFF', lineHeight: '24px', textAlign: 'center', letterSpacing: '0.42%' }}>
                            {applications[0]?.name?.charAt(0)?.toUpperCase() || 'A'}
                          </span>
                        </div>
                        {/* Name + Description - flex to take remaining space */}
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <p className="text-white truncate" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 16, fontWeight: 400, lineHeight: '120%', margin: 0 }}>
                            {applications[0].name} submitted deliverables
                          </p>
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: '#9B9B9B', lineHeight: '120%', margin: 0 }}>
                            Instagram Post + Story ready for review
                          </p>
                        </div>
                      </div>

                      {/* Divider - stretches full width */}
                      <div
                        className="absolute left-[5%] w-[90%]"
                        style={{
                          top: '100px',
                          height: '1px',
                          background: '#626262',
                        }}
                      />

                      {/* Deliverable Images - at 20, 113 */}
                      <div className="absolute flex items-center" style={{ left: '20px', top: '113px', width: '370px', gap: '-8px', padding: '8px 16px' }}>
                        {[0, 1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className="flex-shrink-0"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '4px',
                              border: '1px solid #E6E6E6',
                              background: '#404040',
                              marginLeft: idx > 0 ? '-8px' : '0'
                            }}
                          />
                        ))}
                      </div>

                      {/* Review Button - at 230, 177 */}
                      <button
                        className="absolute rounded-full hover:opacity-90 transition-opacity"
                        style={{
                          left: '230px',
                          top: '177px',
                          width: '160px',
                          height: '32px',
                          background: '#763d06',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 14,
                          fontWeight: 400,
                          color: '#FFFFFF',
                          lineHeight: '120%',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => router.push(`/${role}/campaigns/influencer-detail-deliverables?campaignId=${campaignId}`)}
                      >
                        Review now
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-[16px] flex flex-col items-center justify-center w-full" style={{ background: '#262525', height: '227px' }}>
                      <p className="text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9A9A9A', lineHeight: '140%', margin: 0 }}>No pending actions</p>
                      <p className="text-center mt-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9A9A9A', lineHeight: '140%', margin: 0 }}>
                        Actions will appear here when influencers apply or submit work
                      </p>
                    </div>
                  )}
                </SectionCard>

                {/* Deliverables */}
                <SectionCard title="Deliverables" action={
                  <span className="w-7 h-7 rounded-full bg-[#16A34A]/20 flex items-center justify-center text-[12px] text-[#16A34A] font-bold">
                    {deliverables.length}
                  </span>
                }>
                  {deliverables.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {deliverables.map((item, idx) => (
                        <div key={item._id || idx} className="rounded-2xl px-4 py-3 flex items-center gap-3 bg-[#073d1b]">
                          {/* icon with deliverable type indicator */}
                          <div className="w-8 h-8 rounded-full bg-[#0d4f24] flex-shrink-0 flex items-center justify-center">
                            {idx % 3 === 0 ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="8.5" cy="8.5" r="1.5" fill="#16A34A" />
                                <path d="M3 14l5-5 4 4 3-3 6 6" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : idx % 3 === 1 ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M4 9h16M4 15h16M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          {/* text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white truncate" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, lineHeight: '120%' }}>{item.title}</p>
                            <p className="text-[11px] mt-0.5 text-[#9A9A9A] capitalize">UTC · {item.status}</p>
                          </div>
                          {/* count badge */}
                          <span className="w-6 h-6 rounded-full bg-[#16A34A] flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white">
                            {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9A9A9A', lineHeight: '140%', paddingBlock: '8px' }}>No deliverables defined</p>
                  )}
                </SectionCard>

                {/* Boost Campaign — Exact Figma Design */}
                <div
                  className="rounded-[24px] cursor-pointer relative overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(-41deg, rgba(22, 163, 74, 1) 0%, rgba(7, 54, 24, 1) 100%)',
                    height: '210px',
                    width: '100%'
                  }}
                  onClick={() => router.push(`/${role}/campaigns/boost-campaign?campaignId=${campaignId}`)}
                >
                  {/* Header Section - positioned at 80, 20 */}
                  <div className="absolute" style={{ left: '80px', top: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '20px' }}>
                    <p className="text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, lineHeight: '120%', margin: 0 }}>
                      Boost This Campaign
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, lineHeight: '160%', color: '#E4E4E4', margin: 0 }}>
                      <span style={{ lineHeight: '160%' }}>Amplify </span>
                      <span style={{ textTransform: 'lowercase', lineHeight: '160%' }}>reach &amp; engagement with advanced boost options.</span>
                    </p>
                  </div>

                  {/* Background Icon - positioned at 20, 20 */}
                  <div className="absolute" style={{ left: '20px', top: '20px', opacity: 0.1 }}>
                    <BarChartLine className="w-12 h-12 text-white" />
                  </div>

                  {/* Divider - positioned at 20, 125 */}
                  <div className="absolute" style={{ left: '20px', right: '20px', top: '125px', height: '1px', background: '#949494' }} />

                  {/* Benefits Section - spread across full width */}
                  <div className="absolute flex items-center justify-between w-full px-5" style={{ top: '145px' }}>
                    {/* Left: +50% reach */}
                    <div className="flex items-center gap-2">
                      <LineChartLine className="text-white flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                      <span className="text-white whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: '16px' }}>
                        +50% reach
                      </span>
                    </div>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '20px', background: '#949494' }} />

                    {/* Center: +10 influencers */}
                    <div className="flex items-center gap-2">
                      <UserLine className="text-white flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                      <span className="text-white whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: '16px' }}>
                        +10 influencers
                      </span>
                    </div>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '20px', background: '#949494' }} />

                    {/* Right: +65% ROI */}
                    <div className="flex items-center gap-2">
                      <BarChartLine className="text-white flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                      <span className="text-white whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: '16px' }}>
                        +65% ROI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Media — full width */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, lineHeight: '120%', textTransform: 'capitalize' }}>
                  Product Media
                </p>
                {productImages.length > 0 && (
                  <span className="w-7 h-7 rounded-full bg-[#262525] flex items-center justify-center text-[12px] text-white font-semibold">
                    {productImages.length}
                  </span>
                )}
              </div>
              <div className="h-px bg-[#949494]" />
              {productImages.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-5 gap-3 h-[200px]">
                    <div className="col-span-3 rounded-2xl overflow-hidden bg-[#262525]">
                      <img src={productImages[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-2 flex flex-col gap-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex-1 rounded-2xl overflow-hidden bg-[#262525]">
                          {productImages[i] && <img src={productImages[i]} alt="" className="w-full h-full object-cover" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  {productImages.length > 3 && (
                    <div className="grid grid-cols-4 gap-3 h-[140px]">
                      {[3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-2xl overflow-hidden bg-[#262525]">
                          {productImages[i] && <img src={productImages[i]} alt="" className="w-full h-full object-cover" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl bg-[#262525]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#9A9A9A" strokeWidth="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#9A9A9A" />
                    <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-[13px] text-[#9A9A9A]">No product images uploaded</p>
                </div>
              )}
            </div>

            {/* Timeline — full width */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
              <p className="text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, lineHeight: '120%', textTransform: 'capitalize' }}>
                Timeline
              </p>
              <div className="h-px bg-[#949494]" />
              <div className="relative flex justify-between px-2">
                {/* horizontal connector */}
                <div className="absolute top-[7px] left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-px bg-[#949494]" />
                {[
                  { label: 'Brief Created', date: createdAt, color: '#fff', done: true },
                  { label: 'Application Deadline', date: appDeadline, color: '#fff', done: !!appDeadline },
                  { label: 'Campaign Live', date: startDate, color: '#16A34A', done: isActive },
                  { label: 'Campaign End', date: endDate, color: '#4B5563', done: false },
                ].map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 z-10">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        background: m.done ? m.color : '#000201',
                        borderColor: m.color,
                      }}
                    />
                    <p className="text-white text-center leading-tight px-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, lineHeight: '120%' }}>{m.label}</p>
                    {m.date && (
                      <p className="text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9A9A9A', lineHeight: '120%' }}>{fmtDate(m.date)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════════ INFLUENCERS ══════════════ */}
        {activeTab === 'influencers' && (() => {
          const pending = applications.filter(a => a.status === 'pending');
          const approved = applications.filter(a => a.status === 'approved' || a.status === 'accepted');
          const selected = normalizeList(campaign.selectedInfluencers);
          const stats = [
            { value: applications.length, label: 'Total Influencers', active: true },
            { value: pending.length, label: 'New Applications', active: false },
            { value: selected.length || approved.length, label: 'Working On', active: false },
          ];
          const statusStyle = {
            pending: { bg: 'rgba(11,79,217,0.2)', border: '#0B4FD9', text: '#ffffff', label: 'Pending Review' },
            approved: { bg: 'rgba(22,163,74,0.2)', border: '#16A34A', text: '#ffffff', label: 'Approved' },
            accepted: { bg: 'rgba(22,163,74,0.2)', border: '#16A34A', text: '#ffffff', label: 'Approved' },
            rejected: { bg: 'rgba(126,26,28,0.2)', border: '#7E1A1C', text: '#ffffff', label: 'Rejected' },
          };
          return (
            <div className="flex flex-col gap-6">

              {/* ── Stats row ── */}
              <div className="grid grid-cols-3 gap-5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-5 flex flex-col gap-1 items-center justify-center"
                    style={{ border: `1px solid ${s.active ? '#16a34a' : '#9b9b9b'}` }}
                  >
                    <p
                      style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 36, fontWeight: 400, color: s.active ? '#16a34a' : '#9b9b9b', lineHeight: '120%' }}
                    >
                      {s.value}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: s.active ? '#16a34a' : '#9b9b9b', lineHeight: '120%' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── New Applications ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#ffffff', lineHeight: '120%', textTransform: 'capitalize', margin: 0 }}>
                    New Applications
                  </p>
                  <button
                    className="flex items-center gap-1.5"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => router.push(`/${role}/campaigns/new-applications?campaignId=${campaignId}`)}
                  >
                    View All
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {loadingApplications ? (
                    <div className="flex justify-center py-8">
                      <div className="w-7 h-7 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : pending.length > 0 ? pending.map((app) => (
                    <div key={app.id} className="h-[68px] flex items-center justify-between px-4 rounded-xl bg-[#262626]">
                      <div className="flex items-center gap-3">
                        <img src={app.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 16, fontWeight: 400, color: '#fff', lineHeight: '120%', margin: 0 }}>{app.name}</p>
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: '#9b9b9b', lineHeight: '120%', margin: 0 }}>
                            {app.niche?.join(', ') || app.bio || 'Influencer'}
                          </p>
                        </div>
                      </div>
                      <button
                        className="h-7 px-4 rounded-full text-white bg-[#16a34a] hover:opacity-90 transition-opacity flex-shrink-0 flex items-center gap-1.5"
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400 }}
                        onClick={() => router.push(`/${role}/influencers/${app.influencerId || app.id}`)}
                      >
                        <svg width="9" height="10" viewBox="0 0 9 10" fill="none" style={{ flexShrink: 0 }}>
                          <path fillRule="evenodd" clipRule="evenodd" d="M6.5 6C7.16304 6 7.79893 6.26339 8.26777 6.73223C8.73661 7.20107 9 7.83696 9 8.5V9.5C9 9.63261 8.94732 9.75979 8.85355 9.85355C8.75979 9.94732 8.63261 10 8.5 10C8.36739 10 8.24021 9.94732 8.14645 9.85355C8.05268 9.75979 8 9.63261 8 9.5V8.5C8 8.10218 7.84196 7.72064 7.56066 7.43934C7.27936 7.15804 6.89782 7 6.5 7H2.5C2.10218 7 1.72064 7.15804 1.43934 7.43934C1.15804 7.72064 1 8.10218 1 8.5V9.5C1 9.63261 0.947321 9.75979 0.853553 9.85355C0.759785 9.94732 0.632608 10 0.5 10C0.367392 10 0.240215 9.94732 0.146447 9.85355C0.0526784 9.75979 0 9.63261 0 9.5V8.5C0 7.83696 0.263392 7.20107 0.732233 6.73223C1.20107 6.26339 1.83696 6 2.5 6H6.5ZM4.5 0C5.16304 0 5.79893 0.263392 6.26777 0.732233C6.73661 1.20107 7 1.83696 7 2.5C7 3.16304 6.73661 3.79893 6.26777 4.26777C5.79893 4.73661 5.16304 5 4.5 5C3.83696 5 3.20107 4.73661 2.73223 4.26777C2.26339 3.79893 2 3.16304 2 2.5C2 1.83696 2.26339 1.20107 2.73223 0.732233C3.20107 0.263392 3.83696 0 4.5 0ZM4.5 1C4.30302 1 4.10796 1.0388 3.92597 1.11418C3.74399 1.18956 3.57863 1.30005 3.43934 1.43934C3.30005 1.57863 3.18956 1.74399 3.11418 1.92597C3.0388 2.10796 3 2.30302 3 2.5C3 2.69698 3.0388 2.89204 3.11418 3.07403C3.18956 3.25601 3.30005 3.42137 3.43934 3.56066C3.57863 3.69995 3.74399 3.81044 3.92597 3.88582C4.10796 3.9612 4.30302 4 4.5 4C4.89782 4 5.27936 3.84196 5.56066 3.56066C5.84196 3.27936 6 2.89782 6 2.5C6 2.10218 5.84196 1.72064 5.56066 1.43934C5.27936 1.15804 4.89782 1 4.5 1Z" fill="white"/>
                        </svg>
                        View profile
                      </button>
                    </div>
                  )) : (
                    <div className="h-[68px] flex items-center justify-center rounded-xl bg-[#262626]">
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, color: '#9b9b9b' }}>No new applications</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Influencers Status ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#ffffff', lineHeight: '120%', textTransform: 'capitalize', margin: 0 }}>
                    Influencers status
                  </p>
                  <button
                    className="flex items-center gap-1.5"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    View All
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {applications.length > 0 ? applications.map((app) => {
                    const s = statusStyle[app.status] || statusStyle.pending;
                    return (
                      <div key={app.id} className="h-[68px] flex items-center justify-between px-4 rounded-xl bg-[#262626]">
                        <div className="flex items-center gap-3">
                          <img src={app.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 16, fontWeight: 400, color: '#fff', lineHeight: '120%', margin: 0 }}>{app.name}</p>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: '#9b9b9b', lineHeight: '120%', margin: 0 }}>
                              {app.niche?.join(', ') || app.bio || 'Influencer'}
                            </p>
                          </div>
                        </div>
                        <span
                          className="h-7 px-4 rounded-full flex items-center flex-shrink-0"
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: '120%' }}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="h-[68px] flex items-center justify-center rounded-xl bg-[#262626]">
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, color: '#9b9b9b' }}>No influencers yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Find More Influencers banner ── */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-1 relative overflow-hidden hover:shadow-lg transition-shadow"
                style={{ background: 'linear-gradient(-44deg, rgba(22,163,74,1) 0%, rgba(7,54,24,1) 100%)', height: '244px', borderRadius: '24px' }}
              >
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: '#ffdbb4', lineHeight: '120%', textTransform: 'uppercase', letterSpacing: '1.33%', margin: 0, marginBottom: '8px' }}>
                  Find Influencers
                </p>
                <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#ffffff', lineHeight: '120%', margin: 0, marginBottom: '4px' }}>
                  Find More Influencers
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#e4e4e4', lineHeight: '160%', margin: 0, marginBottom: '16px', flex: 1 }}>
                  Discover creators that perfectly match your campaign criteria and target audience.
                </p>
                <button
                  className="self-start rounded-full hover:opacity-90 transition-opacity"
                  style={{ background: '#ffffff', color: '#16a34a', fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, border: 'none', cursor: 'pointer', padding: '12px 24px', height: 'auto' }}
                  onClick={() => router.push(`/${role}/influencers`)}
                >
                  Discover Influencers
                </button>
              </div>

            </div>
          );
        })()}

        {/* ══════════════ ANALYTICS ══════════════ */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-5">
            {/* Warning banner - center aligned */}
            <div
              className="rounded-xl flex items-center justify-center w-full"
              style={{ background: '#432004', border: '1px solid #733e0c', padding: '12px 20px', minHeight: '43px' }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: '#ffffff', lineHeight: '120%', textAlign: 'center', margin: 0 }}>
                Analytics <span style={{ textTransform: 'lowercase' }}>data will be available once the campaign goes live.</span>
              </p>
            </div>

            {/* Audience Engagement */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#ffffff', lineHeight: '120%', margin: 0 }}>
                  Audience Engagement
                </p>
                <button
                  className="h-8 px-4 rounded-full flex items-center gap-1"
                  style={{ background: '#16a34a', color: '#fdf9ef', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, border: 'none', cursor: 'pointer' }}
                >
                  likes ▾
                </button>
              </div>
              <div className="h-px bg-[#949494]" style={{ opacity: 0.3 }} />
              <LineChartGraph title="9.2K Likes" percentage="24%" strokeColor="#16A34A" fillColor="#0d2818" />
            </div>

            {/* Spending Budget */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#ffffff', lineHeight: '120%', margin: 0 }}>
                  Spending Budget
                </p>
                <button
                  className="h-8 px-4 rounded-full flex items-center gap-1"
                  style={{ background: '#16a34a', color: '#fdf9ef', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, border: 'none', cursor: 'pointer' }}
                >
                  months ▾
                </button>
              </div>
              <div className="h-px bg-[#949494]" style={{ opacity: 0.3 }} />
              <SpendingBudgetGraph title="₹1,24,657.80" percentage="24%" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
