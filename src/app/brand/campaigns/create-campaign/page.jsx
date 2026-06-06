'use client'
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus } from 'lucide-react';
import { campaignApi } from '@/api/campaign-api';

const CAMPAIGN_TYPES = [
  'Brand Awareness', 'Product Launch', 'Content Creation',
  'Sales & Promotion', 'Event Coverage', 'UGC Generation', 'App Install', 'Other',
];
const NICHES = [
  'Fashion', 'Beauty', 'Lifestyle', 'Fitness', 'Food', 'Travel',
  'Tech', 'Gaming', 'Education', 'Business', 'Entertainment', 'Health', 'Parenting', 'Pets',
];
const COMPENSATION_TYPES = ['Monetary', 'Barter', 'Gifting', 'Affiliate', 'Commission'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const GENDERS = ['Male', 'Female', 'Other', 'Not Specified'];

/* ─── Shared primitives ─────────────────────────────────────────── */

const INPUT_CLS =
  'w-full h-10 px-4 bg-[#262525] rounded-lg text-[14px] text-[#9A9A9A] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#16A34A] transition-colors';

const LABEL_CLS =
  'block text-[14px] text-white mb-2';

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className={LABEL_CLS}
        style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-[#181818] rounded-3xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h2
          className="text-[24px] font-normal text-white leading-[1.2]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          {title}
        </h2>
      </div>
      <hr className="border-t border-[#252525] mx-5" />
      <div className="px-5 py-5 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

function Pills({ options, selected, onToggle, single = false }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map(opt => {
        const active = single ? selected === opt : selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`flex items-center gap-2 rounded-full text-[14px] transition-colors border ${
              active
                ? 'bg-[#16A34A] border-[#16A34A] text-white'
                : 'bg-transparent border-[#333] text-[#9A9A9A] hover:border-[#555]'
            }`}
            style={{ padding: '4px 24px' }}
          >
            {opt}
            {active && !single && <X className="w-3 h-3" />}
          </button>
        );
      })}
    </div>
  );
}

function StepperRow({ label, value, onDec, onInc }) {
  return (
    <div className="flex items-center justify-between bg-[#272626] rounded-lg px-4 h-[60px]">
      <span
        className="text-[14px] text-[#9A9A9A]"
        style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)', letterSpacing: '0.24px' }}
      >
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          className="w-9 h-9 rounded-full border border-[#444] flex items-center justify-center text-white hover:border-[#16A34A] transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span
          className="text-[20px] font-semibold text-[#9A9A9A] w-6 text-center"
          style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.14px' }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onInc}
          className="w-9 h-9 rounded-full border border-[#444] flex items-center justify-center text-white hover:border-[#16A34A] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function CreateCampaignPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    campaignName: '',
    campaignGoal: '',
    campaignBrief: '',
    productImages: [],
    budget: '',
    currency: 'INR',
    compensationType: 'Monetary',
    compensationAmount: '',
    campaignStartDate: '',
    campaignEndDate: '',
    applicationDeadline: '',
    influencerCount: '',
    followerCountMin: '',
    followerCountMax: '',
    countries: '',
    ageRangeMin: '',
    ageRangeMax: '',
    numberOfLivePosts: '',
    instagramReels: 0,
    instagramStories: 0,
    instagramPosts: 0,
  });

  const [campaignTypes, setCampaignTypes] = useState([]);
  const [niches, setNiches] = useState([]);
  const [genders, setGenders] = useState([]);

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const toggleMulti = (_list, setList, v) =>
    setList(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const step = (f, d) => set(f, Math.max(0, (form[f] || 0) + d));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    set('productImages', files.map(f => ({ file: f, url: URL.createObjectURL(f) })));
  };

  const handleSubmit = async () => {
    if (!form.campaignName.trim()) { alert('Campaign Name is required'); return; }
    if (!form.campaignBrief.trim()) { alert('Campaign Brief is required'); return; }
    if (!campaignTypes.length) { alert('Select at least one Campaign Type'); return; }

    setIsSubmitting(true);
    try {
      const deliverables = [
        form.instagramReels > 0 && `${form.instagramReels} Instagram Reels`,
        form.instagramStories > 0 && `${form.instagramStories} Instagram Stories`,
        form.instagramPosts > 0 && `${form.instagramPosts} Instagram Posts`,
      ].filter(Boolean);

      await campaignApi.createCampaign({
        campaignName: form.campaignName.trim(),
        campaignType: campaignTypes.join(', '),
        campaignBrief: form.campaignBrief.trim(),
        campaignGoal: form.campaignGoal.trim() || undefined,
        productImages: form.productImages.map(i => i.file).filter(Boolean),
        budget: parseFloat(form.budget) || 0,
        numberOfLivePosts: parseInt(form.numberOfLivePosts) || 0,
        status: 'PUBLISHED',
        deliverables: deliverables.length ? deliverables : ['No deliverables specified'],
        compensation: {
          type: form.compensationType,
          amount: parseFloat(form.compensationAmount) || 0,
          currency: form.currency,
          description: '',
        },
        timelines: {
          applicationDeadline: form.applicationDeadline
            ? new Date(form.applicationDeadline).toISOString()
            : new Date().toISOString(),
          campaignStartDate: form.campaignStartDate
            ? new Date(form.campaignStartDate).toISOString()
            : new Date().toISOString(),
          campaignEndDate: form.campaignEndDate
            ? new Date(form.campaignEndDate).toISOString()
            : new Date().toISOString(),
        },
        targetInfluencer: {
          numberOfInfluencers: parseInt(form.influencerCount) || 1,
          targetNiche: niches,
          followerCount: {
            min: parseInt(form.followerCountMin) || 0,
            max: parseInt(form.followerCountMax) || 1000000,
          },
          countries: form.countries
            ? form.countries.split(',').map(s => s.trim()).filter(Boolean)
            : [],
          gender: genders,
          ageRange: {
            min: Math.max(13, parseInt(form.ageRangeMin) || 18),
            max: Math.max(13, parseInt(form.ageRangeMax) || 65),
          },
        },
        reels: [],
      });
      router.push('/brand/campaigns');
    } catch (err) {
      alert(`Failed to create campaign: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#000201] px-6 pt-5 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <h1
          className="text-[24px] font-normal text-white leading-[1.2]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          New Campaign
        </h1>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => router.push('/brand/campaigns')}
            className="h-10 px-8 rounded-full bg-[#16A34A] text-white text-[16px] hover:bg-green-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-10 px-8 rounded-full bg-[#16A34A] text-white text-[16px] hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {/* ── 2-column grid ── */}
      <div className="grid grid-cols-2 gap-5 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-5">

          {/* Campaign Details */}
          <Card title="Campaign details">
            <Field label="Campaign Name">
              <input
                type="text"
                value={form.campaignName}
                onChange={e => set('campaignName', e.target.value)}
                className={INPUT_CLS}
                placeholder="Campaign Name"
              />
            </Field>

            <Field label="Campaign Banner">
              <input type="file" accept="image/*" multiple ref={fileInputRef} className="hidden" onChange={handleImages} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#262525] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#2e2e2e] transition-colors"
                style={{ height: 140 }}
              >
                {form.productImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center p-3">
                    {form.productImages.map((img, i) => (
                      <img key={i} src={img.url} alt="" className="h-16 w-16 object-cover rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[14px] text-[#9A9A9A]">Drag files here to upload..</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="h-8 px-8 rounded-full bg-[#16A34A] text-white text-[14px] hover:bg-green-700 transition-colors"
                    >
                      Brows Files
                    </button>
                  </div>
                )}
              </div>
            </Field>

            <Field label="Campaign Name">
              <Pills
                options={CAMPAIGN_TYPES}
                selected={campaignTypes}
                onToggle={v => toggleMulti(campaignTypes, setCampaignTypes, v)}
              />
            </Field>

            <Field label="Campaign Goal">
              <input
                type="text"
                value={form.campaignGoal}
                onChange={e => set('campaignGoal', e.target.value)}
                className={INPUT_CLS}
                placeholder="Campaign Goal"
              />
            </Field>

            <Field label="Campaign Brief">
              <textarea
                value={form.campaignBrief}
                onChange={e => set('campaignBrief', e.target.value)}
                rows={5}
                className={INPUT_CLS + ' h-auto resize-none py-3'}
                placeholder="Campaign Brief"
              />
            </Field>
          </Card>

          {/* Deliverables */}
          <Card title="Deliverables">
            <StepperRow
              label="Instagram Reels"
              value={form.instagramReels}
              onDec={() => step('instagramReels', -1)}
              onInc={() => step('instagramReels', 1)}
            />
            <StepperRow
              label="Instagram Stories"
              value={form.instagramStories}
              onDec={() => step('instagramStories', -1)}
              onInc={() => step('instagramStories', 1)}
            />
            <StepperRow
              label="Instagram Post"
              value={form.instagramPosts}
              onDec={() => step('instagramPosts', -1)}
              onInc={() => step('instagramPosts', 1)}
            />
            <p className="text-[14px] text-[#9A9A9A]" style={{ letterSpacing: '0.24px' }}>
              Total: {form.instagramPosts} Post, {form.instagramStories} Stories, {form.instagramReels} Reels
            </p>
          </Card>

          {/* Budget */}
          <Card title="Budget">
            <Field label="Compensation Type">
              <Pills
                options={COMPENSATION_TYPES}
                selected={form.compensationType}
                onToggle={v => set('compensationType', v)}
                single
              />
            </Field>
            <div className="flex gap-3">
              <select
                value={form.currency}
                onChange={e => set('currency', e.target.value)}
                className="h-10 px-3 bg-white rounded-lg text-[14px] text-[#242527] focus:outline-none focus:ring-1 focus:ring-[#16A34A] cursor-pointer shrink-0"
                style={{ minWidth: 76 }}
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number"
                value={form.budget}
                onChange={e => set('budget', e.target.value)}
                className={INPUT_CLS}
                placeholder="₹10000"
                min="0"
              />
            </div>
            <Field label="Per Influencer Amount">
              <input
                type="number"
                value={form.compensationAmount}
                onChange={e => set('compensationAmount', e.target.value)}
                className={INPUT_CLS}
                placeholder="₹2000"
                min="0"
              />
            </Field>
          </Card>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-5">

          {/* Influencer Target */}
          <Card title="Influencer Target">
            <Field label="No. of Influencers">
              <input type="number" value={form.influencerCount} onChange={e => set('influencerCount', e.target.value)}
                className={INPUT_CLS} placeholder="1,5,10" min="1" />
            </Field>

            <Field label="Follower Count (min)">
              <input type="number" value={form.followerCountMin} onChange={e => set('followerCountMin', e.target.value)}
                className={INPUT_CLS} placeholder="eg:- 2k" min="0" />
            </Field>

            <Field label="Follower Count (max)">
              <input type="number" value={form.followerCountMax} onChange={e => set('followerCountMax', e.target.value)}
                className={INPUT_CLS} placeholder="eg:- 100k" min="0" />
            </Field>

            <Field label="Countries">
              <input type="text" value={form.countries} onChange={e => set('countries', e.target.value)}
                className={INPUT_CLS} placeholder="India, USA" />
            </Field>

            <Field label="Interest/Niche">
              <Pills
                options={NICHES}
                selected={niches}
                onToggle={v => toggleMulti(niches, setNiches, v)}
              />
            </Field>

            <Field label="Gender">
              <Pills
                options={GENDERS}
                selected={genders}
                onToggle={v => toggleMulti(genders, setGenders, v)}
              />
            </Field>

            <Field label="Minimum Age">
              <input type="number" value={form.ageRangeMin} onChange={e => set('ageRangeMin', e.target.value)}
                className={INPUT_CLS} placeholder="3-5" min="13" max="100" />
            </Field>

            <Field label="Maximum Age">
              <input type="number" value={form.ageRangeMax} onChange={e => set('ageRangeMax', e.target.value)}
                className={INPUT_CLS} placeholder="3-5" min="13" max="100" />
            </Field>

            <Field label="No. of live posts">
              <input type="number" value={form.numberOfLivePosts} onChange={e => set('numberOfLivePosts', e.target.value)}
                className={INPUT_CLS} placeholder="3-5" min="0" />
            </Field>
          </Card>

          {/* Timeline */}
          <Card title="Timeline">
            <Field label="Start date">
              <input type="date" value={form.campaignStartDate} onChange={e => set('campaignStartDate', e.target.value)}
                className={INPUT_CLS} style={{ colorScheme: 'dark' }} />
            </Field>

            <Field label="End date">
              <input type="date" value={form.campaignEndDate} onChange={e => set('campaignEndDate', e.target.value)}
                className={INPUT_CLS} style={{ colorScheme: 'dark' }} />
            </Field>

            <Field label="Application Deadline">
              <input type="date" value={form.applicationDeadline} onChange={e => set('applicationDeadline', e.target.value)}
                className={INPUT_CLS} style={{ colorScheme: 'dark' }} />
            </Field>
          </Card>

        </div>
      </div>
    </div>
  );
}
