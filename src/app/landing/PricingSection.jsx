'use client'
import { useState } from 'react';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('annually');

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'Free Forever',
      description: 'Perfect for early-stage creators, startups, and curious users.',
      buttonText: 'Start Free',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: 'Billed in one annual payment.',
      features: [
        '10 Credits/month',
        '5 Influencer Searches',
        'Creator Insights (Basic)',
        'Access to All Supported Platforms',
        'Limited AI Report Access (Preview mode)',
        'Credit Validity: 45 Days'
      ]
    },
    {
      name: 'Bronze',
      price: '$20',
      period: 'Month',
      description: 'Best for freelancers, boutique agencies, or small teams.',
      buttonText: 'Start Now',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: 'Billed in one monthly payment.',
      highlight: true,
      features: [
        '100 Credits/month',
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
      name: 'Silver',
      price: '$50',
      period: 'Month',
      description: 'Perfect for early-stage creators, startups, and curious users.',
      buttonText: 'Start Now',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: 'Billed in one monthly payment.',
      features: [
        '200 Credits/month',
        '20 Deep Searches',
        '10 AI-Powered Campaign Reports',
        'Dedicated Chat Support',
        'AI optimizes campaigns',
        'Unlimited Users',
        'Historical Data (Up to 6 months)',
        'Exportable Analytics (CSV/PDF)',
        'AI Smart Creators, Niche, Region, Top',
        'Multi-Platform Aggregated Creator Profiles'
      ]
    },
    {
      name: 'Gold',
      price: '$100',
      period: 'Month',
      description: 'Perfect for global agencies managing multiple campaigns.',
      buttonText: 'Start Now',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: 'Billed in one monthly payment.',
      features: [
        '500 Credits/month',
        '100 Smart Searches',
        'AI Competitor Analysis (Track 5 competitors)',
        'Trend Analyzer (5 trends/month)',
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
    <section 
      className="relative bg-cover bg-center bg-no-repeat py-20 px-4"
      style={{ backgroundImage: 'url(/landing/pricing_bg.jpg)' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-500 bg-opacity-20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-green-400 text-sm font-medium">Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple Scalable Powerful
          </h2>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-12">
            From free tools to full-scale execution Phyo's Pricing Plans are designed to grow with your goals, not limit them.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-black' 
                  : 'text-white border border-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-6 py-2 rounded-full transition-colors flex items-center ${
                billingCycle === 'annually' 
                  ? 'bg-white text-black' 
                  : 'text-white border border-gray-500'
              }`}
            >
              Annually
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border ${
                plan.highlight 
                  ? 'border-green-500 shadow-2xl shadow-green-500/20' 
                  : 'border-gray-700'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.price !== '$0' && (
                    <span className="text-gray-400 ml-1">/{plan.period}</span>
                  )}
                  {plan.price === '$0' && (
                    <span className="text-gray-400 ml-2 text-sm">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                
                <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonStyle} text-white`}>
                  {plan.buttonText}
                </button>
                
                <p className="text-gray-500 text-xs mt-3 text-center">{plan.billing}</p>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-white font-medium mb-4">Free Plan includes</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Pricing Section */}
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-3xl font-bold text-white mb-2">Custom Pricing For ALL</h3>
              <p className="text-gray-300">Powerful customizable plans for agencies brands, & enterprise teams.</p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors">
              Contact us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;