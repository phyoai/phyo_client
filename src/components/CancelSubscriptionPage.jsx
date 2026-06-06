'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { userAPI } from '@/utils/api';
import api from '@/utils/api';
import { accountApi } from '@/api/account-api';

function getAccountBasePath(pathname) {
  if (pathname?.startsWith('/brand/account')) return '/brand/account';
  if (pathname?.startsWith('/influencer/account')) return '/influencer/account';
  if (pathname?.startsWith('/user/account')) return '/user/account';
  return '/account';
}

function getRedirectBasePath(userType, fallback) {
  const type = String(userType || '').toLowerCase();
  if (type === 'brand') return '/brand/account';
  if (type === 'influencer') return '/influencer/account';
  if (type === 'user') return '/user/account';
  return fallback;
}

function getMode(pathname) {
  if (pathname?.includes('/pause')) return 'pause';
  if (pathname?.includes('/cancel')) return 'cancel';
  return 'cancel';
}

export default function CancelSubscriptionPage() {
  const router = useRouter();
  const pathname = usePathname();
  const accountBasePath = useMemo(() => getAccountBasePath(pathname), [pathname]);
  const mode = useMemo(() => getMode(pathname), [pathname]);

  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserAndSubscription();
  }, []);

  const fetchUserAndSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const userResponse = await userAPI.getUserProfile();
      const userData = userResponse.data || userResponse.user || userResponse;
      setUser(userData);

      const subscriptions = await accountApi.getRazorpaySubscriptions();
      const activeOrFirst =
        subscriptions.find((sub) => sub?.status === 'active' || sub?.status === 'halted' || sub?.status === 'paused') ||
        subscriptions[0];

      if (!activeOrFirst) {
        setError('No active subscription found');
        return;
      }

      setSubscription(activeOrFirst);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err?.message || 'Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.id) return;

    try {
      setCancelling(true);
      setError(null);
      await api.post(`/payment/razorpay/subscriptions/${subscription.id}/cancel`);
      setTimeout(() => {
        router.push(getRedirectBasePath(user?.type, accountBasePath));
      }, 900);
    } catch (err) {
      setError(err?.message || 'Failed to cancel subscription');
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#272626] border-t-[#16a34a] rounded-full animate-spin" />
          <p className="text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center p-5">
        <div className="bg-[#181818] rounded-[24px] p-10 text-center max-w-md">
          <p className="text-[#9b9b9b] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>No active subscription found</p>
          <button
            onClick={() => router.push(accountBasePath)}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white px-8 py-3 rounded-full font-medium transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Back to Account
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = subscription.status === 'cancelled';
  const title = mode === 'pause' ? 'Pause Subscription' : 'Cancel Subscription';
  const subtitle =
    mode === 'pause'
      ? 'Temporarily pause your subscription and resume whenever you need.'
      : "This action cannot be undone. You'll immediately lose access to all premium features.";
  const secondaryLabel = mode === 'pause' ? 'Cancel' : 'Keep Subscription';
  const confirmedLabel = mode === 'pause' ? 'Pause' : 'Remove Subscription';
  const gradientClass = 'bg-[linear-gradient(180deg,#16a34a_0%,#063618_100%)]';

  return (
    <div className="min-h-screen bg-[#000201] text-white flex items-center justify-center p-5">
      {error && (
        <div className="fixed top-5 left-5 right-5 z-40 rounded-[16px] border border-red-500 bg-red-500/20 p-4">
          <p className="text-sm text-red-400" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
        </div>
      )}

      <div className={`w-full max-w-[400px] overflow-hidden rounded-[24px] border border-[#1f6f3c] ${gradientClass} shadow-[0_24px_80px_rgba(0,0,0,0.45)]`}>
        <div className="px-5 py-10 text-center">
          {isCancelled ? (
            <>
              <h3 className="mb-1 text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Subscription Cancelled
              </h3>
              <p className="mb-8 text-[16px] leading-[1.6] text-[#e3e3e3]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your subscription has already been cancelled.
              </p>
              <button
                onClick={() => router.push(accountBasePath)}
                className="h-[36px] rounded-full border border-white px-8 text-[12px] font-medium text-white transition-colors hover:bg-white/10"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Go Back
              </button>
            </>
          ) : (
            <>
              <h3 className="mb-1 text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {title}
              </h3>
              <p className="mb-8 text-[16px] leading-[1.6] text-[#e3e3e3]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {subtitle}
              </p>
              <div className="flex gap-5">
                <button
                  onClick={() => router.push(accountBasePath)}
                  className="flex-1 h-[36px] rounded-full border border-white text-[12px] font-medium text-white transition-colors hover:bg-white/10"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {secondaryLabel}
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="flex-1 h-[36px] rounded-full bg-white text-[12px] font-medium text-[#16a34a] transition-colors hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {cancelling ? `${confirmedLabel}ing...` : confirmedLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
