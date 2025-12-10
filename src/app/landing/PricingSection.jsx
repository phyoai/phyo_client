'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import paymentService from '../../utils/payment';
import { useRouter } from 'next/navigation';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('annually');
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Check user's current plan
    if (isAuthenticated()) {
      checkUserPlan();
    }
  }, [isAuthenticated]);

  const checkUserPlan = async () => {
    try {
      const response = await paymentService.getUserPlan();
      if (response.success) {
        setUserPlan(response.data.currentPlan);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  const handlePlanClick = async (plan) => {
    if (plan.price === '$0') {
      // Handle free plan
      alert('Free plan is already available to all users!');
      return;
    }

    setLoading(true);
    setProcessingPlan(plan.name);

    try {
      // Map plan to API plan ID
      const planId = getPlanId(plan.name);
      const interval = billingCycle === 'annually' ? 'YEARLY' : 'MONTHLY';

      // Create payment order - directly proceed without checking authentication
      // If user is not authenticated, API will return error which we'll handle
      const orderResponse = await paymentService.createOrder(planId, interval);
      
      if (orderResponse.success) {
        // Initialize Razorpay payment
        const rzp = paymentService.initializeRazorpay(
          orderResponse.data,
          // Success callback
          async (response) => {
            try {
              const verificationResponse = await paymentService.verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
                planId
              );

              if (verificationResponse.success) {
                alert('Payment successful! Your subscription has been activated.');
                await checkUserPlan(); // Refresh user plan
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
            }
          },
          // Failure callback
          (error) => {
            console.error('Payment failed:', error);
            alert('Payment was cancelled or failed. Please try again.');
          }
        );

        // Open Razorpay payment modal directly
        if (rzp) {
          rzp.open();
        }
      } else {
        throw new Error(orderResponse.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Check if error is due to authentication
      if (error.response?.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        alert('Please login or signup to proceed with payment. Redirecting to login...');
        const currentPath = window.location.pathname;
        router.push(`/brand/signup?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        alert(error.message || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  const getPlanId = (planName) => {
    const planMapping = {
      'Bronze': 'bronze-monthly',
      'Silver': 'silver-monthly',
      'Gold': 'gold-monthly',
      'Premium': 'premium-monthly'
    };
    return planMapping[planName] || 'bronze-monthly';
  };

  const getPrice = (plan) => {
    if (plan.name === 'Bronze') return '$0';
    if (plan.name === 'Silver') return '$19';
    if (plan.name === 'Gold') return '$79';
    if (plan.name === 'Premium') return '$199';
    return plan.price;
  };

  const getDisplayPrice = (plan) => {
    const basePrice = getPrice(plan);
    if (basePrice === '$0') return '$0';
    
    if (billingCycle === 'annually') {
      // Show 15% discount for annual billing
      const monthlyPrice = parseInt(basePrice.replace('$', ''));
      const annualPrice = Math.round(monthlyPrice * 12 * 0.85);
      return `$${annualPrice}`;
    }
    return basePrice;
  };

  const plans = [
    {
      name: 'Bronze',
      price: '$0',
      period: 'Free Forever',
      description: 'Perfect for early-stage creators, startups, and curious users.',
      buttonText: isAuthenticated() && userPlan === 'BRONZE' ? 'Current Plan' : 'Start Free',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: 'Free forever, no credit card required.',
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
      name: 'Silver',
      price: '$19',
      period: 'Month',
      description: 'Best for freelancers, boutique agencies, or small teams.',
      buttonText: isAuthenticated() && userPlan === 'SILVER' ? 'Current Plan' : 'Start Now',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: `Billed ${billingCycle === 'annually' ? 'annually' : 'monthly'}.`,
      highlight: true,
      features: [
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
      name: 'Gold',
      price: '$79',
      period: 'Month',
      description: 'Perfect for growing brands and mid-size teams.',
      buttonText: isAuthenticated() && userPlan === 'GOLD' ? 'Current Plan' : 'Start Now',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: `Billed ${billingCycle === 'annually' ? 'annually' : 'monthly'}.`,
      features: [
        '250 Credits/month',
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
      name: 'Premium',
      price: '$199',
      period: 'Month',
      description: 'Perfect for global agencies managing multiple campaigns.',
      buttonText: isAuthenticated() && userPlan === 'PREMIUM' ? 'Current Plan' : 'Start Now',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      billing: `Billed ${billingCycle === 'annually' ? 'annually' : 'monthly'}.`,
      features: [
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
        '24/7 Priority Support'
      ]
    }
  ];

  return (
    <section 
      id="pricing-section"
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
                  <span className="text-4xl font-bold text-white">{getDisplayPrice(plan)}</span>
                  {getDisplayPrice(plan) !== '$0' && (
                    <span className="text-gray-400 ml-1">/{plan.period}</span>
                  )}
                  {getDisplayPrice(plan) === '$0' && (
                    <span className="text-gray-400 ml-2 text-sm">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                
                <button
                  onClick={() => handlePlanClick(plan)}
                  disabled={loading && processingPlan === plan.name}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonStyle} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && processingPlan === plan.name ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </button>
                
                <p className="text-gray-500 text-xs mt-3 text-center">{plan.billing}</p>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-white font-medium mb-4">
                  {plan.name === 'Bronze' ? 'Free Plan includes' : `${plan.name} Plan includes`}
                </h4>
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