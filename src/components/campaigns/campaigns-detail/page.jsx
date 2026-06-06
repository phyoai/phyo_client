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
        <p className="text-[22px] font-semibold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
          {title}
        </p>
        {action}
      </div>
      <div className="h-px bg-[#262525]" />
      {children}
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-white">{label}</span>
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
  const brandName     = campaign.brandId?.companyName || campaign.campaignName || 'Brand';
  const brandInitial  = brandName.charAt(0).toUpperCase();
  const productImages = normalizeList(campaign.productImages);

  const campaignTypes  = parseCampaignTypes(campaign.campaignType || campaign.types);
  const interests      = normalizeList(campaign.targetInfluencer?.targetNiche || campaign.targetInfluencer?.interests);
  const countries      = normalizeList(campaign.targetInfluencer?.countries);
  const genders        = normalizeList(campaign.targetInfluencer?.gender);
  const infCount       = campaign.targetInfluencer?.numberOfInfluencers;
  const ageMin         = campaign.targetInfluencer?.ageRange?.min ?? 18;
  const ageMax         = campaign.targetInfluencer?.ageRange?.max ?? 35;
  const followerMin    = campaign.targetInfluencer?.followerCount?.min;
  const followerMax    = campaign.targetInfluencer?.followerCount?.max;
  const followerStr    = followerMin != null && followerMax != null
    ? `${fmtFollower(followerMin)} – ${fmtFollower(followerMax)}`
    : '—';

  const startDate   = campaign.timelines?.campaignStartDate || campaign.timelines?.startDate;
  const endDate     = campaign.timelines?.campaignEndDate   || campaign.timelines?.endDate;
  const appDeadline = campaign.timelines?.applicationDeadline;
  const createdAt   = campaign.createdAt;

  const budget       = campaign.budget;
  const compensation = campaign.compensation;

  const deliverables = normalizeList(campaign.deliverables);
  const status       = campaign.status;
  const isActive     = status === 'ACTIVE' || status === 'PUBLISHED';

  const TABS = ['overview', 'influencers', 'analytics'];

  return (
    <div className="min-h-screen bg-[#000201] px-6 py-6">
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
            <h1 className="text-[32px] font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
              {campaign.campaignName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#0a4620] text-[#16A34A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block" />
              {statusLabel(status)}
            </span>
          </div>

          {campaign.campaignBrief && (
            <p className="text-[15px] leading-relaxed text-[#9A9A9A]" style={{ fontFamily: 'Inter, sans-serif' }}>
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

                {/* Campaign Details */}
                <SectionCard title="Campaign Details">
                  <InfoRow label="Campaign Type">
                    <div className="flex flex-wrap gap-2">
                      {campaignTypes.length > 0
                        ? campaignTypes.map((t) => <TagPill key={t}>{t}</TagPill>)
                        : <GrayPill>General</GrayPill>}
                    </div>
                  </InfoRow>

                  <InfoRow label="Target Countries">
                    <div className="flex flex-wrap gap-2">
                      {countries.length > 0
                        ? countries.map((c) => <GrayPill key={c}>{c}</GrayPill>)
                        : <span className="text-[14px] text-[#9A9A9A]">—</span>}
                    </div>
                  </InfoRow>

                  <InfoRow label="Campaign Period">
                    <span className="text-[14px] text-[#9A9A9A]">
                      {startDate && endDate
                        ? `${fmtDate(startDate)} → ${fmtDate(endDate)}`
                        : '—'}
                    </span>
                  </InfoRow>

                  <InfoRow label="Application Deadline">
                    <span className="text-[14px] text-[#9A9A9A]">
                      {appDeadline ? fmtDate(appDeadline) : '—'}
                    </span>
                  </InfoRow>

                  <InfoRow label="Campaign Budget">
                    <span className="text-[18px] font-bold text-white">
                      {budget ? `₹${Number(budget).toLocaleString('en-IN')}` : '—'}
                    </span>
                  </InfoRow>

                  {compensation && (
                    <InfoRow label="Compensation">
                      <span className="text-[14px] text-[#9A9A9A]">
                        {compensation.currency} {Number(compensation.amount).toLocaleString('en-IN')} · {compensation.type}
                      </span>
                    </InfoRow>
                  )}

                  <InfoRow label="Live Posts Required">
                    <span className="text-[14px] text-[#9A9A9A]">{campaign.numberOfLivePosts ?? '—'}</span>
                  </InfoRow>
                </SectionCard>

                {/* Influencer Targeting */}
                <SectionCard title="Influencer Targeting">
                  <InfoRow label="Influencers">
                    <span className="text-[22px] font-bold text-white">{infCount ?? '—'}</span>
                  </InfoRow>

                  <InfoRow label="Follower Range">
                    <span className="text-[14px] text-[#9A9A9A]">{followerStr}</span>
                  </InfoRow>

                  <InfoRow label="Age Range">
                    <span className="text-[14px] text-[#9A9A9A]">{ageMin} – {ageMax} Years</span>
                  </InfoRow>

                  {genders.length > 0 && (
                    <InfoRow label="Gender">
                      <div className="flex flex-wrap gap-2">
                        {genders.map((g) => <GrayPill key={g}>{g}</GrayPill>)}
                      </div>
                    </InfoRow>
                  )}

                  <InfoRow label="Interests">
                    <div className="flex flex-wrap gap-2">
                      {interests.length > 0
                        ? interests.map((i) => <TagPill key={i}>{i}</TagPill>)
                        : <span className="text-[13px] text-[#9A9A9A]">—</span>}
                    </div>
                  </InfoRow>
                </SectionCard>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-5">

                {/* Action Required */}
                <SectionCard title="Action Required">
                  {applications.length > 0 ? (
                    <div className="rounded-2xl p-4 flex flex-col gap-4" style={{ background: '#432004' }}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-white">Pending Review</span>
                        <span className="text-[12px] text-[#c9a07a]">• just now</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#763d06] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                          {applications[0]?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold text-white">
                            {applications[0].name} submitted deliverables
                          </p>
                          <p className="text-[12px] mt-1 text-[#c9a07a]">Ready for review</p>
                        </div>
                      </div>
                      <button
                        className="self-start h-8 px-5 rounded-full text-[13px] font-semibold text-white bg-[#763d06] hover:opacity-90 transition-opacity"
                        onClick={() => router.push(`/${role}/campaigns/influencer-detail-deliverables?campaignId=${campaignId}`)}
                      >
                        Review now
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl p-5 flex flex-col items-center gap-2 bg-[#262525]">
                      <p className="text-[13px] text-[#9A9A9A] text-center">No pending actions</p>
                      <p className="text-[12px] text-[#9A9A9A] text-center">
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
                          {/* icon */}
                          <div className="w-8 h-8 rounded-full bg-[#0d4f24] flex-shrink-0 flex items-center justify-center">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17l-5-5" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {/* text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">{item.title}</p>
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
                    <p className="text-[13px] text-[#9A9A9A] text-center py-2">No deliverables defined</p>
                  )}
                </SectionCard>

                {/* Boost Campaign — green gradient card */}
                <div
                  className="rounded-3xl p-6 flex flex-col gap-3 cursor-pointer relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #16A34A 100%)' }}
                  onClick={() => router.push(`/${role}/campaigns/boost-campaign?campaignId=${campaignId}`)}
                >
                  {/* background decorative chart icon */}
                  <div className="absolute right-4 top-4 opacity-10">
                    <BarChartLine className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-[20px] font-bold text-white relative z-10" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
                    Boost This Campaign
                  </p>
                  <p className="text-[13px] text-white/70 relative z-10">
                    Amplify reach &amp; engagement with advanced boost options.
                  </p>
                  <div className="grid grid-cols-3 gap-2 relative z-10 mt-1">
                    {[
                      { icon: LineChartLine, label: '+50% reach' },
                      { icon: UserLine,      label: '+10 influencers' },
                      { icon: BarChartLine,  label: '+65% ROI' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
                        <span className="text-[11px] font-semibold text-white/90">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Media — full width */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="text-[22px] font-semibold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
                  Product Media
                </p>
                {productImages.length > 0 && (
                  <span className="w-7 h-7 rounded-full bg-[#262525] flex items-center justify-center text-[12px] text-white font-semibold">
                    {productImages.length}
                  </span>
                )}
              </div>
              <div className="h-px bg-[#262525]" />
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
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#9A9A9A" strokeWidth="1.5"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#9A9A9A"/>
                    <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-[13px] text-[#9A9A9A]">No product images uploaded</p>
                </div>
              )}
            </div>

            {/* Timeline — full width */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
              <p className="text-[22px] font-semibold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
                Timeline
              </p>
              <div className="h-px bg-[#262525]" />
              <div className="relative flex justify-between px-2">
                {/* horizontal connector */}
                <div className="absolute top-[7px] left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-px bg-[#262525]" />
                {[
                  { label: 'Brief Created',        date: createdAt,   color: '#fff',     done: true },
                  { label: 'Application Deadline', date: appDeadline, color: '#fff',     done: !!appDeadline },
                  { label: 'Campaign Live',         date: startDate,   color: '#16A34A',  done: isActive },
                  { label: 'Campaign End',          date: endDate,     color: '#4B5563',  done: false },
                ].map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 z-10">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        background: m.done ? m.color : '#000201',
                        borderColor: m.color,
                      }}
                    />
                    <p className="text-[12px] font-medium text-white text-center leading-tight px-1">{m.label}</p>
                    {m.date && (
                      <p className="text-[11px] text-[#9A9A9A] text-center">{fmtDate(m.date)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════════ INFLUENCERS ══════════════ */}
        {activeTab === 'influencers' && (() => {
          const pending  = applications.filter(a => a.status === 'pending');
          const approved = applications.filter(a => a.status === 'approved' || a.status === 'accepted');
          const selected = normalizeList(campaign.selectedInfluencers);
          const stats = [
            { value: applications.length,       label: 'Total Influencers',  active: true  },
            { value: pending.length,             label: 'New Applications',   active: false },
            { value: selected.length || approved.length, label: 'Working On',active: false },
          ];
          const statusStyle = {
            pending:  { bg: 'rgba(11,79,217,0.15)', border: '#0b4fd9', text: '#7aa3f5', label: 'Pending Review' },
            approved: { bg: 'rgba(22,163,74,0.15)',  border: '#16a34a', text: '#16a34a', label: 'Approved' },
            accepted: { bg: 'rgba(22,163,74,0.15)',  border: '#16a34a', text: '#16a34a', label: 'Approved' },
            rejected: { bg: 'rgba(126,26,28,0.15)', border: '#7e1a1c', text: '#f87171', label: 'Rejected' },
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
                      style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 36, fontWeight: 400, color: s.active ? '#16a34a' : '#9b9b9b' }}
                    >
                      {s.value}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: s.active ? '#16a34a' : '#9b9b9b' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── New Applications ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#fff' }}>
                    New Applications
                  </p>
                  <button
                    className="flex items-center gap-1 text-[#16a34a]"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 16 }}
                    onClick={() => router.push(`/${role}/campaigns/new-applications?campaignId=${campaignId}`)}
                  >
                    View All <span>→</span>
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
                        <div>
                          <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 16, color: '#fff' }}>{app.name}</p>
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9b9b9b' }}>
                            {app.niche?.join(', ') || app.bio || 'Influencer'}
                          </p>
                        </div>
                      </div>
                      <button
                        className="h-7 px-4 rounded-full text-white bg-[#16a34a] hover:opacity-90 transition-opacity flex-shrink-0"
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
                        onClick={() => router.push(`/${role}/influencers/${app.influencerId || app.id}`)}
                      >
                        View profile
                      </button>
                    </div>
                  )) : (
                    <div className="h-[68px] flex items-center justify-center rounded-xl bg-[#262626]">
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9b9b9b' }}>No new applications</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Influencers Status ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#fff' }}>
                    Influencers status
                  </p>
                  <button
                    className="flex items-center gap-1 text-[#16a34a]"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 16 }}
                  >
                    View All <span>→</span>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {applications.length > 0 ? applications.map((app) => {
                    const s = statusStyle[app.status] || statusStyle.pending;
                    return (
                      <div key={app.id} className="h-[68px] flex items-center justify-between px-4 rounded-xl bg-[#262626]">
                        <div className="flex items-center gap-3">
                          <img src={app.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                          <div>
                            <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 16, color: '#fff' }}>{app.name}</p>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9b9b9b' }}>
                              {app.niche?.join(', ') || app.bio || 'Influencer'}
                            </p>
                          </div>
                        </div>
                        <span
                          className="h-7 px-4 rounded-full flex items-center flex-shrink-0"
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text, fontFamily: 'Inter, sans-serif', fontSize: 12 }}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="h-[68px] flex items-center justify-center rounded-xl bg-[#262626]">
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9b9b9b' }}>No influencers yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Find More Influencers banner ── */}
              <div
                className="rounded-3xl p-7 flex flex-col gap-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0a3d1a 0%, #0d4f22 60%, #16a34a 100%)' }}
              >
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#ffdbb4', fontWeight: 400 }}>
                  Find Influencers
                </p>
                <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#fff' }}>
                  Find More Influencers
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#e4e4e4', lineHeight: 1.6 }}>
                  Discover creators that perfectly match your campaign criteria and target audience.
                </p>
                <button
                  className="self-start h-11 px-6 rounded-full hover:opacity-90 transition-opacity"
                  style={{ background: '#fff', color: '#16a34a', fontFamily: 'Inter, sans-serif', fontSize: 16 }}
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
            {/* Warning banner */}
            <div
              className="px-5 py-3 rounded-xl flex items-center self-start"
              style={{ background: '#432004', border: '1px solid #733e0c' }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#fff' }}>
                Analytics data will be available once the campaign goes live.
              </p>
            </div>

            {/* Audience Engagement */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#fff' }}>
                  Audience Engagement
                </p>
                <button
                  className="h-8 px-4 rounded-full flex items-center gap-1"
                  style={{ background: '#16a34a', color: '#fdf9ef', fontFamily: 'Inter, sans-serif', fontSize: 14 }}
                >
                  likes ▾
                </button>
              </div>
              <div className="h-px bg-[#949494]/30" />
              <LineChartGraph title="9.2K Likes" percentage="24%" strokeColor="#16A34A" fillColor="#0d2818" />
            </div>

            {/* Spending Budget */}
            <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontSize: 24, fontWeight: 400, color: '#fff' }}>
                  Spending Budget
                </p>
                <button
                  className="h-8 px-4 rounded-full flex items-center gap-1"
                  style={{ background: '#16a34a', color: '#fdf9ef', fontFamily: 'Inter, sans-serif', fontSize: 14 }}
                >
                  months ▾
                </button>
              </div>
              <div className="h-px bg-[#949494]/30" />
              <SpendingBudgetGraph title="₹1,24,657.80" percentage="24%" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
