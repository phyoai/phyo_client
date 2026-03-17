'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/ui/AppBar';
import { useRoleContext } from '@/app/context/RoleContext';

const TransactionsPage = () => {
  const router = useRouter();
  const { role } = useRoleContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock transactions data
    const mockTransactions = [
      {
        id: 1,
        date: '2024-03-15',
        type: 'Subscription',
        description: 'Monthly subscription - Silver Plan',
        amount: '₹1,900',
        status: 'Success',
        statusColor: 'text-green-600'
      },
      {
        id: 2,
        date: '2024-02-15',
        type: 'Subscription',
        description: 'Monthly subscription - Silver Plan',
        amount: '₹1,900',
        status: 'Success',
        statusColor: 'text-green-600'
      },
      {
        id: 3,
        date: '2024-01-15',
        type: 'Subscription',
        description: 'Monthly subscription - Basic Plan',
        amount: '₹199',
        status: 'Success',
        statusColor: 'text-green-600'
      },
      {
        id: 4,
        date: '2023-12-20',
        type: 'Refund',
        description: 'Plan cancellation refund',
        amount: '₹-199',
        status: 'Success',
        statusColor: 'text-green-600'
      },
      {
        id: 5,
        date: '2023-12-15',
        type: 'Subscription',
        description: 'Monthly subscription - Basic Plan',
        amount: '₹199',
        status: 'Failed',
        statusColor: 'text-red-600'
      },
    ];

    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-[#121212]">
      <AppBar
        title="Transactions"
        onBack={() => router.push(`/${role}/account`)}
      />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {transactions.length} transactions
              </span>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {transaction.type}
                      </h3>
                      <span className={`font-bold ${transaction.statusColor}`}>
                        {transaction.amount}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {transaction.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {transaction.date}
                      </span>
                      <span className={`text-xs font-medium ${transaction.statusColor}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
