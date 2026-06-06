'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatAmount(amountInPaise, currency = 'INR') {
  const amountInRupees = amountInPaise / 100;
  return `₹${amountInRupees.toFixed(2)}`;
}

function groupByMonth(transactions) {
  const groups = {};
  transactions.forEach(txn => {
    const date = new Date(txn.createdAt || txn.date || Date.now());
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(txn);
  });
  return Object.fromEntries(
    Object.entries(groups).sort((a, b) => {
      const dateA = new Date(a[1][0]?.createdAt);
      const dateB = new Date(b[1][0]?.createdAt);
      return dateB - dateA;
    })
  );
}

export default function BillingHistory() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/account/transactions')
      .then(res => {
        const data = res.data?.data || res.data || [];
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = groupByMonth(transactions);

  return (
    <div className="min-h-screen bg-[#000201] text-white p-5">
      <div className="bg-[#181818] rounded-[24px] p-5">
        <p
          className="text-[24px] font-normal text-white capitalize leading-[1.2] mb-5"
          style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          Transactions
        </p>

        {loading ? (
          <div className="flex flex-col gap-[10px]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse py-[10px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[48px] h-[48px] rounded-full bg-[#272626] flex-shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="h-3 bg-[#272626] rounded w-24" />
                    <div className="h-2 bg-[#272626] rounded w-48" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="h-3 bg-[#272626] rounded w-12" />
                  <div className="h-2 bg-[#272626] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-[#9b9b9b] text-sm text-center py-12">No transactions yet.</p>
        ) : (
          Object.entries(grouped).map(([month, txns]) => (
            <div key={month} className="mb-6">
              <p
                className="text-[16px] font-normal text-[#9b9b9b] capitalize leading-[1.2] mb-[10px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {month}
              </p>
              <div className="flex flex-col gap-[10px]">
                {txns.map((txn, idx) => {
                  const id = txn._id || txn.id;
                  const planName = txn.metadata?.planName || txn.description || 'Payment';
                  const displayName = `${planName} Plan`;
                  const status = txn.status || 'PENDING';
                  const statusLabel = status === 'COMPLETED' ? 'Completed' : 'Pending';
                  const amount = txn.amount ?? 0;
                  const formattedAmount = formatAmount(amount, txn.currency);
                  const isCompleted = status === 'COMPLETED';

                  return (
                    <div key={id || idx}>
                      <div className="flex items-center justify-between py-[10px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[48px] h-[48px] rounded-full bg-[#272626] overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">{getInitials(planName)}</span>
                          </div>
                          <div className="flex flex-col gap-[4px] min-w-0">
                            <p
                              className="text-[16px] font-normal text-white capitalize leading-[1.2]"
                              style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                            >
                              {displayName}
                            </p>
                            <p
                              className="text-[12px] font-normal text-[#9b9b9b] leading-[1.2]"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              {statusLabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-[4px] flex-shrink-0 w-[140px]">
                          <p
                            className="text-[16px] font-normal capitalize leading-[1.2] text-white"
                            style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                          >
                            {formattedAmount}
                          </p>
                          <button
                            onClick={() => router.push('/influencer/account/upgrade-plan')}
                            className="text-[#16a34a] text-[14px] font-normal capitalize leading-[1.4] hover:underline text-right"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            View Subscription
                          </button>
                        </div>
                      </div>
                      {idx < txns.length - 1 && <div className="h-px bg-white/10" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
