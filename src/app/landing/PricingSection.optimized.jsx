'use client'

/**
 * Optimized PricingSection using new useFetch hook
 *
 * This is an example of how to refactor components to use
 * the advanced API hooks for better performance and error handling
 *
 * To use this:
 * 1. Install dependencies: npm install
 * 2. Compare this with PricingSection.jsx
 * 3. Gradually migrate to use the optimized pattern
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetch, useMutation } from '@/hooks/useFetch';
import { useRouter } from 'next/navigation';

const PricingSection = () => {
    const [billingCycle, setBillingCycle] = useState('annually');
    const [processingPlan, setProcessingPlan] = useState(null);
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
    }, []);

    // Fetch available plans with caching
    const { data: plansResponse, loading: plansLoading } = useFetch(
        '/api/payments/plans',
        {
            cache: true,
            cacheDuration: 60 * 60 * 1000, // Cache for 1 hour
            onError: (error) => {
                console.error('Failed to load plans:', error);
            },
        }
    );

    // Fetch user's current plan (only if authenticated)
    const shouldFetchUserPlan = isAuthenticated();
    const { data: planResponse, loading: planLoading } = useFetch(
        shouldFetchUserPlan ? '/api/payments/current-plan' : null,
        {
            cache: true,
            cacheDuration: 5 * 60 * 1000, // Cache for 5 minutes
            onError: (error) => {
                console.warn('Could not fetch current plan:', error?.message);
            },
        }
    );

    // Create payment order mutation
    const { mutate: createOrder, loading: orderLoading } = useMutation('post', {
        onSuccess: (orderData) => {
            handlePayment(orderData);
        },
        onError: (error) => {
            alert('Failed to create order: ' + error.message);
            setProcessingPlan(null);
        },
    });

    const plans = plansResponse?.data || [];
    const userPlan = planResponse?.data?.currentPlan;

    const handlePlanClick = async (plan) => {
        if (plan.price === '$0') {
            alert('Free plan is already available to all users!');
            return;
        }

        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        setProcessingPlan(plan.name);

        try {
            const planId = plan.id;
            const interval = billingCycle === 'annually' ? 'ANNUAL' : 'MONTHLY';

            await createOrder(`/api/payments/order/${planId}`, { interval });
        } catch (error) {
            console.error('Error creating order:', error);
            setProcessingPlan(null);
        }
    };

    const handlePayment = (orderData) => {
        const options = {
            key: orderData.razorpayKey,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.orderId,
            name: 'Phyo Platform',
            description: orderData.description,
            handler: (response) => {
                console.log('Payment success:', response);
                // Verify payment
                verifyPayment(response);
            },
            theme: { color: '#10B981' },
            modal: {
                ondismiss: () => {
                    console.log('Payment cancelled');
                    setProcessingPlan(null);
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const verifyPayment = async (response) => {
        try {
            // Implement payment verification
            const result = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
            });

            const data = await result.json();
            if (data.success) {
                alert('Payment successful!');
                // Refresh page or redirect
                window.location.reload();
            }
        } catch (error) {
            console.error('Verification failed:', error);
            alert('Payment verification failed');
        } finally {
            setProcessingPlan(null);
        }
    };

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="heading-responsive mb-4">Simple, Transparent Pricing</h2>
                    <p className="body-responsive text-gray-600 mb-8">
                        Choose the perfect plan for your influencer marketing needs
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={billingCycle === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
                            className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300"
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                                    billingCycle === 'annually' ? 'translate-x-7' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className={billingCycle === 'annually' ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                            Annually <span className="text-green-600 text-sm font-semibold">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                {/* Loading State */}
                {plansLoading && (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading pricing plans...</p>
                        </div>
                    </div>
                )}

                {/* Plans Grid */}
                {!plansLoading && (
                    <div className="grid-3-responsive gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`card-responsive border-2 transition hover:shadow-lg ${
                                    plan.recommended
                                        ? 'border-green-500 bg-green-50 transform lg:scale-105'
                                        : 'border-gray-200'
                                }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold mb-2">{plan.displayName}</h3>
                                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                                <div className="mb-6">
                                    <div className="text-4xl font-bold text-gray-900">
                                        {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnually}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePlanClick(plan)}
                                    disabled={processingPlan === plan.name || orderLoading || planLoading}
                                    className={`w-full btn-responsive font-semibold rounded-lg transition mb-6 ${
                                        plan.recommended
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    } disabled:opacity-50`}
                                >
                                    {processingPlan === plan.name ? 'Processing...' : 'Choose Plan'}
                                </button>

                                <div className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <span className="text-green-600 font-bold">✓</span>
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {userPlan === plan.id && (
                                    <div className="mt-6 p-3 bg-blue-100 rounded-lg text-center">
                                        <p className="text-sm font-semibold text-blue-900">Your Current Plan</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ or CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-4">
                        Have questions? <a href="/help" className="text-green-600 font-semibold hover:underline">Contact our support team</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
