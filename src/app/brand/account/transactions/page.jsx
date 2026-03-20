'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine, MoreLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/ui/AppBar';
import { useRoleContext } from '@/app/context/RoleContext';
import apiClient from '@/utils/api';

const TransactionsPage = () => {
  const router = useRouter();
  const { role } = useRoleContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/account/transactions?page=${page}&limit=20`);
      const data = response.data.data || [];

      // Format transactions for display
      const formattedTransactions = data.map(transaction => ({
        _id: transaction._id,
        date: new Date(transaction.createdAt).toLocaleDateString(),
        time: new Date(transaction.createdAt).toLocaleTimeString(),
        month: new Date(transaction.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
        amount: transaction.type.includes('debit') || transaction.type === 'payment' ? `-₹${transaction.amount}` : `+₹${transaction.amount}`,
        amountColor: transaction.type.includes('debit') || transaction.type === 'payment' ? 'text-red-600' : 'text-green-600',
        status: transaction.status,
        action: transaction.status === 'pending' ? 'Check Status' : transaction.status === 'failed' ? 'Retry Payment' : 'View Receipt',
        icon: 'bg-blue-600'
      }));

      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Group transactions by month
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const month = transaction.month;
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(transaction);
    return groups;
  }, {});

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-[#121212]">
      <AppBar
        title="Billing history"
        onBack={() => router.push(`/${role}/account`)}
      />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
              <div key={month}>
                {/* Month Header */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-2">
                  {month}
                </h3>

                {/* Transactions List */}
                <div className="space-y-4">
                  {monthTransactions.map((transaction) => (
                    <div
                      key={transaction._id || transaction.date + transaction.time}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      {/* Avatar & Details */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full ${transaction.icon} flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {transaction.type}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {transaction.time} {transaction.date}
                          </p>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className={`font-bold text-sm ${transaction.amountColor} flex-shrink-0 px-4`}>
                        {transaction.amount}
                      </div>

                      {/* Action & Menu */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap">
                          {transaction.action}
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <MoreLine size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
