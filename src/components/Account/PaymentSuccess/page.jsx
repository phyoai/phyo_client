'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRoleContext } from '@/app/context/RoleContext';
import api from '@/utils/api';
import { userAPI } from '@/utils/api';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useRoleContext();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        setLoading(true);

        let subscriptionId = searchParams.get('subscription_id')
          || searchParams.get('sub_id')
          || sessionStorage.getItem('subscription_id');

        if (!subscriptionId) {
          throw new Error('No subscription ID found. Please try again.');
        }

        const subscriptionResponse = await api.get(`/payment/razorpay/subscriptions/${subscriptionId}`);
        const subscriptionData = subscriptionResponse.data?.data || subscriptionResponse.data;

        if (subscriptionData) {
          const userResponse = await userAPI.getUserProfile();
          const userData = userResponse.data || userResponse.user || userResponse;

          const isSubscriptionValid =
            userData?.subscriptionStatus === 'active' ||
            userData?.subscriptionStatus === 'halted' ||
            subscriptionData?.status === 'active' ||
            subscriptionData?.status === 'halted';

          if (isSubscriptionValid) {
            setSuccess(true);
            sessionStorage.removeItem('subscription_id');
            setTimeout(() => { router.push(`/${role}/account`); }, 3000);
          } else {
            throw new Error('Subscription verification pending. Your plan will be activated shortly.');
          }
        } else {
          throw new Error('Failed to verify subscription');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err?.response?.data?.message || err?.message || 'Payment verification failed. Please contact support or try again.');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, router, role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#272626] border-t-[#16a34a] rounded-full animate-spin" />
          <p className="text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <div className="w-[120px] h-[120px] rounded-full bg-red-500/20 flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="#ef4444" />
              <path d="M30 18V30M30 36V38" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-[32px] font-semibold text-white text-center" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Payment Failed
          </h1>
          <p className="text-[16px] text-[#9b9b9b] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => router.push(`/${role}/account/upgrade-plan`)}
              className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white px-[32px] h-[44px] rounded-full text-[16px] font-normal capitalize transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push(`/${role}/account`)}
              className="flex-1 border border-white text-white px-[32px] h-[44px] rounded-full text-[16px] font-normal capitalize hover:bg-white/10 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center p-5">
        <div className="w-full max-w-[547px] rounded-[24px] bg-[linear-gradient(180deg,#16a34a_0%,#083d1b_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="flex flex-col items-center gap-[32px] px-10 py-10 text-center">
            <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="100" fill="white" fillOpacity="0.15"/>
              <circle cx="100" cy="100" r="67" fill="white" fillOpacity="0.2"/>
              <path d="M60 100L85 125L140 70" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col gap-[8px]">
              <h1 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Payment successful
              </h1>
              <p className="text-[16px] leading-[1.6] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your plan has been updated and all features are now unlocked.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
