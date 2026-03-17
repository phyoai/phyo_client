'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine } from '@phyoofficial/phyo-icon-library';
import { useRoleContext } from '@/app/context/RoleContext';
import AppBar from '@/components/ui/AppBar';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { usePayment } from '@/hooks';
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

// Map feature keys to readable names
const featureLabels = {
  creatorSearch: 'Creator Search',
  creatorInsights: 'Creator Insights',
  advancedFilters: 'Advanced Filters',
  audienceBasedSearch: 'Audience Based Search',
  historicalCost: 'Historical Cost Data',
  preCuratedList: 'Pre-Curated Lists',
  brandAnalysis: 'Brand Analysis',
  costingInsights: 'Costing Insights',
  openAccessInfluencerDatabase: 'Open Access Influencer Database',
  campaignReports: 'Campaign Reports',
  roleBasedAccess: 'Role-Based Access',
  volumeBasedDiscount: 'Volume Based Discounts',
  platformTraining: 'Platform Training',
  dedicatedCustomerSuccess: 'Dedicated Customer Success',
  credits: 'Credits/Month'
};

// Plan color mapping
const planColors = {
  'BRONZE': {
    tag: 'bg-[#E6E6E6] border-[#4D4D4D]',
    text: 'text-[#242527]',
    border: 'border-[#E6E6E6]'
  },
  'SILVER': {
    tag: 'bg-[#08A64A] border-[#067635]',
    text: 'text-[#B2E3C7]',
    border: 'border-[#067635]'
  },
  'GOLD': {
    tag: 'bg-[#0B4FD9] border-[#0A48C5]',
    text: 'text-[#B3C8F3]',
    border: 'border-[#08389A]'
  },
  'PREMIUM': {
    tag: 'bg-[#FAB70C] border-[#B28209]',
    text: 'text-[#8A6507]',
    border: 'border-[#B28209]'
  }
};

export default function UpgradePlanAll() {
  const router = useRouter();
  const { role } = useRoleContext();
  const {
    plans: reduxPlans,
    userPlan,
    loading,
    error,
    fetchSubscriptionPlans,
    fetchUserPlan,
    fetchCreditInfo,
    createNewPaymentOrder
  } = usePayment();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('MONTHLY');
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

  // Fetch data on mount
  useEffect(() => {
    fetchSubscriptionPlans();
    fetchUserPlan();
    fetchCreditInfo();
  }, [fetchSubscriptionPlans, fetchUserPlan, fetchCreditInfo]);

  // Transform API plans to UI format
  const transformedPlans = (reduxPlans || []).map((plan) => {
    const planName = plan.name || 'UNKNOWN';
    const colors = planColors[planName] || planColors['BRONZE'];

    // Generate benefits from features
    const benefits = [];
    if (plan.features) {
      Object.entries(plan.features).forEach(([key, value]) => {
        if (value === true) {
          benefits.push(featureLabels[key] || key);
        } else if (value && typeof value === 'string') {
          benefits.push(`${featureLabels[key] || key}: ${value}`);
        } else if (typeof value === 'number' && value > 0) {
          benefits.push(`${featureLabels[key] || key}: ${value}`);
        }
      });
    }

    return {
      id: plan.id || plan.name.toLowerCase(),
      name: planName,
      displayName: plan.displayName,
      price: `₹${plan.price}`,
      priceNumber: plan.price,
      currency: plan.currency || 'INR',
      ...colors,
      isActive: plan.isActive,
      benefits: benefits.length > 0 ? benefits : ['No features available'],
      rawData: plan
    };
  });

  // Use transformed plans or empty array
  const plans = transformedPlans.length > 0 ? transformedPlans : [];

  // Initialize selected plan and set from userPlan
  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0].id);
    }
    if (userPlan && userPlan.planId) {
      setSelectedPlan(userPlan.planId);
    }
  }, [userPlan, plans.length]);

  // Error state
  if (error && !loading) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Plans & Billings"
          onBack={() => router.push(`/${role}/account`)}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-lg font-semibold mb-4" style={{ color: colors.semantic.error.bold }}>
            Error loading plans
          </p>
          <p className="text-sm text-center mb-6" style={{ color: colors.text.neutral.muted }}>
            {error}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              fetchSubscriptionPlans();
              fetchUserPlan();
              fetchCreditInfo();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Plans & Billings"
          onBack={() => router.push(`/${role}/account`)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8" style={{ color: colors.brand.base }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p style={{ color: colors.text.neutral.muted }}>Loading plans...</p>
          </div>
        </div>
      </div>
    );
  }

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
          onClick={() => router.push(`/${role}/account`)}
          className="absolute top-4 left-4"
        />

        <div className="flex flex-col items-center gap-6">
          <div className="pop-scale">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="150" height="150" fill={colors.accent.subtle} />
              <circle cx="75" cy="75" r="60" fill={colors.brand.base} />
              <path d="M55 75L68 88L95 60" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
            onClick={() => router.push(`/${role}/dashboard`)}
          >
            Go to home
          </Button>
        </div>
      </div>
    );
  }

  // Handle plan upgrade
  const handleUpgradeClick = async () => {
    if (selectedPlan === 'free' || !selectedPlan) return;

    try {
      await createNewPaymentOrder(selectedPlan, selectedBillingCycle);
      setShowBillingForm(true);
    } catch (err) {
      console.error('Payment order creation failed:', err);
    }
  };

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
        onBack={() => router.push(`/${role}/account`)}
        showMenu={true}
        onMenuClick={() => console.log('Open menu')}
      />

      {/* Plans Container */}
      <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-auto">
          {plans.map((plan) => {
            const isCurrentPlan = userPlan && userPlan.planId === plan.id;
            const isInactive = !plan.isActive;

            return (
            <div
              key={plan.id}
              className={`border-2 rounded-xl flex flex-col py-3 transition-all hover:shadow-lg ${isInactive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                backgroundColor: colors.neutral.muted,
                borderColor: plan.name === 'BRONZE' ? '#E6E6E6' :
                            plan.name === 'SILVER' ? '#067635' :
                            plan.name === 'GOLD' ? '#0A48C5' :
                            plan.name === 'PREMIUM' ? '#B28209' :
                            colors.neutral.muted
              }}
              onClick={() => !isCurrentPlan && !isInactive && setSelectedPlan(plan.id)}
            >
              {/* Current Plan Label */}
              {isCurrentPlan && (
                <div className="px-4 mb-3">
                  <p className="text-xs tracking-wide font-semibold" style={{ color: colors.brand.base, fontFamily: 'Inter, sans-serif' }}>
                    Current Plan
                  </p>
                </div>
              )}

              {/* Inactive Badge */}
              {isInactive && (
                <div className="px-4 mb-3">
                  <p className="text-xs tracking-wide font-semibold" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                    Inactive
                  </p>
                </div>
              )}

              {/* Tag & Radio Button */}
              <div className="flex items-center justify-between pl-4 mb-5">
                <div className={`${plan.tag || 'bg-gray-200 border-gray-400'} border rounded px-1.5 py-0.5`}>
                  <span className={`${plan.text || 'text-gray-800'} text-xs font-medium tracking-wide`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                    {plan.displayName || plan.name}
                  </span>
                </div>
                <RadioButton
                  selected={selectedPlan === plan.id}
                  disabled={isCurrentPlan || isInactive}
                  onChange={() => !isCurrentPlan && !isInactive && setSelectedPlan(plan.id)}
                />
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-0 mb-5">
                <div className="px-4">
                  <p className="text-4xl font-bold leading-tight" style={{ color: colors.text.neutral.base, fontFamily: 'Manrope, sans-serif' }}>
                    {plan.price || '₹0'}
                  </p>
                </div>
                <div className="px-4">
                  <p className="text-xl font-semibold" style={{ color: colors.text.neutral.base, fontFamily: 'Manrope, sans-serif' }}>
                    {plan.displayName || plan.name}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex-1 px-4 overflow-y-auto">
                <ul className="text-sm space-y-1" style={{ color: colors.text.neutral.base, fontFamily: 'Work Sans, sans-serif' }}>
                  {(plan.benefits || []).slice(0, 10).map((benefit, index) => (
                    <li key={index} className="flex items-start leading-5">
                      <span className="mr-2 flex-shrink-0">•</span>
                      <span className="text-xs">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Proceed to Billing Button */}
      <div className="sticky bottom-0 px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4 border-t flex justify-center" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted }}>
        <Button
          variant="primary"
          size="lg"
          onClick={handleUpgradeClick}
          disabled={!selectedPlan || selectedPlan === plans[0]?.id || loading || plans.length === 0}
          loading={loading}
        >
          {!selectedPlan || selectedPlan === plans[0]?.id || plans.length === 0 ? 'Select a plan to proceed' : 'Proceed to billing'}
        </Button>
      </div>
    </div>
  );
}
