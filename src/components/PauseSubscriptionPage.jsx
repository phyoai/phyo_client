'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { userAPI } from '@/utils/api';
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

export default function PauseSubscriptionPage() {
  const router = useRouter();
  const pathname = usePathname();
  const accountBasePath = useMemo(() => getAccountBasePath(pathname), [pathname]);

  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pausing, setPausing] = useState(false);
  const [resuming, setResuming] = useState(false);
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
      const activeOrFirst = subscriptions.find((sub) => sub?.status === 'active' || sub?.status === 'halted') || subscriptions[0];

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

  const redirectAfterAction = () => {
    router.push(getRedirectBasePath(user?.type, accountBasePath));
  };

  const handlePauseSubscription = async () => {
    if (!subscription?.id) return;

    try {
      setPausing(true);
      setError(null);
      await accountApi.pauseSubscription(subscription.id, 'now');
      setTimeout(redirectAfterAction, 900);
    } catch (err) {
      setError(err?.message || 'Failed to pause subscription');
      setPausing(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (!subscription?.id) return;

    try {
      setResuming(true);
      setError(null);
      await accountApi.resumeSubscription(subscription.id);
      setTimeout(redirectAfterAction, 900);
    } catch (err) {
      setError(err?.message || 'Failed to resume subscription');
      setResuming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#272626] border-t-[#16a34a] animate-spin" />
          <p className="text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-[24px] border border-[#2a2a2a] bg-[#181818] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="mb-6 text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>No active subscription found</p>
          <button
            onClick={() => router.push(accountBasePath)}
            className="h-[44px] rounded-full bg-[#16a34a] px-8 font-medium text-white transition-colors hover:bg-[#15803d]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Back to Account
          </button>
        </div>
      </div>
    );
  }

  const isActive = subscription.status === 'active';
  const isPaused = subscription.status === 'paused' || subscription.status === 'halted';

  return (
    <div className="min-h-screen bg-[#000201] text-white flex items-center justify-center p-5">
      {error && (
        <div className="fixed top-5 left-5 right-5 z-40 rounded-[16px] border border-red-500 bg-red-500/20 p-4">
          <p className="text-sm text-red-400" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
        </div>
      )}

      <div className="w-full max-w-[560px] overflow-hidden rounded-[32px] bg-[#16a34a] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="px-8 py-10 text-center">
          {isActive ? (
            <>
              <h2 className="mb-3 text-[28px] font-semibold text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Pause Subscription
              </h2>
              <p className="mx-auto mb-8 max-w-[370px] text-[16px] leading-[1.6] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                Temporarily pause your subscription and resume anytime.
              </p>
              <button
                onClick={handlePauseSubscription}
                disabled={pausing}
                className="h-[44px] min-w-[240px] rounded-full bg-white px-8 text-[14px] font-medium text-[#16a34a] transition-colors hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {pausing ? 'Pausing...' : 'Pause Subscription'}
              </button>
            </>
          ) : isPaused ? (
            <>
              <h2 className="mb-3 text-[28px] font-semibold text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Subscription Paused
              </h2>
              <p className="mx-auto mb-8 max-w-[370px] text-[16px] leading-[1.6] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your subscription is currently paused. You can resume it anytime.
              </p>
              <button
                onClick={handleResumeSubscription}
                disabled={resuming}
                className="h-[44px] min-w-[240px] rounded-full bg-white px-8 text-[14px] font-medium text-[#16a34a] transition-colors hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {resuming ? 'Resuming...' : 'Resume Subscription'}
              </button>
            </>
          ) : (
            <>
              <h2 className="mb-3 text-[28px] font-semibold text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Subscription Status
              </h2>
              <p className="mx-auto mb-8 max-w-[370px] text-[16px] leading-[1.6] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your subscription is not active right now.
              </p>
              <button
                onClick={() => router.push(accountBasePath)}
                className="h-[44px] min-w-[240px] rounded-full border border-white/90 px-8 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Back to Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
