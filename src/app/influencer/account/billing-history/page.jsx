'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft, MoreVertical, Copy, Download, AlertCircle } from 'lucide-react';
import { accountApi } from '@/api/account-api';

// Transaction Skeleton Loader
const TransactionSkeleton = () => (
  <div className="flex items-center w-full relative animate-pulse">
    <div className="flex items-center px-4 py-1.5">
      <div className="w-12 h-12 bg-gray-300 rounded-full" />
    </div>
    <div className="flex-1 flex flex-col justify-center pr-4 py-3 gap-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="flex flex-col items-end justify-center pr-4 py-3 gap-2">
      <div className="h-4 bg-gray-300 rounded w-24" />
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
  </div>
);

export default function BillingHistory() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Fetch transactions on mount and when page changes
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await accountApi.getTransactions({
          page,
          limit: 10
        });
        setTransactions(response.transactions);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page]);

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(transaction);
    return acc;
  }, {});

  const handleDownloadInvoice = (transactionId) => {
    // TODO: Implement invoice download
    console.log('Download invoice for transaction:', transactionId);
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Header/App Bar */}
      <div className="bg-white flex items-center justify-between px-1 py-2 border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.push('/influencer/account')}
          className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#242527]" />
        </button>

        <div className="flex-1 px-2">
          <h2 className="text-xl font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Billing history
          </h2>
        </div>
      </div>

      {/* Billing History Container */}
      <div className="flex-1 overflow-y-auto px-9 py-4">
        <div className="flex flex-col h-full">
          {/* Error State */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Content */}
          {!loading && transactions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                no transactions created yet
              </p>
            </div>
          ) : !loading && transactions.length > 0 ? (
            <>
              {Object.entries(groupedTransactions).map(([monthYear, monthTransactions]) => (
                <div key={monthYear}>
                  <div className="flex items-center justify-between pb-3 pt-6 px-4">
                    <h3 className="text-lg font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {monthYear}
                    </h3>
                  </div>

                  <div className="bg-white flex flex-col">
                    {monthTransactions.map((transaction, index) => (
                      <div key={transaction.id}>
                        <div className="flex items-center w-full relative">
                          {/* Leading Avatar */}
                          <div className="flex items-center px-4 py-1.5">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 flex flex-col justify-center pr-4 py-3">
                            <p className="text-base font-semibold text-[#242527] truncate" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                              {transaction.description || transaction.type}
                            </p>
                            <p className="text-sm text-[#808080]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                              {new Date(transaction.date).toLocaleString()}
                            </p>
                          </div>

                          {/* Trailing Amount */}
                          <div className="flex flex-col items-end justify-center pr-4 py-3">
                            <p
                              className={`text-base font-semibold ${
                                transaction.type === 'debit' ? 'text-red-600' : 'text-[#242527]'
                              }`}
                              style={{ fontFamily: 'Work Sans, sans-serif' }}
                            >
                              {transaction.type === 'debit' ? '-' : '+'}{transaction.currency} {transaction.amount}
                            </p>
                            <p className="text-sm text-[#808080]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                              {transaction.status}
                            </p>
                          </div>

                          {/* Three Dot Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === transaction.id ? null : transaction.id)}
                              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors mr-2"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === transaction.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => {
                                    handleDownloadInvoice(transaction.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2 border-b border-gray-100"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Invoice
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(transaction.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Transaction ID
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Divider */}
                        {index < monthTransactions.length - 1 && (
                          <div className="h-px bg-gray-200 w-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6 pb-4">
                  <button
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
