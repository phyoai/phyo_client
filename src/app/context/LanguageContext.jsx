'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import translations, { languages } from '@/app/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (code) => {
    if (translations[code]) {
      setLanguage(code);
      localStorage.setItem('language', code);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] ?? translations['en']?.[key] ?? key;
  };

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, currentLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
