'use client';
import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export default function SectionHeading({
  title,
  eyebrow,
  showViewAll = true,
  onViewAll
}) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        {eyebrow && (
          <p className="text-[11px] text-[#9A9A9A] uppercase tracking-widest mb-1 font-medium">
            {eyebrow}
          </p>
        )}
        <h2
          className="text-[24px] font-normal text-white leading-[1.2] capitalize"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)', fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {title}
        </h2>
      </div>
      {showViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-[12px] text-[#16a34a] hover:text-[#22c55e] transition-colors"
        >
          <span
            className="text-[16px] font-normal capitalize leading-[1.2] whitespace-nowrap"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {t('view_all')}
          </span>
          {/* Rotated arrow matching Figma (rotate-180 on a left-pointing chevron = right arrow) */}
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="rotate-180">
            <path d="M5 1L1 5L5 9" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
