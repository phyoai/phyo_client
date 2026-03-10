'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserLine, FileCopyLine, DownloadLine, MoreLine } from '@phyoofficial/phyo-icon-library';
import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { colors } from '@/config/colors';

export default function BillingHistoryAll() {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState(null);

  // Billing History data
  const billingHistory = [
    {
      id: 1,
      title: 'Cancelled Free Trial',
      date: '3:45 PM 05-01-2026',
      amount: '+₹0',
      action: 'DownloadLine Invoice'
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
      action: 'DownloadLine Invoice'
    },
    {
      id: 4,
      title: 'Subscription Upgrade',
      date: '11:00 AM 08-30-2026',
      amount: '+₹999',
      action: 'DownloadLine Receipt'
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
    <div className="h-screen flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
      <AppBar
        title="Billing history"
        onBack={() => router.push('/brand/account')}
      />

      {/* Billing History Container */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4">
        <div className="flex flex-col h-full">
          {billingHistory.length === 0 ? (
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
                {billingHistory.map((transaction, index) => (
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
                            <button className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors" style={{ color: colors.text.neutral.base, borderBottomColor: colors.neutral.muted, borderBottomWidth: '1px' }}>
                              <DownloadLine className="w-4 h-4" />
                              DownloadLine Invoice
                            </button>
                            <button className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors" style={{ color: colors.text.neutral.base }}>
                              <FileCopyLine className="w-4 h-4" />
                              Copy Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    {index < billingHistory.length - 1 && (
                      <div className="h-px w-full" style={{ backgroundColor: colors.neutral.muted }} />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
