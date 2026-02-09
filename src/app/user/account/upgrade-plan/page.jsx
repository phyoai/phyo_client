'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical } from 'lucide-react';

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
        'Unlimited Users',
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

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Header/App Bar */}
      <div className="bg-white flex items-center justify-between px-1 py-2 border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.push('/user/account')}
          className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#242527]" />
        </button>
        
        <div className="flex-1 px-2">
          <h2 className="text-xl font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Plans & Billings
          </h2>
        </div>
        
        <button className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-[#242527]" />
        </button>
      </div>

      {/* Plans Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto px-9 py-4">
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
    </div>
  );
}

