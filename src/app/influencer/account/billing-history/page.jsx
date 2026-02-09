'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft, MoreVertical } from 'lucide-react';

export default function BillingHistory() {
  const router = useRouter();

  // Billing History data
  const billingHistory = [
    {
      id: 1,
      title: 'Cancelled Free Trial',
      date: '3:45 PM 05-01-2026',
      amount: '+₹0',
      action: 'Download Invoice'
    },
    {
      id: 2,
      title: 'Payment Failed',
      date: '9:30 AM 07-20-2026',
      amount: '-₹499',
      action: 'Retry Payment',
      isNegative: true
    },
    {
      id: 3,
      title: 'Cancelled Free Trial',
      date: '3:45 PM 05-01-2026',
      amount: '+₹0',
      action: 'Download Invoice'
    },
    {
      id: 4,
      title: 'Subscription Upgrade',
      date: '11:00 AM 08-30-2026',
      amount: '+₹999',
      action: 'Download Receipt'
    },
    {
      id: 5,
      title: 'Renewed Subscription',
      date: '1:15 PM 06-15-2026',
      amount: '+₹499',
      action: 'View Invoice'
    }
  ];

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Header/App Bar */}
      <div className="bg-white flex items-center justify-between px-1 py-2 border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.push('/brand/account')}
          className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#242527]" />
        </button>
        
        <div className="flex-1 px-2">
          <h2 className="text-xl font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            My Lists
          </h2>
        </div>
        
        <button className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-[#242527]" />
        </button>
      </div>

      {/* Billing History Container */}
      <div className="flex-1 overflow-y-auto px-9 py-4">
        <div className="flex flex-col h-full">
          {/* Section Heading */}
          <div className="flex items-center justify-between pb-3 pt-6 px-4">
            <h3 className="text-lg font-semibold text-[#242527]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              December 2025
            </h3>
          </div>

          {/* Transaction List */}
          <div className="bg-white flex flex-col">
            {billingHistory.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center w-full">
                  {/* Leading Avatar */}
                  <div className="flex items-center px-4 py-1.5">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-center pr-4 py-3">
                    <p className="text-base font-semibold text-[#242527] truncate" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      {transaction.title}
                    </p>
                    <p className="text-sm text-[#808080]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      {transaction.date}
                    </p>
                  </div>

                  {/* Trailing Amount */}
                  <div className="flex flex-col items-end justify-center pr-4 py-3">
                    <p className={`text-base font-semibold ${transaction.isNegative ? 'text-red-600' : 'text-[#242527]'}`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      {transaction.amount}
                    </p>
                    <p className="text-sm text-[#808080] cursor-pointer hover:underline" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      {transaction.action}
                    </p>
                  </div>
                </div>
                
                {/* Divider */}
                {index < billingHistory.length - 1 && (
                  <div className="h-px bg-gray-200 w-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
