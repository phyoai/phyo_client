'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine, MoreLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/ui/AppBar';
import { useRoleContext } from '@/app/context/RoleContext';

const TransactionsPage = () => {
  const router = useRouter();
  const { role } = useRoleContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock transactions data grouped by month
    const mockTransactions = [
      {
        id: 1,
        date: '2026-07-20',
        time: '9:30 AM',
        month: 'December 2025',
        type: 'Payment Failed',
        amount: '-₹499',
        amountColor: 'text-red-600',
        action: 'Retry Payment',
        icon: 'bg-blue-600'
      },
      {
        id: 2,
        date: '2026-07-20',
        time: '10:15 AM',
        month: 'December 2025',
        type: 'Payment Successful',
        amount: '+₹499',
        amountColor: 'text-green-600',
        action: 'View Receipt',
        icon: 'bg-blue-600'
      },
      {
        id: 3,
        date: '2026-07-20',
        time: '11:00 AM',
        month: 'December 2025',
        type: 'Payment Pending',
        amount: '₹0',
        amountColor: 'text-yellow-600',
        action: 'Check Status',
        icon: 'bg-blue-600'
      },
      {
        id: 4,
        date: '2026-07-20',
        time: '11:45 AM',
        month: 'December 2025',
        type: 'Payment Declined',
        amount: '-₹499',
        amountColor: 'text-red-600',
        action: 'Contact Support',
        icon: 'bg-blue-600'
      },
      {
        id: 5,
        date: '2026-07-20',
        time: '12:30 PM',
        month: 'December 2025',
        type: 'Refund Processed',
        amount: '+₹499',
        amountColor: 'text-green-600',
        action: 'View Refund Details',
        icon: 'bg-blue-600'
      },
    ];

    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

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
                      key={transaction.id}
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
