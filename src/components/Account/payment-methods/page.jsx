'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreLine, DeleteLine, EditLine, PlusLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/ui/AppBar';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { usePayment } from '@/hooks';
import { colors } from '@/config/colors';

const PaymentMethodCard = ({ method, isDefault, onSetDefault, onEdit, onDelete, loading }) => {
  const getCardType = (type) => {
    const typeMap = {
      'visa': 'Visa',
      'mastercard': 'Mastercard',
      'amex': 'American Express',
      'upi': 'UPI'
    };
    return typeMap[type?.toLowerCase()] || type;
  };

  const getCardIcon = (type) => {
    const icons = {
      'visa': '💳',
      'mastercard': '💳',
      'amex': '💳',
      'upi': '📱'
    };
    return icons[type?.toLowerCase()] || '💳';
  };

  return (
    <Card
      variant="default"
      className="mb-4 p-4 rounded-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-3xl">{getCardIcon(method.type)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold" style={{ color: colors.text.neutral.base }}>
                {getCardType(method.type)} •••• {method.lastFourDigits || method.last4}
              </p>
              {isDefault && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: colors.accent.subtle, color: colors.brand.base }}
                >
                  Default
                </span>
              )}
            </div>
            {method.expiryDate && (
              <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
                Expires: {method.expiryDate}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isDefault && (
            <Button
              variant="tertiary"
              size="sm"
              onClick={onSetDefault}
              disabled={loading}
            >
              Set Default
            </Button>
          )}
          <IconButton
            icon={EditLine}
            size="md"
            variant="default"
            onClick={onEdit}
          />
          <IconButton
            icon={DeleteLine}
            size="md"
            variant="default"
            onClick={onDelete}
          />
        </div>
      </div>
    </Card>
  );
};

export default function PaymentMethodsAll() {
  const router = useRouter();
  const { loading, error } = usePayment();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [defaultMethodId, setDefaultMethodId] = useState(null);

  // Mock payment methods data
  const mockPaymentMethods = [
    {
      id: 1,
      type: 'visa',
      lastFourDigits: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      lastFourDigits: '5555',
      expiryDate: '08/26',
      isDefault: false
    },
    {
      id: 3,
      type: 'upi',
      lastFourDigits: '9876',
      expiryDate: null,
      isDefault: false
    }
  ];

  useEffect(() => {
    // Load payment methods from Redux or use mock data
    setPaymentMethods(mockPaymentMethods);
    setDefaultMethodId(mockPaymentMethods.find(m => m.isDefault)?.id || null);
  }, []);

  const handleSetDefault = (methodId) => {
    setPaymentMethods(prevMethods =>
      prevMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
    setDefaultMethodId(methodId);
  };

  const handleDeleteMethod = (methodId) => {
    setPaymentMethods(prevMethods =>
      prevMethods.filter(method => method.id !== methodId)
    );
    setShowDeleteConfirm(null);
  };

  const handleAddPaymentMethod = () => {
    // This would typically open a Razorpay modal
    console.log('Opening Razorpay payment method modal');
    setShowAddModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Payment Methods"
          onBack={() => router.push('/brand/account')}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8" style={{ color: colors.brand.base }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p style={{ color: colors.text.neutral.muted }}>Loading payment methods...</p>
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
          title="Payment Methods"
          onBack={() => router.push('/brand/account')}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-lg font-semibold mb-4" style={{ color: colors.semantic.error.bold }}>
            Error loading payment methods
          </p>
          <p className="text-sm text-center mb-6" style={{ color: colors.text.neutral.muted }}>
            {error}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.reload()}
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
        title="Payment Methods"
        onBack={() => router.push('/brand/account')}
      />

      {/* Payment Methods Container */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4">
        {paymentMethods.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="text-6xl">💳</div>
            <div className="text-center">
              <p className="text-xl font-semibold mb-2" style={{ color: colors.text.neutral.base }}>
                No payment methods saved
              </p>
              <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
                Add a payment method to complete purchases
              </p>
            </div>
          </div>
        ) : (
          /* Payment Methods List */
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text.neutral.base }}>
                Saved Payment Methods
              </h2>
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  isDefault={defaultMethodId === method.id}
                  onSetDefault={() => handleSetDefault(method.id)}
                  onEdit={() => console.log('Edit payment method:', method.id)}
                  onDelete={() => setShowDeleteConfirm(method.id)}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Payment Method Button */}
      <div className="sticky bottom-0 px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4 border-t flex justify-center gap-3" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted }}>
        <Button
          variant="primary"
          size="lg"
          icon={PlusLine}
          onClick={() => setShowAddModal(true)}
        >
          Add Payment Method
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <Card
            variant="default"
            className="w-full sm:w-[400px] sm:max-w-[90vw] md:max-w-[400px] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text.neutral.base }}>
                Delete Payment Method?
              </h2>
              <p className="text-sm mb-6" style={{ color: colors.text.neutral.muted }}>
                This action cannot be undone. Your payment method will be permanently removed.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => handleDeleteMethod(showDeleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <Card
            variant="default"
            className="w-full sm:w-[400px] sm:max-w-[90vw] md:max-w-[400px] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6" style={{ color: colors.text.neutral.base }}>
                Add Payment Method
              </h2>
              <p className="text-sm mb-6" style={{ color: colors.text.neutral.muted }}>
                Secure payment methods powered by Razorpay. Your payment information is encrypted and secure.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddPaymentMethod}
                >
                  Open Payment Gateway
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowAddModal(false)}
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
