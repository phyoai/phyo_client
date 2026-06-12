'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleContext } from '@/app/context/RoleContext';
import api from '@/utils/api';
import { userAPI } from '@/utils/api';

function CheckIcon({ color = '#9b9b9b' }) {
  return (
    <svg width="21" height="12" viewBox="0 0 21 12" fill="none" className="flex-shrink-0">
      <path d="M1.5 6L7.5 11L19.5 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PLANS = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: '$0',
    priceSub: 'free forever',
    desc: 'Perfect for early-stage creators, startups, and curious users.',
    cta: 'Start Free',
    ctaNote: 'Free forever, no credit card required.',
    highlight: false,
    popular: false,
    includes: 'Free plan includes',
    benefits: [
      '10 Credits/month',
      '5 Influencer Searches',
      'Creator Insights (Basic)',
      'Access to All Supported Platforms',
      'Limited AI Report Access (Preview mode)',
      'Credit Validity: 45 Days',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '$194',
    priceSub: '/Month',
    desc: 'Best for freelancers, boutique agencies, or small teams.',
    cta: 'Upgrade Now',
    ctaNote: 'Billed annually.',
    highlight: true,
    popular: true,
    includes: 'Silver Plan includes',
    benefits: [
      '50 Credits/month',
      '10 Advanced Searches',
      '4 Campaign Reports',
      'Creator Insights (Advanced)',
      'AI-Powered Report Analyzer',
      'Add Up to 2 Team Members',
      'Historical Data Access (Up to 3 months)',
      'Access to All Platforms',
      'Email Support',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '$806',
    priceSub: '/Month',
    desc: 'Perfect for growing brands and mid-size teams.',
    cta: 'Upgrade Now',
    ctaNote: 'Billed annually.',
    highlight: false,
    popular: false,
    includes: 'Gold Plan includes',
    benefits: [
      '250 Credits/month',
      '20 Deep Searches',
      '10 AI-Powered Campaign Reports',
      'Dedicated Chat Support',
      'AI optimizes campaigns',
      'Unlimited Users',
      'Historical Data (Up to 6 months)',
      'Exportable Analytics (CSV/PDF)',
      'AI Smart Creators, Niche, Region, Top',
      'Multi-Platform Aggregated Creator Profiles',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$2030',
    priceSub: '/Month',
    desc: 'Perfect for global agencies managing multiple campaigns.',
    cta: 'Upgrade Now',
    ctaNote: 'Billed annually.',
    highlight: false,
    popular: false,
    includes: 'Premium Plan includes',
    benefits: [
      'Unlimited Credits/month',
      '100 Smart Searches',
      'AI Competitor Analysis (Track 5 competitors)',
      'Trend Analyzer (5 trends/month)',
      'Campaign Auto-Optimization Insights',
      'Reusable Campaign Templates',
      'Dedicated Account Workspace',
      'Priority Access to New Features',
      'Team Analytics Dashboard',
      'Global Creator Index Access',
      '24/7 Priority Support',
    ],
  },
];

export default function UpgradePlan() {
  const router = useRouter();
  const { role } = useRoleContext();
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState('silver');
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [plansLoading, setPlansLoading] = useState(true);
  const [displayPlans, setDisplayPlans] = useState(PLANS);

  useEffect(() => {
    const pendingSubscriptionId = sessionStorage.getItem('subscription_id');
    if (pendingSubscriptionId) {
      router.replace(`/${role}/account/payment-success?subscription_id=${pendingSubscriptionId}`);
      return;
    }

    const fetchUserAndPlans = async () => {
      try {
        setPlansLoading(true);
        const userResponse = await userAPI.getUserProfile();
        const userData = userResponse.data || userResponse.user || userResponse;
        setUser(userData);

        const res = await api.get('/payment/razorpay/plans', { params: { count: 20, skip: 0 } });
        const items = res.data?.data?.items || res.data?.items || [];

        if (items.length > 0) {
          const updatedPlans = PLANS.map(plan => {
            const apiPlan = items.find(p => {
              const itemName = (p.item?.name || p.name || '').toLowerCase();
              return itemName.includes(plan.name.toLowerCase());
            });
            if (apiPlan && plan.id !== 'bronze') {
              const priceInRupees = (apiPlan.item?.amount || apiPlan.amount || 0) / 100;
              return { ...plan, price: `₹${priceInRupees}`, priceSub: '/Month', apiPlanId: apiPlan.id };
            }
            return plan;
          });
          setDisplayPlans(updatedPlans);
        }
      } catch (err) {
        console.error('Error fetching user or plans:', err);
        setPaymentError('Failed to load plans. Please try again.');
      } finally {
        setPlansLoading(false);
      }
    };
    fetchUserAndPlans();
  }, [role]);

  const handleProceed = async () => {
    const plan = displayPlans.find(p => p.id === selected);
    if (!plan || plan.id === 'bronze' || !user) return;

    setSubmitting(true);
    setPaymentError(null);

    try {
      const subscriptionResponse = await api.post('/payment/razorpay/subscriptions', {
        plan_id: plan.apiPlanId || plan.id,
        user_id: user._id || user.id,
        total_count: 12,
      });

      if (subscriptionResponse.data?.success && subscriptionResponse.data?.data) {
        const subscriptionData = subscriptionResponse.data.data;
        if (subscriptionData.short_url) {
          sessionStorage.setItem('subscription_id', subscriptionData.id);
          window.location.href = subscriptionData.short_url;
        } else if (subscriptionData.id) {
          router.push(`/${role}/account/payment-success?subscription_id=${subscriptionData.id}`);
        } else {
          setPaymentError('Failed to create payment link. Please try again.');
        }
      } else {
        setPaymentError(subscriptionResponse.data?.message || 'Failed to create subscription. Please try again.');
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setPaymentError(err?.response?.data?.message || err?.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#272626] border-t-[#16a34a] rounded-full animate-spin" />
          <p className="text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000201] text-white">
      <div className="flex gap-[20px] p-5 overflow-x-auto pb-[100px]">
        {displayPlans.map(plan => {
          const isCurrentPlan = user?.currentPlan?.toLowerCase() === plan.id;
          return (
          <div
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`relative flex-shrink-0 w-[285px] h-[907px] rounded-[24px] overflow-hidden cursor-pointer transition-all ${
              plan.highlight ? 'bg-gradient-to-b from-[#16a34a] to-[#073618]' : isCurrentPlan ? 'bg-gradient-to-b from-[#16a34a] to-[#073618]' : 'bg-[#272626]'
            } ${selected === plan.id ? 'ring-2 ring-white/40' : ''}`}
          >
            {isCurrentPlan && (
              <div className="absolute top-0 left-0 w-[120px] h-[28px] bg-[#0f5132] flex items-center justify-center rounded-br-[8px]">
                <span className="text-[12px] font-normal text-[#e3e3e3] capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  current plan
                </span>
              </div>
            )}
            {plan.popular && !isCurrentPlan && (
              <div className="absolute top-0 right-0 w-[103px] h-[28px] bg-[#0f5132] flex items-center justify-center rounded-bl-[8px]">
                <span className="text-[12px] font-normal text-[#e3e3e3] capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  most popular
                </span>
              </div>
            )}
            <div className="p-[20px] flex flex-col h-full">
              <p className="text-[36px] font-semibold text-white capitalize leading-[1.2] mb-[12px]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-[4px] mb-[4px]">
                <span className="text-[36px] font-semibold text-white leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
                  {plan.price}
                </span>
                <span className={`text-[16px] font-normal leading-[1.6] ${plan.highlight ? 'text-[#e3e3e3]' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {plan.priceSub}
                </span>
              </div>
              <p className={`text-[16px] font-normal leading-[1.6] mb-[32px] ${plan.highlight ? 'text-[#e3e3e3]' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {plan.desc}
              </p>
              <div className="flex flex-col gap-[12px] mb-[32px]">
                <button
                  className="w-full h-[48px] border border-white rounded-full text-[16px] font-medium text-white capitalize hover:bg-white/10 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  onClick={e => { e.stopPropagation(); setSelected(plan.id); }}
                >
                  {plan.cta}
                </button>
                <p className={`text-[12px] font-normal text-center leading-[1.6] ${plan.highlight ? 'text-[#e3e3e3]' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {plan.ctaNote}
                </p>
              </div>
              <p className="text-[20px] font-semibold text-white capitalize leading-[1.2] mb-[8px]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
                {plan.includes}
              </p>
              <div className="flex flex-col gap-[8px] overflow-y-auto flex-1">
                {plan.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-[8px]">
                    <CheckIcon color={plan.highlight ? '#e3e3e3' : '#9b9b9b'} />
                    <p className={`text-[16px] font-normal leading-[1.6] ${plan.highlight ? 'text-[#e3e3e3]' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 right-0 left-0 flex justify-end gap-[20px] px-5 py-4 bg-[#000201]/90 backdrop-blur border-t border-white/5">
        {paymentError && <p className="text-red-400 text-sm self-center">{paymentError}</p>}
        <button
          onClick={() => router.push(`/${role}/account`)}
          className="border border-white h-[40px] w-[160px] rounded-full text-[16px] font-normal text-white capitalize hover:bg-white/10 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Cancel
        </button>
        <button
          onClick={handleProceed}
          disabled={submitting || selected === 'bronze'}
          className="bg-[#16a34a] hover:bg-[#15803d] h-[40px] w-[160px] rounded-full text-[16px] font-normal text-white capitalize transition-colors disabled:opacity-40"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {submitting ? 'Processing…' : 'Proceed to Pay'}
        </button>
      </div>
    </div>
  );
}
