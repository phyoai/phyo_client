'use client';

import { useState } from 'react';
import { Mail, Phone, Search, X } from 'lucide-react';

const FAQS = [
  { id: 1, title: 'How do credits work?', shortDesc: 'Credits are used for platform actions and usage.', content: 'Credits are used throughout the app for selected actions.\n\n1. Your balance is shown in Account.\n2. Upgrade Plan can add more credits.\n3. If something looks wrong, contact support.' },
  { id: 2, title: 'How do I upgrade my plan?', shortDesc: 'Upgrade from the Subscription section.', content: 'Go to Account > Subscription, choose Upgrade Plan, then complete payment. Access updates after payment succeeds.' },
  { id: 3, title: 'How do I pause or cancel my subscription?', shortDesc: 'Manage your subscription from the account area.', content: 'Pause from Account > Pause Subscription. Cancel from Account > Cancel Subscription. Both actions require confirmation.' },
  { id: 4, title: 'What payment methods do you accept?', shortDesc: 'Common payment methods are supported through Razorpay.', content: 'Cards, UPI, wallets, and bank transfer options are available through the payment gateway.' },
];

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const filteredFaqs = FAQS.filter((faq) =>
    `${faq.title} ${faq.shortDesc}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#000201] text-white p-5">
      <div className="rounded-[24px] bg-[#181818] p-[20px] flex flex-col gap-[20px]">

        {/* Hero */}
        <div className="flex flex-col items-center gap-2 pt-3 pb-1">
          <img src="/landing/phyo_logo.svg" alt="Phyo" className="h-7 w-auto" />
          <h2 className="text-[32px] font-medium text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>How can we help?</h2>
        </div>

        {/* Search */}
        <div className="relative flex items-center h-[60px] rounded-full border border-[#16a34a] bg-[#272626] px-4">
          <Search className="pointer-events-none h-5 w-5 shrink-0 text-[#9a9a9a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Help Center"
            className="flex-1 bg-transparent px-3 text-white placeholder:text-[#9a9a9a] outline-none"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}
          />
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="flex h-8 w-8 items-center justify-center rounded-full text-[#9a9a9a] hover:bg-white/10 hover:text-white shrink-0" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button className="inline-flex items-center gap-2 h-[40px] shrink-0 rounded-[20px] bg-[#16a34a] px-4 text-[15px] text-white transition-colors hover:bg-[#15803d]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Search className="h-4 w-4" />
              Search
            </button>
          )}
        </div>

        {/* FAQ section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Frequently asked questions</h3>

          {filteredFaqs.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredFaqs.map((faq) => {
                const open = expandedFaqId === faq.id;
                return (
                  <div key={faq.id} className="overflow-hidden rounded-[16px] bg-[#272626]">
                    <button onClick={() => setExpandedFaqId(open ? null : faq.id)} className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-white/5">
                      <div className="min-w-0">
                        <h3 className="text-[20px] font-medium text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{faq.title}</h3>
                        {!open && <p className="mt-1 text-[14px] leading-[1.5] text-[#9a9a9a]" style={{ fontFamily: 'Inter, sans-serif' }}>{faq.shortDesc}</p>}
                      </div>
                      <svg className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect width="28" height="28" rx="14" fill="#595959"/>
                        <path d="M20 14H14M14 14H8M14 14V8M14 14V20" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {open && (
                      <div className="border-t border-white/5 px-5 py-4">
                        <p className="whitespace-pre-line text-[14px] leading-[1.8] text-[#cfcfcf]" style={{ fontFamily: 'Inter, sans-serif' }}>{faq.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#272626] px-6 py-14 text-center">
              <p className="text-[18px] font-semibold text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>No results found</p>
              <p className="mt-2 text-[14px] leading-[1.6] text-[#9a9a9a]" style={{ fontFamily: 'Inter, sans-serif' }}>Try a different keyword or contact support directly.</p>
            </div>
          )}

          <div className="flex justify-end pt-2 pb-4">
            <button onClick={() => setIsContactOpen(true)} className="flex w-[160px] h-[40px] items-center justify-center rounded-full bg-[#16a34a] text-[16px] font-medium text-white hover:bg-[#15803d] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Contact Us
            </button>
          </div>
        </div>

      </div>

      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setIsContactOpen(false)}>
          <div className="w-full max-w-[500px] rounded-[24px] bg-[#181818] p-[20px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-[32px]">
              {/* Title + subtitle */}
              <div className="flex flex-col gap-[8px]">
                <h2 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Contact Us</h2>
                <p className="text-[14px] text-[#9a9a9a]" style={{ fontFamily: 'Inter, sans-serif' }}>We're here to help. Reach out to us anytime and we'll get back to you as soon as possible.</p>
              </div>
              {/* Buttons */}
              <div className="flex gap-[20px]">
                <a href="mailto:support@phyo.ai" className="flex-1 h-[40px] flex items-center justify-center gap-[12px] rounded-full bg-white text-black text-[16px] font-normal hover:bg-white/90 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
                <a href="tel:+919999999999" className="flex-1 h-[40px] flex items-center justify-center gap-[12px] rounded-full bg-white text-black text-[16px] font-normal hover:bg-white/90 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Phone className="h-4 w-4" />
                  Call us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
