'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PauseCircleLine, PlayCircleLine, ArrowDownLine, CloseLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/ui/AppBar';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { usePayment } from '@/hooks';
import { colors } from '@/config/colors';

const SubscriptionDetails = ({ userPlan, loading }) => {
  if (!userPlan) {
    return (
      <Card variant="default" className="p-6 rounded-xl mb-6">
        <p style={{ color: colors.text.neutral.muted }}>No active subscription</p>
      </Card>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card variant="default" className="p-6 rounded-xl mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Plan Name and Price */}
        <div>
          <p className="text-sm" style={{ color: colors.text.neutral.muted }}>Current Plan</p>
          <p className="text-2xl font-bold" style={{ color: colors.text.neutral.base }}>
            {userPlan.planName || 'Premium'}
          </p>
          <p className="text-lg font-semibold mt-2" style={{ color: colors.brand.base }}>
            {userPlan.price || '₹499'}/{userPlan.billingCycle === 'ANNUAL' ? 'year' : 'month'}
          </p>
        </div>

        {/* Renewal Date */}
        <div>
          <p className="text-sm" style={{ color: colors.text.neutral.muted }}>Next Renewal</p>
          <p className="text-2xl font-bold" style={{ color: colors.text.neutral.base }}>
            {formatDate(userPlan.renewalDate)}
          </p>
          <p className="text-sm mt-2" style={{ color: colors.text.neutral.muted }}>
            Billing Cycle: {userPlan.billingCycle || 'MONTHLY'}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm" style={{ color: colors.text.neutral.muted }}>Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: userPlan.status === 'active' ? colors.status.success : colors.semantic.error.bold
              }}
            />
            <p className="font-semibold capitalize" style={{ color: colors.text.neutral.base }}>
              {userPlan.status || 'Active'}
            </p>
          </div>
        </div>

        {/* Next Billing Amount */}
        <div>
          <p className="text-sm" style={{ color: colors.text.neutral.muted }}>Next Billing Amount</p>
          <p className="text-2xl font-bold mt-2" style={{ color: colors.text.neutral.base }}>
            {userPlan.nextBillingAmount || userPlan.price || '₹499'}
          </p>
        </div>
      </div>
    </Card>
  );
};

const SubscriptionTimeline = () => {
  const timelineEvents = [
    {
      date: 'Mar 17, 2026',
      title: 'Subscription Started',
      description: 'Premium plan activated'
    },
    {
      date: 'Feb 17, 2026',
      title: 'Plan Upgraded',
      description: 'Upgraded from Basic to Premium'
    },
    {
      date: 'Jan 17, 2026',
      title: 'Subscription Renewed',
      description: 'Basic plan renewed for 1 month'
    }
  ];

  return (
    <Card variant="default" className="p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-6" style={{ color: colors.text.neutral.base }}>
        Subscription History
      </h3>
      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full mt-2"
                style={{ backgroundColor: colors.brand.base }}
              />
              {index < timelineEvents.length - 1 && (
                <div
                  className="w-0.5 h-12 mt-1"
                  style={{ backgroundColor: colors.neutral.muted }}
                />
              )}
            </div>

            {/* Event content */}
            <div className="pb-4">
              <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
                {event.date}
              </p>
              <p className="font-semibold" style={{ color: colors.text.neutral.base }}>
                {event.title}
              </p>
              <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default function SubscriptionManagementAll() {
  const router = useRouter();
  const {
    userPlan,
    loading,
    error,
    fetchUserPlan,
    cancelCurrentSubscription
  } = usePayment();

  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [subscriptionPaused, setSubscriptionPaused] = useState(false);

  const downgradeOptions = [
    { id: 'free', name: 'Free Plan', price: '₹0' },
    { id: 'basic', name: 'Basic Plan', price: '₹199' }
  ];

  // Fetch user plan on mount
  useEffect(() => {
    fetchUserPlan();
  }, [fetchUserPlan]);

  const handlePauseSubscription = async () => {
    try {
      setSubscriptionPaused(true);
      setShowPauseConfirm(false);
    } catch (err) {
      console.error('Failed to pause subscription:', err);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      setSubscriptionPaused(false);
    } catch (err) {
      console.error('Failed to resume subscription:', err);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelCurrentSubscription();
      setShowCancelConfirm(false);
      // Redirect to account page after cancellation
      setTimeout(() => router.push('/brand/account'), 1500);
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Subscription"
          onBack={() => router.push('/brand/account')}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8" style={{ color: colors.brand.base }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p style={{ color: colors.text.neutral.muted }}>Loading subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Subscription"
          onBack={() => router.push('/brand/account')}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-lg font-semibold mb-4" style={{ color: colors.semantic.error.bold }}>
            Error loading subscription
          </p>
          <p className="text-sm text-center mb-6" style={{ color: colors.text.neutral.muted }}>
            {error}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => fetchUserPlan()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
      <AppBar
        title="Subscription"
        onBack={() => router.push('/brand/account')}
      />

      {/* Subscription Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4">
        {/* Subscription Details Card */}
        <SubscriptionDetails userPlan={userPlan} loading={loading} />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {!subscriptionPaused ? (
            <>
              <Button
                variant="secondary"
                size="lg"
                icon={PauseCircleLine}
                onClick={() => setShowPauseConfirm(true)}
                fullWidth
              >
                Pause Subscription
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={ArrowDownLine}
                onClick={() => setShowDowngradeModal(true)}
                fullWidth
              >
                Downgrade Plan
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/brand/account/upgrade-plan')}
                fullWidth
              >
                Upgrade Plan
              </Button>
              <Button
                variant="outlined"
                size="lg"
                onClick={() => setShowCancelConfirm(true)}
                fullWidth
              >
                Cancel Subscription
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="lg"
              icon={PlayCircleLine}
              onClick={handleResumeSubscription}
              fullWidth
            >
              Resume Subscription
            </Button>
          )}
        </div>

        {/* Timeline */}
        <SubscriptionTimeline />
      </div>

      {/* Pause Confirmation Modal */}
      {showPauseConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPauseConfirm(false)}
        >
          <Card
            variant="default"
            className="w-full sm:w-[400px] sm:max-w-[90vw] md:max-w-[400px] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text.neutral.base }}>
                Pause Subscription?
              </h2>
              <p className="text-sm mb-6" style={{ color: colors.text.neutral.muted }}>
                Your subscription will be paused and you won't be charged. You can resume anytime.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setShowPauseConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handlePauseSubscription}
                >
                  Pause
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Downgrade Modal */}
      {showDowngradeModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDowngradeModal(false)}
        >
          <Card
            variant="default"
            className="w-full sm:w-[400px] sm:max-w-[90vw] md:max-w-[400px] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
                  Downgrade Plan
                </h2>
                <IconButton
                  icon={CloseLine}
                  size="sm"
                  variant="default"
                  onClick={() => setShowDowngradeModal(false)}
                />
              </div>

              <p className="text-sm mb-6" style={{ color: colors.text.neutral.muted }}>
                Select a plan to downgrade to:
              </p>

              <div className="space-y-3 mb-6">
                {downgradeOptions.map((option) => (
                  <button
                    key={option.id}
                    className="w-full p-4 rounded-lg border-2 text-left transition-all"
                    style={{
                      borderColor: colors.neutral.muted,
                      backgroundColor: colors.neutral.muted
                    }}
                    onClick={() => {
                      console.log('Downgrade to:', option.id);
                      setShowDowngradeModal(false);
                    }}
                  >
                    <p className="font-semibold" style={{ color: colors.text.neutral.base }}>
                      {option.name}
                    </p>
                    <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
                      {option.price}/month
                    </p>
                  </button>
                ))}
              </div>

              <p className="text-xs mb-4" style={{ color: colors.text.neutral.muted }}>
                Changes will take effect on your next billing date.
              </p>

              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => setShowDowngradeModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCancelConfirm(false)}
        >
          <Card
            variant="default"
            className="w-full sm:w-[400px] sm:max-w-[90vw] md:max-w-[400px] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text.neutral.base }}>
                Cancel Subscription?
              </h2>
              <p className="text-sm mb-6" style={{ color: colors.text.neutral.muted }}>
                We'd hate to see you go! Tell us why you're cancelling so we can improve.
              </p>

              {/* Reason Selection */}
              <div className="space-y-2 mb-6">
                {[
                  'Too expensive',
                  'Found a better alternative',
                  'Not using the features',
                  'Poor customer support',
                  'Other'
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg" style={{ backgroundColor: colors.neutral.muted }}>
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span style={{ color: colors.text.neutral.base }}>{reason}</span>
                  </label>
                ))}
              </div>

              {/* Feedback Text */}
              <textarea
                placeholder="Additional feedback (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 rounded-lg mb-6 text-sm"
                style={{
                  backgroundColor: colors.neutral.muted,
                  color: colors.text.neutral.base,
                  borderColor: colors.neutral.muted,
                  borderWidth: '1px'
                }}
                rows={4}
              />

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleCancelSubscription}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
