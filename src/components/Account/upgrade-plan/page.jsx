'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { colors } from '@/config/colors';

const RadioButton = ({ selected = false, disabled = false, onChange }) => {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="flex items-center justify-center w-12 h-12 shrink-0"
    >
      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: disabled ? colors.text.neutral.muted : colors.brand.base,
          backgroundColor: 'transparent'
        }}
      >
        {selected && (
          <div className="w-3 h-3 rounded-full"
            style={{ backgroundColor: disabled ? colors.text.neutral.muted : colors.brand.base }}
          />
        )}
      </div>
    </button>
  );
};

export default function UpgradePlanAll() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [billingData, setBillingData] = useState({
    phone: '',
    email: '',
    country: 'India',
    house: '',
    street: '',
    city: '',
    state: ''
  });

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      tagColor: 'bg-[#E6E6E6] border-[#4D4D4D]',
      textColor: 'text-[#242527]',
      borderColor: 'border-[#E6E6E6]',
      isCurrent: true,
      benefits: [
        '10 Credits/month',
        '5 Influencer Searches',
        'Creator Insights (Basic)',
        'Access to All Supported Platforms',
        'Limited AI Report Access (Preview mode)',
        'Credit Validity: 45 Days'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '₹199',
      tagColor: 'bg-[#08A64A] border-[#067635]',
      textColor: 'text-[#B2E3C7]',
      borderColor: 'border-[#067635]',
      isCurrent: false,
      benefits: [
        '50 Credits/month',
        '10 Advanced Searches',
        '4 Campaign Reports',
        'Creator Insights (Advanced)',
        'AI-Powered Report Analyzer',
        'Add Up to 2 Team Members',
        'Historical Data Access (Up to 3 months)',
        'Access to All Platforms',
        'Email Support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₹799',
      tagColor: 'bg-[#0B4FD9] border-[#0A48C5]',
      textColor: 'text-[#B3C8F3]',
      borderColor: 'border-[#08389A]',
      isCurrent: false,
      benefits: [
        '250 Credits/month',
        '20 Deep Searches',
        '10 AI-Powered Campaign Reports',
        'Dedicated Chat Support',
        'AI optimizes campaigns',
        'Unlimited UserLine',
        'Historical Data (Up to 6 months)',
        'Exportable Analytics (CSV/ PDF)',
        'AI Smart Creators, Niche, Region, Top',
        'Multi-Platform Aggregated Creator Profiles'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹1999',
      tagColor: 'bg-[#FAB70C] border-[#B28209]',
      textColor: 'text-[#8A6507]',
      borderColor: 'border-[#B28209]',
      isCurrent: false,
      benefits: [
        'Unlimited Credits/month',
        '100 Smart Searches',
        'AI Competitor Analysis (Track 5 competitors)',
        'Trend Analyzer (5 trends/ month)',
        'Campaign Auto-Optimization Insights',
        'Reusable Campaign Templates',
        'Dedicated Account Workspace',
        'Priority Access to New Features',
        'Team Analytics Dashboard',
        'Global Creator Index Access',
        '24/7 Priority Support'
      ]
    }
  ];

  // Payment success view
 // Payment success view
if (paymentSuccess) {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-3 sm:px-4 md:px-6" style={{ backgroundColor: colors.neutral.base }}>
      <style>{`
        @keyframes popScale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkMark {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .pop-scale {
          animation: popScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .check-animate {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkMark 0.8s ease-out 0.3s forwards;
        }
      `}</style>

      <IconButton
        icon={ArrowLeftLine}
        size="lg"
        variant="default"
        onClick={() => router.push('/brand/account')}
        className="absolute top-4 left-4"
      />

      <div className="flex flex-col items-center gap-6">
        <div className="pop-scale">
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="150" fill={colors.accent.subtle}/>
            <circle cx="75" cy="75" r="60" fill={colors.brand.base}/>
            <path d="M55 75L68 88L95 60" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-center" style={{ color: colors.text.neutral.base }}>
          Payment successful
        </h1>

        <p className="text-lg text-center max-w-md" style={{ color: colors.text.neutral.muted }}>
          Your plan has been updated and all features are now unlocked.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push('/brand/dashboard')}
        >
          Go to home
        </Button>
      </div>
    </div>
  );
}

  // Billing form view
  if (showBillingForm) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: colors.neutral.muted }}>
          <IconButton
            icon={ArrowLeftLine}
            size="lg"
            variant="default"
            onClick={() => setShowBillingForm(false)}
          />
          <h2 className="text-xl font-semibold" style={{ color: colors.text.neutral.base, fontFamily: 'Manrope, sans-serif' }}>
            Billing
          </h2>
          <div className="w-12" />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5">
          <form className="space-y-6">
            {/* Contact Details Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.neutral.base }}>Contact Details</h3>

              {/* PhoneLine Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.neutral.base }}>PhoneLine number</label>
                <div className="flex gap-2">
                  <select className="w-20 border rounded px-3 py-2" style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}>
                    <option>+91</option>
                  </select>
                  <input
                    type="text"
                    placeholder="07ABCDE1234F1Z5"
                    value={billingData.phone}
                    onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                    className="flex-1 border rounded px-4 py-2"
                    style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.neutral.base }}>Finance Contact Email</label>
                <input
                  type="email"
                  placeholder="jhondoe@gmail.com"
                  value={billingData.email}
                  onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}
                />
              </div>
            </div>

            {/* Billing Address Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.neutral.base }}>Billing Address</h3>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.neutral.base }}>Country/Region</label>
                <select
                  value={billingData.country}
                  onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>

              {/* House/Building No */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.neutral.base }}>House/Building No.</label>
                <input
                  type="text"
                  placeholder="H-32"
                  value={billingData.house}
                  onChange={(e) => setBillingData({ ...billingData, house: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}
                />
              </div>

              {/* Street */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.neutral.base }}>Street No.</label>
                <input
                  type="text"
                  placeholder="Street No.4"
                  value={billingData.street}
                  onChange={(e) => setBillingData({ ...billingData, street: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}
                />
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.neutral.base }}>City</label>
                <input
                  type="text"
                  placeholder="Saket"
                  value={billingData.city}
                  onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.neutral.base }}>State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={billingData.state}
                  onChange={(e) => setBillingData({ ...billingData, state: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  style={{ backgroundColor: colors.neutral.muted, borderColor: colors.neutral.muted, color: colors.text.neutral.base }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Proceed Button */}
        <div className="sticky bottom-0 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-t flex justify-center" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setPaymentSuccess(true)}
          >
            Proceed to payment
          </Button>
        </div>
      </div>
    );
  }

  // Plans view (default)
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
      <AppBar
        title="Plans & Billings"
        onBack={() => router.push('/brand/account')}
        showMenu={true}
        onMenuClick={() => console.log('Open menu')}
      />

      {/* Plans Container */}
      <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border-2 rounded-xl flex flex-col py-3 transition-all hover:shadow-lg cursor-pointer`}
              style={{
                backgroundColor: colors.neutral.muted,
                borderColor: plan.borderColor
              }}
              onClick={() => !plan.isCurrent && setSelectedPlan(plan.id)}
            >
              {/* Current Plan Label (only for free plan) */}
              {plan.isCurrent && (
                <div className="px-4 mb-3">
                  <p className="text-xs tracking-wide" style={{ color: colors.text.neutral.muted, fontFamily: 'Inter, sans-serif' }}>
                    Current Plan
                  </p>
                </div>
              )}

              {/* Tag & Radio Button */}
              <div className="flex items-center justify-between pl-4 mb-5">
                <div className={`${plan.tagColor} border rounded px-1.5 py-0.5`}>
                  <span className={`${plan.textColor} text-xs font-medium tracking-wide`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                    {plan.name}
                  </span>
                </div>
                <RadioButton
                  selected={selectedPlan === plan.id}
                  disabled={plan.isCurrent}
                  onChange={() => !plan.isCurrent && setSelectedPlan(plan.id)}
                />
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-0 mb-5">
                <div className="px-4">
                  <p className="text-4xl font-bold leading-tight" style={{ color: colors.text.neutral.base, fontFamily: 'Manrope, sans-serif' }}>
                    {plan.price}
                  </p>
                </div>
                <div className="px-4">
                  <p className="text-xl font-semibold" style={{ color: colors.text.neutral.base, fontFamily: 'Manrope, sans-serif' }}>
                    {plan.name}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex-1 px-4 overflow-y-auto">
                <ul className="text-base space-y-1" style={{ color: colors.text.neutral.base, fontFamily: 'Work Sans, sans-serif' }}>
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start leading-6">
                      <span className="mr-2">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proceed to Billing Button */}
      <div className="sticky bottom-0 px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4 border-t flex justify-center" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted }}>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowBillingForm(true)}
          disabled={selectedPlan === 'free'}
        >
          {selectedPlan === 'free' ? 'Select a plan to proceed' : 'Proceed to billing'}
        </Button>
      </div>
    </div>
  );
}
