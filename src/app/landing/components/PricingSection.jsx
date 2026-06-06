'use client';

import { memo, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import PricingCard from './PricingCard';
import OutlineGlowButton from '@/components/shared/OutlineGlowButton';

const pricingPlans = [
  {
    name: 'Bronze',
    monthlyPrice: 'Rs.0',
    annualPrice: 'Rs.0',
    period: 'Free Forever',
    description: 'Perfect for early-stage creators, startups, and curious users.',
    buttonLabel: 'Start Free',
    note: 'Free Forever, No Credit Card Required.',
    featuresTitle: 'Free Plan Includes',
    features: [
      '10 Credits/Month',
      '5 Influencer Searches',
      'Creator Insights (Basic)',
      'Access To All Supported Platforms',
      'Limited AI Report Access (Preview Mode)',
      'Credit Validity: 45 Days',
    ],
  },
  {
    name: 'Silver',
    monthlyPrice: 'Rs. 1,900',
    annualPrice: 'Rs. 1,425',
    period: '/ Month',
    description: 'Best for freelancers, boutique agencies, or small teams.',
    buttonLabel: 'Start With Silver',
    note: 'Billed Annually.',
    featuresTitle: 'Silver Plan Includes',
    highlight: true,
    features: [
      '50 Credits/Month',
      '10 Advanced Searches',
      '4 Campaign Reports',
      'Creator Insights (Advanced)',
      'AI-Powered Report Analyzer',
      'Add Up To 2 Team Members',
      'Historical Data Access (Up To 3 Months)',
      'Access To All Platforms',
      'Email Support',
    ],
  },
  {
    name: 'Gold',
    monthlyPrice: 'Rs. 7,900',
    annualPrice: 'Rs. 5,925',
    period: '/ Month',
    description: 'Perfect for growing brands and mid-size teams.',
    buttonLabel: 'Start With Gold',
    note: 'Billed Annually.',
    featuresTitle: 'Gold Plan Includes',
    features: [
      '250 Credits/Month',
      '20 Deep Searches',
      '10 AI-Powered Campaign Reports',
      'Dedicated Chat Support',
      'AI Optimizes Campaigns',
      'Unlimited Users',
      'Historical Data (Up To 6 Months)',
      'Exportable Analytics (CSV/PDF)',
      'AI Smart Creators, Niche, Region, Top',
      'Multi-Platform Aggregated Creator Profiles',
    ],
  },
  {
    name: 'Premium',
    monthlyPrice: 'Rs. 19,900',
    annualPrice: 'Rs. 14,925',
    period: '/ Month',
    description: 'Perfect for global agencies managing multiple campaigns.',
    buttonLabel: 'Start With Premium',
    note: 'Billed Annually.',
    featuresTitle: 'Premium Plan Includes',
    features: [
      'Unlimited Credits/Month',
      '100 Smart Searches',
      'AI Competitor Analysis (Track 5 Competitors)',
      'Trend Analyzer (5 Trends/Month)',
      'Campaign Auto-Optimization Insights',
      'Reusable Campaign Templates',
      'Dedicated Account Workspace',
      'Priority Access To New Features',
      'Team Analytics Dashboard',
      'Global Creator Index Access',
      '24/7 Priority Support',
    ],
  },
];

const BillingToggle = memo(function BillingToggle({ billingCycle, onChangeCycle }) {
  const outlineGlowButtonClass = 'group relative isolate inline-flex items-center justify-center overflow-visible rounded-[40px] bg-transparent font-inter text-[16px] font-normal capitalize leading-[1.2] text-white transition-colors duration-300 ease-out hover:bg-[#141615]';
  const pressGreenButtonClass = 'active:bg-[#16A34A] active:text-white';

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => onChangeCycle('monthly')}
          aria-pressed={billingCycle === 'monthly'}
          className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-12 w-[140px] text-[16px] ${
            billingCycle === 'monthly' ? '!bg-[#159b46] hover:!bg-[#159b46]' : ''
          }`}
        >
          <span className="relative z-10 leading-[1.2]">Monthly</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeCycle('annual')}
          aria-pressed={billingCycle === 'annual'}
          className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-12 w-[200px] ${
            billingCycle === 'annual' ? '!bg-[#159b46] hover:!bg-[#159b46]' : ''
          }`}
        >
          <span className="relative z-10 inline-flex items-center gap-3 leading-[1.2]">
            <span className="text-[16px]">Annually</span>
            <span
              className={`inline-flex h-7 w-[83px] items-center justify-center rounded-full text-[12px] font-normal leading-[1.2] ${
                billingCycle === 'annual'
                  ? 'bg-[#fff] text-[#16a34a]'
                  : 'bg-[#3b3b3b] text-[#e3e3e3]'
              }`}
            >
              Save 25%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
});

BillingToggle.displayName = 'BillingToggle';

const PricingSection = memo(function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('annual');

  const handleChangeCycle = useCallback((cycle) => {
    setBillingCycle(cycle);
  }, []);

  // Memoize the plans to prevent recalculation
  const memoizedPlans = useMemo(() => pricingPlans, []);

  return (
    <section id="pricing" className="mx-auto max-w-[1440px] sm:px-6 lg:px-[120px] mt-[20px]">
      <div className="mx-auto max-w-[900px] text-center pt-[80px]">
        <h2 className="font-bricolage text-[34px] leading-[1.2] text-white sm:text-[36px]">
          Simple Scalable{' '}
          <span className="font-semibold text-[#16a34a]">Powerful</span>
        </h2>
        <p className="mt-4 text-[16px] leading-[1.2] text-[#9b9b9b]">
          From free tools to full-scale execution Phyo&apos;s pricing plans
          are designed to grow with your goals, not limit them.
        </p>
      </div>

      <BillingToggle billingCycle={billingCycle} onChangeCycle={handleChangeCycle} />

      <div className="mx-auto mt-10 flex w-full flex-nowrap gap-[20px] overflow-x-auto pb-2 scrollbar-hide xl:relative xl:left-1/2 xl:w-[1200px] xl:max-w-none xl:-translate-x-1/2 xl:justify-start xl:overflow-visible xl:pb-0">
        {memoizedPlans.map((plan) => (
          <PricingCard
            key={plan.name}
            billingCycle={billingCycle}
            plan={plan}
          />
        ))}
      </div>
    </section>
  );
});

PricingSection.displayName = 'PricingSection';

export default PricingSection;
