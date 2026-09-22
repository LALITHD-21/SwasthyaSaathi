'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Language } from '@/types';

interface LangOption {
  code: Language;
  label: string;
  sub: string;
}

const LANGS: LangOption[] = [
  { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
  { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
  { code: 'en', label: 'English', sub: 'English' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-2">
      {LANGS.map((item) => {
        const isSelected = language === item.code;
        return (
          <button
            key={item.code}
            onClick={() => setLanguage(item.code)}
            type="button"
            className={`py-3 px-2 rounded-2xl text-center transition-all duration-200 border cursor-pointer active:scale-95 ${
              isSelected
                ? 'bg-gradient-to-tr from-sky-600 to-cyan-600 text-white border-sky-600 shadow-md shadow-sky-200 scale-102'
                : 'bg-white text-gray-700 border-gray-200/90 hover:border-sky-300 hover:bg-sky-50/50 shadow-sm'
            }`}
          >
            <span className="block text-sm sm:text-base font-black leading-tight">
              {item.label}
            </span>
            <span className={`block text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-sky-100' : 'text-gray-400'}`}>
              {item.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
