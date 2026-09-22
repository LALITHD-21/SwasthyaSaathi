'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, SPEECH_LANG_CODES } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  speechLangCode: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('swasthya_language');
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'kn')) {
      setLanguageState(saved as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swasthya_language', lang);
  };

  const speechLangCode = SPEECH_LANG_CODES[language];

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, speechLangCode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
