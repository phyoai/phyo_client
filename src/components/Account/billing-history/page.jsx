'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserLine, FileCopyLine, DownloadLine, MoreLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/ui/AppBar';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { colors } from '@/config/colors';
import apiClient from '@/utils/api';
import { useRoleContext } from '@/app/context/RoleContext';

export default function BillingHistoryAll() {
  const router = useRouter();
  const { role } = useRoleContext();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: null,
    dateFrom: null,
    dateTo: null,
    amountMin: null,
    amountMax: null
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch payment history from API
  const fetchPaymentHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/account/payments/history?page=${page}&limit=10`);
      setPaymentHistory(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setError('Failed to load payment history');
      setPaymentHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment history on mount and when page changes
  useEffect(() => {
    fetchPaymentHistory(currentPage);
  }, [currentPage]);

  // Format payment history for display
  const transactions = paymentHistory.map(payment => ({
    _id: payment._id,
    title: payment.description || payment.type,
    date: new Date(payment.createdAt).toLocaleString(),
    amount: payment.amount ? `${payment.type === 'credit' ? '+' : '-'}₹${payment.amount}` : '₹0',
    action: payment.status === 'failed' ? 'Retry Payment' : 'Download Invoice',
    status: payment.status,
    isNegative: payment.type !== 'credit'
  }));

  // Handle retry payment for failed transactions
  const handleRetryPayment = async (transactionId) => {
    try {
      // This would typically call verifyNewPayment with the transaction details
      console.log('Retrying payment for transaction:', transactionId);
      await verifyNewPayment('', '', '', '');
    } catch (err) {
      console.error('Retry payment failed:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Billing history"
          onBack={() => router.push('/brand/account')}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8" style={{ color: colors.brand.base }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p style={{ color: colors.text.neutral.muted }}>Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Billing history"
          onBack={() => router.push('/brand/account')}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-lg font-semibold mb-4" style={{ color: colors.semantic.error.bold }}>
            Error loading transactions
          </p>
          <p className="text-sm text-center mb-6" style={{ color: colors.text.neutral.muted }}>
            {error}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => fetchPaymentHistory(currentPage, 10)}
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
        title="Billing history"
        onBack={() => router.push('/brand/account')}
      />

      {/* Billing History Container */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4">
        <div className="flex flex-col h-full">
          {transactions.length === 0 ? (
            /* Empty State */
            <div className="flex items-center justify-center h-full">
              <p className="text-xl" style={{ color: colors.text.neutral.muted, fontFamily: 'Manrope, sans-serif' }}>
                no transactions created yet
              </p>
            </div>
          ) : (
            <>
              {/* Section Heading */}
              <div className="flex items-center justify-between pb-3 pt-6 px-4">
                <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base, fontFamily: 'Manrope, sans-serif' }}>
                  December 2025
                </h3>
              </div>

              {/* Transaction List */}
              <div className="flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
                {transactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center w-full relative">
                      {/* Leading Avatar */}
                      <div className="flex items-center px-4 py-1.5">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.brand.base }}>
                          <UserLine className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 flex flex-col justify-center pr-4 py-3">
                        <p className="text-base font-semibold truncate" style={{ color: colors.text.neutral.base, fontFamily: 'Work Sans, sans-serif' }}>
                          {transaction.title}
                        </p>
                        <p className="text-sm" style={{ color: colors.text.neutral.muted, fontFamily: 'Work Sans, sans-serif' }}>
                          {transaction.date}
                        </p>
                      </div>

                      {/* Trailing Amount */}
                      <div className="flex flex-col items-end justify-center pr-4 py-3">
                        <p className="text-base font-semibold" style={{ color: transaction.isNegative ? colors.semantic.error.bold : colors.text.neutral.base, fontFamily: 'Work Sans, sans-serif' }}>
                          {transaction.amount}
                        </p>
                        <p className="text-sm cursor-pointer hover:underline" style={{ color: colors.text.neutral.muted, fontFamily: 'Work Sans, sans-serif' }}>
                          {transaction.action}
                        </p>
                      </div>

                      {/* Three Dot Menu */}
                      <div className="relative">
                        <IconButton
                          icon={MoreLine}
                          size="md"
                          variant="default"
                          onClick={() => setOpenMenuId(openMenuId === transaction.id ? null : transaction.id)}
                          className="mr-2"
                        />

                        {/* Dropdown Menu */}
                        {openMenuId === transaction.id && (
                          <div className="absolute right-0 mt-1 w-48 rounded-lg shadow-lg z-10" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted, borderWidth: '1px' }}>
                            <button className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: colors.text.neutral.base, borderBottomColor: colors.neutral.muted, borderBottomWidth: '1px' }}>
                              <DownloadLine className="w-4 h-4" />
                              Download Invoice
                            </button>
                            <button className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: colors.text.neutral.base }}>
                              <FileCopyLine className="w-4 h-4" />
                              Copy Details
                            </button>
                            {transaction.status === 'failed' && (
                              <button
                                onClick={() => handleRetryPayment(transaction.id)}
                                className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors hover:opacity-80 border-t"
                                style={{ color: colors.brand.base, borderTopColor: colors.neutral.muted, borderTopWidth: '1px' }}
                              >
                                Retry Payment
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    {index < transactions.length - 1 && (
                      <div className="h-px w-full" style={{ backgroundColor: colors.neutral.muted }} />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {transactions.length > 0 && pagination && (
        <div className="sticky bottom-0 px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4 border-t flex items-center justify-between" style={{ backgroundColor: colors.neutral.base, borderColor: colors.neutral.muted }}>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              Previous
            </Button>
            <span style={{ color: colors.text.neutral.base }} className="px-2">
              Page {currentPage} of {pagination.totalPages || 1}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= (pagination.totalPages || 1)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
