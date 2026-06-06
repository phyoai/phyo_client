'use client'

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCampaigns } from '@/hooks/useCampaigns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/* ─── helpers ─── */
const normalizeList = (v) => (Array.isArray(v) ? v : []);

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
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function fmtDateShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function statusLabel(s) {
  const map = { PUBLISHED: 'Published', ACTIVE: 'Ongoing', DRAFT: 'Draft', COMPLETED: 'Completed' };
  return map[s] || (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Draft');
}

/* ─── ui atoms ─── */

/* outline pill — gray border, transparent bg, gray text */
function OutlinePill({ children }) {
  return (
    <span
      className="px-4 py-1.5 rounded-full text-[14px] text-[#9A9A9A]"
      style={{ border: '1px solid rgba(148,148,148,0.5)', background: 'transparent' }}
    >
      {children}
    </span>
  );
}

/* section card with large white Bricolage title + divider */
function SectionCard({ title, children }) {
  return (
    <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-5">
      <p
        className="text-[24px] font-semibold text-white"
        style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
      >
        {title}
      </p>
      <div className="h-px" style={{ background: 'rgba(148,148,148,0.25)' }} />
      {children}
    </div>
  );
}

/* each info block: large Bricolage label on top, gray value/children below */
function InfoBlock({ label, value, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-[20px] font-semibold text-white"
        style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
      >
        {label}
      </span>
      {children ?? (
        <span className="text-[16px] text-[#9A9A9A]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {value ?? '—'}
        </span>
      )}
    </div>
  );
}

/* ─── deliverable row icon (SVG outlines matching Figma) ─── */
function DeliverableIcon({ title }) {
  const key = (title || '').toLowerCase();
  const cls = 'w-5 h-5 text-white opacity-80';

  if (key.includes('reel') || key.includes('video')) {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="18" rx="3" />
        <circle cx="12" cy="12" r="3" />
        <line x1="2" y1="8" x2="22" y2="8" />
        <line x1="2" y1="16" x2="22" y2="16" />
      </svg>
    );
  }
  if (key.includes('story') || key.includes('photo') || key.includes('post')) {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }
  /* default */
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

/* ─── timeline ─── */
function TimelineSection({ startDate, endDate, appDeadline, createdAt }) {
  const now = Date.now();

  const milestones = [
    { label: 'Brief Created', date: createdAt },
    { label: 'Influencer Approval', date: appDeadline },
    { label: 'Campaign Live', date: startDate },
    { label: 'Campaign End', date: endDate },
  ];

  let currentIndex = 0;
  milestones.forEach((m, i) => {
    if (m.date && new Date(m.date).getTime() <= now) currentIndex = i;
  });

  return (
    <div className="bg-[#181818] rounded-3xl p-6 flex flex-col gap-6">
      <p className="text-[24px] font-semibold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
        Timeline
      </p>
      <div className="h-px" style={{ background: 'rgba(148,148,148,0.25)' }} />

      {/* track + dots */}
      <div className="relative mt-4">
        {/* background line — dot center to dot center (12.5% → 87.5%) */}
        <div
          className="absolute top-[8px] h-px"
          style={{ left: '12.5%', right: '12.5%', background: 'rgba(255,255,255,0.15)' }}
        />

        {/* progress line — grows from first dot toward currentIndex dot */}
        {currentIndex > 0 && (
          <div
            className="absolute top-[8px] h-px"
            style={{
              left: '12.5%',
              width: `calc(${(currentIndex / 3) * 75}%)`,
              background: currentIndex >= 2 ? '#16A34A' : '#ffffff',
            }}
          />
        )}

        <div className="grid grid-cols-4 relative z-10">
          {milestones.map((m, i) => {
            const isPast = i < currentIndex;
            const isCurrent = i === currentIndex;

            let dotBg = '#9A9A9A';
            if (isPast) dotBg = '#ffffff';
            if (isCurrent) dotBg = '#16A34A';

            return (
              <div key={i} className="flex flex-col items-center text-center relative z-10">
                <div
                  className="w-4 h-4 rounded-full mb-5"
                  style={{ background: dotBg }}
                />
                <span
                  className="text-[16px] font-semibold text-white"
                  style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
                >
                  {m.label}
                </span>
                <span className="mt-2 text-[13px] text-[#9A9A9A]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {fmtDateShort(m.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── main component ─── */
export default function PreviewCampaignPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId = searchParams.get('campaignId');

  const { selectedCampaign, loading, fetchCampaignById } = useCampaigns();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pdfRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#000201',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedCampaign?.campaignName || 'campaign'}.pdf`);
  };

  useEffect(() => {
    if (campaignId) fetchCampaignById(campaignId);
  }, [campaignId, fetchCampaignById]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  /* ── derived values ── */
  const brandName = campaign.brandId?.companyName || campaign.campaignName || 'Brand';
  const brandLogo = campaign.brandId?.logo || campaign.brandLogo || null;
  const brandInitial = brandName.charAt(0).toUpperCase();
  const description = campaign.description || campaign.campaignDescription || '';
  const status = campaign.status || 'DRAFT';

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

  const rawBudget = campaign.budget;
  const budget = rawBudget
    ? typeof rawBudget === 'object'
      ? `${rawBudget.currency || '$'}${Number(rawBudget.amount || 0).toLocaleString()}`
      : `$${Number(rawBudget).toLocaleString()}`
    : '—';

  const rawComp = campaign.compensation;
  const compensation = rawComp
    ? typeof rawComp === 'object'
      ? `${rawComp.currency || ''} ${Number(rawComp.amount || 0).toLocaleString()} · ${rawComp.type || ''}`.trim()
      : String(rawComp)
    : null;

  const deliverables = normalizeList(campaign.deliverables);
  const productImages = normalizeList(campaign.productImages);

  const periodStr = startDate && endDate
    ? `${fmtDate(startDate)} → ${fmtDate(endDate)}`
    : startDate ? `From ${fmtDate(startDate)}` : '—';

  const statsCards = [
    { label: 'Target Influencers', value: infCount ?? '—' },
    { label: 'Countries', value: countries.length > 0 ? countries.length : '—' },
    { label: 'Deliverables', value: deliverables.length > 0 ? deliverables.length : '—' },
    { label: 'Campaign Budget', value: budget },
  ];

  return (
    <div className="min-h-screen bg-[#000201] px-6 py-6">
      <div
        ref={pdfRef}
        className="w-full flex flex-col gap-5"
      >
        {/* back */}
        <button
          onClick={() => router.back()}
          className="self-start flex items-center gap-2 text-[#9A9A9A] hover:text-white transition-colors text-[14px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          ← Back
        </button>

        {/* ── HERO CARD ── */}
        <div className="w-full rounded-3xl flex items-center gap-5 p-5 relative" style={{ background: '#181818', minHeight: 160 }}>
          {/* 120×120 circular avatar */}
          <div
            className="w-[120px] h-[120px] rounded-full flex-shrink-0 flex items-center justify-center text-4xl font-bold text-white overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #16A34A, #0d5c2a)' }}
          >
            {brandLogo
              ? <img src={brandLogo} alt={brandName} className="w-full h-full object-cover" />
              : brandInitial}
          </div>

          {/* text */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                className="text-[32px] font-semibold text-white leading-tight"
                style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
              >
                {campaign.campaignName || brandName}
              </h1>
              <span className="px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: '#0a4720', color: '#4ade80' }}>
                {statusLabel(status)}
              </span>
            </div>
            {description && (
              <p className="text-[15px] text-[#9A9A9A] leading-relaxed line-clamp-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                {description}
              </p>
            )}
          </div>

          {/* 3-dot menu */}
          <div className="absolute top-4 right-5" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-[4px] hover:opacity-70 transition-opacity"
            >
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-[4px] h-[4px] rounded-full bg-white block" />
              ))}
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-10 rounded-xl overflow-hidden z-50 min-w-[140px]"
                style={{ background: '#2a2a2a', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
              >
                <button
                  className="w-full px-5 py-3 text-left text-[15px] text-white hover:bg-white/10 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  onClick={() => { navigator.share?.({ title: campaign.campaignName, url: window.location.href }); setMenuOpen(false); }}
                >
                  Share
                </button>
                <div className="h-px mx-3" style={{ background: 'rgba(148,148,148,0.2)' }} />
                <button
                  className="w-full px-5 py-3 text-left text-[15px] text-white hover:bg-white/10 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  onClick={() => {
                    handleDownloadPDF();
                    setMenuOpen(false);
                  }}
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-4 gap-3">
          {statsCards.map((s, i) => (
            <div key={i} className="bg-[#181818] rounded-2xl p-5 flex flex-col gap-2">
              <span className="text-[32px] font-semibold text-white leading-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
                {s.value}
              </span>
              <span className="text-[14px] text-[#9A9A9A]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── CAMPAIGN DETAILS + INFLUENCER TARGETING ── */}
        <div className="grid grid-cols-2 gap-5">

          <SectionCard title="Campaign Details">
            <div className="flex flex-col gap-5">
              {campaignTypes.length > 0 && (
                <InfoBlock label="Campaign Type">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignTypes.map((t, i) => <OutlinePill key={i}>{t}</OutlinePill>)}
                  </div>
                </InfoBlock>
              )}
              {countries.length > 0 && (
                <InfoBlock
                  label="Target Countries"
                  value={countries.join(', ')}
                />
              )}
              <InfoBlock label="Campaign Period" value={periodStr} />
              <InfoBlock label="Campaign Budget" value={budget} />
              {compensation && <InfoBlock label="Compensation" value={compensation} />}
            </div>
          </SectionCard>

          <SectionCard title="Influencer Targeting">
            <div className="flex flex-col gap-5">
              <InfoBlock label="Influencers" value={infCount ?? '—'} />
              <InfoBlock label="Follower Range" value={followerStr} />
              <InfoBlock label="Age Range" value={`${ageMin} – ${ageMax} Years`} />
              {genders.length > 0 && (
                <InfoBlock label="Gender" value={genders.join(', ')} />
              )}
              {interests.length > 0 && (
                <InfoBlock label="Interests">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {interests.map((n, i) => <OutlinePill key={i}>{n}</OutlinePill>)}
                  </div>
                </InfoBlock>
              )}
            </div>
          </SectionCard>

        </div>

        {/* ── DELIVERABLES ── */}
        {deliverables.length > 0 && (
          <SectionCard title="Deliverables">
            <div className="flex flex-col gap-3">
              {deliverables.map((d, i) => {
                const title = d?.title || d?.type || d?.name || `Deliverable ${i + 1}`;
                const platform = d?.platform || d?.timezone || '';
                const duration = d?.duration || d?.durationSecs || d?.durationSeconds || '';
                const subtitle = [platform, duration ? `Duration ${duration}` : ''].filter(Boolean).join(' • ') || d?.description || d?.details || '';
                const count = d?.count ?? d?.quantity ?? d?.numberOfPosts ?? null;

                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 rounded-2xl"
                    style={{ background: '#073D1B', height: 68 }}
                  >
                    {/* icon circle */}
                    <div
                      className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)' }}
                    >
                      <DeliverableIcon title={title} />
                    </div>

                    {/* text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-white leading-tight truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {title}
                      </p>
                      {subtitle && (
                        <p className="text-[13px] text-[#9A9A9A] truncate mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {subtitle}
                        </p>
                      )}
                    </div>

                    {/* count badge */}
                    {count != null && (
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center text-[15px] font-semibold text-white"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* ── TIMELINE ── */}
        <TimelineSection
          startDate={startDate}
          endDate={endDate}
          appDeadline={appDeadline}
          createdAt={createdAt}
        />

        {/* ── PRODUCT MEDIA ── */}
        {productImages.length > 0 && (
          <SectionCard title="Product Media">
            <div className="columns-3 gap-3 space-y-3">
              {productImages.map((url, i) => (
                <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden">
                  <img src={url} alt="" className="w-full object-cover" />
                </div>
              ))}
            </div>
          </SectionCard>
        )}

      </div>
    </div>
  );
}
