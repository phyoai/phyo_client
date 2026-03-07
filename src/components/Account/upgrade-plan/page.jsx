'use client';

import  React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { ArrowLeftSLine, MoreLine } from '@phyoofficial/phyo-icon-library';

const RadioButton = ({ selected = false, disabled = false, onChange }) => {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="flex items-center justify-center w-12 h-12 shrink-0"
    >
      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: disabled ? '#808080' : '#43573B',
          backgroundColor: 'transparent'
        }}
      >
        {selected && (
          <div className="w-3 h-3 rounded-full"
            style={{ backgroundColor: disabled ? '#808080' : '#43573B' }}
          />
        )}
      </div>
    </button>
  );
};

export default function UpgradePlan() {
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
    <div className="bg-neutral-base h-screen flex flex-col items-center justify-center px-4">
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

      <button
        onClick={() => router.push('/brand/account')}
        className="absolute top-4 left-4 flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeftSLine className="w-6 h-6 text-[#242527]" />
      </button>

      <div className="flex flex-col items-center gap-6">
        <div className="pop-scale">
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="150" fill="#E8F5E9"/>
            <circle cx="75" cy="75" r="60" fill="#43573B"/>
            <path d="M55 75L68 88L95 60" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#242527] text-center">
          Payment successful
        </h1>

        <p className="text-lg text-gray-600 text-center max-w-md">
          Your plan has been updated and all features are now unlocked.
        </p>

        <button
          onClick={() => router.push('/brand/dashboard')}
          className="bg-[#43573B] hover:bg-[#3d4f36] text-white py-3 px-8 rounded-full font-semibold transition-colors"
        >
          Go to home
        </button>
      </div>
    </div>
  );
}

  // Billing form view
  if (showBillingForm) {
    return (
      <div className="bg-neutral-base h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <button
            onClick={() => setShowBillingForm(false)}
            className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftSLine className="w-6 h-6 text-[#242527]" />
          </button>
          <h2 className="text-xl font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Billing
          </h2>
          <div className="w-12" />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form className="space-y-6">
            {/* Contact Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#242527] mb-4">Contact Details</h3>

              {/* PhoneLine Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#242527] mb-2">PhoneLine number</label>
                <div className="flex gap-2">
                  <select className="w-20 bg-gray-100 border border-gray-200 rounded px-3 py-2 text-[#242527]">
                    <option>+91</option>
                  </select>
                  <input
                    type="text"
                    placeholder="07ABCDE1234F1Z5"
                    value={billingData.phone}
                    onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                    className="flex-1 bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#242527] placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#242527] mb-2">Finance Contact Email</label>
                <input
                  type="email"
                  placeholder="jhondoe@gmail.com"
                  value={billingData.email}
                  onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#242527] placeholder-gray-400"
                />
              </div>
            </div>

            {/* Billing Address Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#242527] mb-4">Billing Address</h3>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#242527] mb-2">Country/Region</label>
                <select
                  value={billingData.country}
                  onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#242527]"
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>

              {/* House/Building No */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#242527] mb-2">House/Building No.</label>
                <input
                  type="text"
                  placeholder="H-32"
                  value={billingData.house}
                  onChange={(e) => setBillingData({ ...billingData, house: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#242527] placeholder-gray-400"
                />
              </div>

              {/* Street */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#242527] mb-2">Street No.</label>
                <input
                  type="text"
                  placeholder="Street No.4"
                  value={billingData.street}
                  onChange={(e) => setBillingData({ ...billingData, street: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#242527] placeholder-gray-400"
                />
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#242527] mb-2">City</label>
                <input
                  type="text"
                  placeholder="Saket"
                  value={billingData.city}
                  onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#242527] placeholder-gray-400"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-[#242527] mb-2">State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={billingData.state}
                  onChange={(e) => setBillingData({ ...billingData, state: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#242527] placeholder-gray-400"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Proceed Button */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-100 flex justify-center bg-neutral-base">
          <button
            onClick={() => setPaymentSuccess(true)}
            className="bg-[#43573B] hover:bg-[#3d4f36] text-white py-3 px-8 rounded-full font-semibold transition-colors"
          >
            Proceed to payment
          </button>
        </div>
      </div>
    );
  }

  // Plans view (default)
  return (
    <div className="bg-neutral-base h-screen flex flex-col">
      {/* Header/App Bar */}
      <div className="bg-neutral-base flex items-center justify-between px-1 py-2 border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.push('/brand/account')}
          className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftSLine className="w-6 h-6 text-[#242527]" />
        </button>

        <div className="flex-1 px-2">
          <h2 className="text-xl font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Plans & Billings
          </h2>
        </div>

        <button className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors">
          <MoreLine className="w-6 h-6 text-[#242527]" />
        </button>
      </div>

      {/* Plans Container */}
      <div className="flex-1 px-9 py-4">
        <div className="flex gap-3 h-full min-w-max">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#F0F0F0] border-2 ${plan.borderColor} rounded-xl flex-1 min-w-[250px] max-w-[280px] flex flex-col py-3 transition-all hover:shadow-lg cursor-pointer`}
              onClick={() => !plan.isCurrent && setSelectedPlan(plan.id)}
            >
              {/* Current Plan Label (only for free plan) */}
              {plan.isCurrent && (
                <div className="px-4 mb-3">
                  <p className="text-xs text-[#808080] tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
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
                  <p className="text-4xl font-bold text-[#242527] leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {plan.price}
                  </p>
                </div>
                <div className="px-4">
                  <p className="text-xl font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {plan.name}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex-1 px-4 overflow-y-auto">
                <ul className="text-[#333] text-base space-y-1" style={{ fontFamily: 'Work Sans, sans-serif' }}>
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
      <div className="sticky bottom-0 px-9 py-4 border-t border-gray-100 flex justify-center bg-neutral-base">
        <button
          onClick={() => setShowBillingForm(true)}
          disabled={selectedPlan === 'free'}
          className={`py-3 px-8 rounded-full font-semibold transition-colors min-h-[48px] flex items-center justify-center ${
            selectedPlan === 'free'
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-[#43573B] hover:bg-[#3d4f36] text-white'
          }`}
        >
          {selectedPlan === 'free' ? 'Select a plan to proceed' : 'Proceed to billing'}
        </button>
      </div>
    </div>
  );
}
