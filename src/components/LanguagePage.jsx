'use client';

import { useLanguage } from '@/app/context/LanguageContext';

export default function LanguagePage() {
  const { currentLanguage, languages, changeLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-[#000201] text-white p-5">
      <div className="rounded-[24px] bg-[#181818] p-[20px] flex flex-col gap-[16px]">

        <h2 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Language</h2>

        <div className="flex flex-col gap-3">
          {languages.map((lang) => {
            const isActive = currentLanguage?.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center justify-between rounded-[16px] px-5 py-4 text-left transition-colors ${
                  isActive ? 'bg-[#16a34a]/20 border border-[#16a34a]' : 'bg-[#272626] hover:bg-white/5'
                }`}
              >
                <div>
                  <p className="text-[16px] font-medium text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{lang.nativeName}</p>
                  <p className="text-[13px] text-[#9a9a9a]" style={{ fontFamily: 'Inter, sans-serif' }}>{lang.name}</p>
                </div>
                {isActive && (
                  <div className="h-5 w-5 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
