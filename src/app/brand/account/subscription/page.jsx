'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { accountApi } from '@/api/account-api';

function CheckIcon({ color = '#9b9b9b' }) {
  return (
    <svg width="21" height="12" viewBox="0 0 21 12" fill="none" className="flex-shrink-0">
      <path d="M1.5 6L7.5 11L19.5 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const timestamp = typeof dateString === 'number' ? dateString * 1000 : dateString;
  return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getStatusColor(status) {
  const statusMap = {
    active: { bg: '#16a34a', text: 'Active', light: '#d1fae5' },
    paused: { bg: '#f59e0b', text: 'Paused', light: '#fef3c7' },
    halted: { bg: '#f59e0b', text: 'Paused', light: '#fef3c7' },
    cancelled: { bg: '#ef4444', text: 'Cancelled', light: '#fee2e2' },
  };
  return statusMap[status?.toLowerCase()] || { bg: '#6b7280', text: 'Inactive', light: '#f3f4f6' };
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const subscriptions = await accountApi.getRazorpaySubscriptions();
      const activeOrFirst = subscriptions.find(sub => sub?.status === 'active' || sub?.status === 'halted') || subscriptions[0];

      if (!activeOrFirst) {
        setError('No active subscription found');
        setLoading(false);
        return;
      }

      setSubscription(activeOrFirst);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err?.message || 'Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const updated = await accountApi.pauseSubscription(subscription.id, 'now');
      setSubscription(updated);
      setShowPauseModal(false);
      setPauseReason('');
    } catch (err) {
      setError(err?.message || 'Failed to pause subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const updated = await accountApi.resumeSubscription(subscription.id);
      setSubscription(updated);
    } catch (err) {
      setError(err?.message || 'Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await api.post(`/payment/razorpay/subscriptions/${subscription.id}/cancel`);
      setSubscription(prev => ({ ...prev, status: 'cancelled' }));
      setShowCancelModal(false);
      setCancelReason('');
    } catch (err) {
      setError(err?.message || 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000201] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#272626] border-t-[#16a34a] rounded-full animate-spin" />
          <p className="text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading subscription...</p>
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
            onClick={() => router.push('/brand/account/upgrade-plan')}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white px-8 py-3 rounded-full font-medium transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Browse Plans
          </button>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(subscription.status);
  const isActive = subscription.status === 'active';
  const isPaused = subscription.status === 'paused' || subscription.status === 'halted';
  const isCancelled = subscription.status === 'cancelled';

  return (
    <div className="min-h-screen bg-[#000201] text-white p-5 pb-[150px]">
      {/* Header */}
      <div className="mb-[32px]">
        <h1 className="text-[32px] font-semibold leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Subscription Management
        </h1>
        <p className="text-[#9b9b9b] mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Manage your current plan and billing preferences
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-[16px] p-4 mb-6">
          <p className="text-red-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
        </div>
      )}

      {/* Subscription Card */}
      <div className="max-w-[600px] mx-auto bg-[#272626] rounded-[24px] overflow-hidden mb-6">
        <div className="p-[32px]">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-[24px]">
            <span
              className="text-[14px] font-semibold text-[#9b9b9b] uppercase tracking-wider"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Current Plan
            </span>
            <div
              className="px-[12px] py-[6px] rounded-full border-2"
              style={{ backgroundColor: `${statusColor.bg}20`, borderColor: statusColor.bg }}
            >
              <span className="text-[12px] font-semibold capitalize" style={{ color: statusColor.bg, fontFamily: 'Inter, sans-serif' }}>
                {statusColor.text}
              </span>
            </div>
          </div>

          {/* Plan Name & Price */}
          <div className="mb-[24px]">
            <p
              className="text-[48px] font-semibold leading-[1.2] capitalize mb-[8px]"
              style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              {subscription.plan_id || 'Standard Plan'}
            </p>
            <p className="text-[#9b9b9b] text-[18px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              ₹{subscription.amount ? (subscription.amount / 100).toLocaleString('en-IN') : '—'}/month
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mb-[24px]" />

          {/* Subscription Details */}
          <div className="grid grid-cols-2 gap-[24px] mb-[32px]">
            <div>
              <p className="text-[#9b9b9b] text-[14px] mb-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Start Date</p>
              <p className="text-[16px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {formatDate(subscription.current_start)}
              </p>
            </div>
            <div>
              <p className="text-[#9b9b9b] text-[14px] mb-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Next Charge</p>
              <p className="text-[16px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {formatDate(subscription.charge_at)}
              </p>
            </div>
            <div>
              <p className="text-[#9b9b9b] text-[14px] mb-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Paid Cycles</p>
              <p className="text-[16px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {subscription.paid_count || 0}/{subscription.total_count || 0}
              </p>
            </div>
            <div>
              <p className="text-[#9b9b9b] text-[14px] mb-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Remaining</p>
              <p className="text-[16px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {subscription.remaining_count || 0} cycles
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-[12px]">
            {isActive && (
              <>
                <button
                  onClick={() => setShowPauseModal(true)}
                  className="w-full h-[48px] border-2 border-[#f59e0b] text-[#f59e0b] rounded-full text-[16px] font-semibold hover:bg-[#f59e0b]/10 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  ⏸ Pause Subscription
                </button>
                <button
                  onClick={() => router.push('/brand/account/upgrade-plan')}
                  className="w-full h-[48px] border-2 border-[#16a34a] text-[#16a34a] rounded-full text-[16px] font-semibold hover:bg-[#16a34a]/10 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Upgrade Plan
                </button>
              </>
            )}

            {isPaused && (
              <button
                onClick={handleResumeSubscription}
                disabled={actionLoading}
                className="w-full h-[48px] bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full text-[16px] font-semibold transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {actionLoading ? '▶ Resuming…' : '▶ Resume Subscription'}
              </button>
            )}

            <button
              onClick={() => setShowCancelModal(true)}
              disabled={isCancelled}
              className="w-full h-[48px] border-2 border-[#ef4444] text-[#ef4444] rounded-full text-[16px] font-semibold hover:bg-[#ef4444]/10 transition-colors disabled:opacity-40"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000201]/95 backdrop-blur border-t border-white/5 p-5 flex justify-end gap-4">
        <button
          onClick={() => router.push('/brand/account')}
          className="border border-white h-[44px] px-[32px] rounded-full text-[16px] font-normal text-white hover:bg-white/10 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Back
        </button>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-[#181818] rounded-[24px] border border-[#333] p-8 max-w-md w-full">
            <h3 className="text-[24px] font-semibold text-white mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Pause Subscription?
            </h3>
            <p className="text-[#9b9b9b] text-[16px] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              You'll temporarily lose access to premium features. You can resume anytime.
            </p>
            <textarea
              value={pauseReason}
              onChange={e => setPauseReason(e.target.value)}
              placeholder="Tell us why (optional)..."
              className="w-full bg-[#262626] border border-[#333] rounded-[12px] p-3 text-[14px] text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#16a34a] mb-6 resize-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 h-[44px] border border-[#333] text-white rounded-full hover:bg-white/5 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handlePauseSubscription}
                disabled={actionLoading}
                className="flex-1 h-[44px] bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-full font-semibold transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {actionLoading ? 'Pausing…' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-[#181818] rounded-[24px] border border-[#333] p-8 max-w-md w-full">
            <h3 className="text-[24px] font-semibold text-white mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Cancel Subscription?
            </h3>
            <p className="text-[#9b9b9b] text-[16px] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              This action cannot be undone. You'll immediately lose access to all premium features.
            </p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Tell us why (optional)..."
              className="w-full bg-[#262626] border border-[#333] rounded-[12px] p-3 text-[14px] text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#ef4444] mb-6 resize-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 h-[44px] border border-[#333] text-white rounded-full hover:bg-white/5 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading}
                className="flex-1 h-[44px] bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full font-semibold transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {actionLoading ? 'Cancelling…' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
