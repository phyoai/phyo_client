'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { campaignApi } from '@/api/campaign-api';
import { useCampaigns } from '@/hooks/useCampaigns';
import api from '@/utils/api';

const STATS = ['+50% reach', '+10 influencers', '+65% ROI', '+50% reach', '+10 influencers', '+65% ROI'];

function fmtNow() {
  return new Date().toLocaleString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).replace(',', ' |');
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ─── plan card ─── */
function PlanCard({ plan, selected, onSelect, userCredits }) {
  const canAfford = userCredits == null || userCredits >= plan.creditsRequired;
  return (
    <div
      onClick={canAfford ? onSelect : undefined}
      className="flex items-start gap-3 p-4 rounded-2xl transition-all"
      style={{
        background: selected ? 'rgba(22,163,74,0.12)' : '#181818',
        border: selected ? '1px solid rgba(22,163,74,0.3)' : '1px solid transparent',
        cursor: canAfford ? 'pointer' : 'not-allowed',
        opacity: canAfford ? 1 : 0.5,
      }}
    >
      {/* radio */}
      <div
        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
        style={{ border: selected ? '2px solid #16A34A' : '2px solid rgba(148,148,148,0.4)' }}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />}
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[17px] font-semibold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
            {plan.label}
          </p>
          {plan.isRecommended && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#16A34A]/20 text-[#4ade80]">
              Recommended
            </span>
          )}
        </div>
        <p className="text-[13px] text-[#9A9A9A] mt-1 leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
          {plan.reason || plan.description}
        </p>
        {/* reach + lift row */}
        <div className="flex items-center gap-4 mt-2">
          {plan.estimatedReach && (
            <span className="text-[12px] text-[#16A34A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              ~{plan.estimatedReach >= 1000 ? `${Math.round(plan.estimatedReach / 1000)}K` : plan.estimatedReach} reach
            </span>
          )}
          {plan.estimatedLiftPercent && (
            <span className="text-[12px] text-[#16A34A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              +{plan.estimatedLiftPercent}% lift
            </span>
          )}
        </div>
        <p className="text-[18px] font-semibold text-white mt-2" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
          {plan.creditsRequired} {plan.creditsRequired === 1 ? 'Credit' : 'Credits'}
        </p>
      </div>
    </div>
  );
}

/* ─── summary row ─── */
function SummaryRow({ label, value, bold, last }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={!last ? { borderBottom: '1px solid rgba(148,148,148,0.12)' } : {}}
    >
      <span className="text-[15px] text-[#9A9A9A]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <span className={`text-[15px] ${bold ? 'font-semibold text-white' : 'text-white'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
        {value}
      </span>
    </div>
  );
}

export default function BoostCampaign() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const campaignId   = searchParams.get('campaignId');

  const { selectedCampaign, fetchCampaignById } = useCampaigns();

  const [plans, setPlans]             = useState([]);
  const [selectedId, setSelectedId]   = useState(null);
  const [activeBoost, setActiveBoost] = useState(null);
  const [userCredits, setUserCredits] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [paying, setPaying]           = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (!campaignId) return;
    fetchCampaignById(campaignId);

    Promise.all([
      campaignApi.getBoostRecommendations(campaignId),
      api.get('/users/profile').catch(() => null),
    ]).then(([boostData, profileRes]) => {
      // parse boost recommendations
      const raw = boostData?.data ?? boostData;
      const recs = Array.isArray(raw?.recommendations) ? raw.recommendations : [];
      const recommended = raw?.recommendedDuration;

      const mapped = recs.map((r) => ({
        id:                   r.duration,
        label:                r.duration.replace('days', ' days').replace('day', ' day'),
        creditsRequired:      r.creditsRequired ?? r.amount ?? 1,
        estimatedReach:       r.estimatedReach,
        estimatedLiftPercent: r.estimatedLiftPercent,
        isRecommended:        r.isRecommended ?? false,
        reason:               r.reason || '',
      }));

      setPlans(mapped);
      setSelectedId(recommended || mapped.find(p => p.isRecommended)?.id || mapped[0]?.id);

      if (raw?.activeBoost) setActiveBoost(raw.activeBoost);

      // creditsRemaining lives at data.creditsRemaining in the profile response
      const credits = profileRes?.data?.data?.creditsRemaining ?? profileRes?.data?.creditsRemaining ?? null;
      setUserCredits(credits);
    }).catch(() => {
      setError('Failed to load boost options.');
    }).finally(() => setLoading(false));
  }, [campaignId]);

  const plan    = plans.find(p => p.id === selectedId) || plans[0];
  const orderId = `#${String(Date.now()).slice(-4)}`;
  const creditsAfter = userCredits != null && plan ? userCredits - plan.creditsRequired : null;

  const handleBoost = async () => {
    if (!campaignId || !plan) return;
    setPaying(true);
    setError('');
    try {
      await campaignApi.boostCampaign(campaignId, plan.id, plan.creditsRequired);
      router.push(`/brand/campaigns/${campaignId}`);
    } catch (err) {
      setError(err?.message || 'Boost failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000201] px-6 py-6 flex flex-col gap-5">

      {/* ── HERO BANNER ── */}
      <div
        className="w-full rounded-3xl px-8 py-6 flex flex-col gap-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #16A34A 100%)', minHeight: 159 }}
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div>
            <h2 className="text-[24px] font-semibold text-white leading-tight" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
              Boost This Campaign
            </h2>
            <p className="text-[14px] mt-1" style={{ color: '#e4e4e4', fontFamily: 'Inter, sans-serif' }}>
              {selectedCampaign?.campaignName
                ? `Amplify "${selectedCampaign.campaignName}" reach & engagement.`
                : 'Amplify reach & engagement with advanced boost options.'}
            </p>
          </div>

          {/* credits badge */}
          {userCredits != null && (
            <div className="ml-auto flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none"/></svg>
              <span className="text-white text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {userCredits} Credits available
              </span>
            </div>
          )}
        </div>

        {/* stats ticker */}
        <div className="flex gap-8 overflow-hidden">
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2} opacity={0.8}>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span className="text-[14px] text-white font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* active boost notice */}
      {activeBoost && (
        <div className="w-full rounded-2xl px-5 py-4 flex items-center gap-3" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>
          <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse flex-shrink-0" />
          <p className="text-[14px] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-semibold text-[#4ade80]">Active boost running</span> — {activeBoost.duration?.replace('days', ' days')} plan · ~{activeBoost.estimatedReach?.toLocaleString()} reach · ends {fmtDate(activeBoost.endsAt)}
          </p>
        </div>
      )}

      {/* ── TWO-COLUMN BODY ── */}
      <div className="grid grid-cols-2 gap-5 items-start">

        {/* LEFT — Choose plan */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[24px] font-semibold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
            Choose a boost plan
          </h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map(i => <div key={i} className="h-[110px] rounded-2xl bg-[#181818] animate-pulse" />)}
            </div>
          ) : plans.length === 0 ? (
            <p className="text-[14px] text-[#9A9A9A]" style={{ fontFamily: 'Inter, sans-serif' }}>No plans available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {plans.map(p => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  selected={selectedId === p.id}
                  onSelect={() => setSelectedId(p.id)}
                  userCredits={userCredits}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Plan pricing */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[24px] font-semibold text-white" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
            Plan pricing
          </h3>
          <div className="bg-[#181818] rounded-2xl p-6 flex flex-col">
            <SummaryRow label="Order ID"         value={orderId} />
            <SummaryRow label="Date & Time"       value={fmtNow()} />
            <SummaryRow label="Package"           value={plan?.label || '—'} />
            <SummaryRow label="Credits Required"  value={plan ? `${plan.creditsRequired} Credits` : '—'} />
            {userCredits != null && (
              <SummaryRow label="Credits Available" value={`${userCredits} Credits`} />
            )}
            <div className="my-2 h-px" style={{ background: 'rgba(148,148,148,0.15)' }} />
            <SummaryRow
              label="Credits After Boost"
              value={creditsAfter != null ? `${creditsAfter} Credits` : '—'}
              bold
              last
            />

            {error && (
              <p className="mt-3 text-[13px] text-red-400 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                {error}
              </p>
            )}

            {userCredits != null && plan && userCredits < plan.creditsRequired && (
              <p className="mt-3 text-[13px] text-yellow-400 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                Insufficient credits. Please top up your account.
              </p>
            )}

            <button
              className="mt-6 w-full h-11 rounded-full text-white font-semibold text-[15px] bg-[#16A34A] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
              onClick={handleBoost}
              disabled={paying || loading || !plan || (userCredits != null && plan && userCredits < plan.creditsRequired)}
            >
              {paying ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
              ) : (
                `Use ${plan?.creditsRequired ?? '—'} Credits`
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
