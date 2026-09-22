'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { Language } from '@/types';

import Image from 'next/image';

export default function HeaderNav() {
  const { language, setLanguage } = useLanguage();

  const langList: { code: Language; short: string; label: string }[] = [
    { code: 'en', short: 'EN', label: 'English' },
    { code: 'hi', short: 'हिं', label: 'हिंदी' },
    { code: 'kn', short: 'ಕನ್', label: 'ಕನ್ನಡ' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group active:scale-98 transition-transform">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-1 flex items-center justify-center group-hover:scale-105 group-hover:border-sky-300 transition-all flex-shrink-0">
            <Image
              src="/logo.png"
              alt="SwasthyaSaathi Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-slate-900 tracking-tight leading-none group-hover:text-sky-700 transition-colors">
                SwasthyaSaathi
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 block leading-tight mt-0.5">
              AI Health Companion
            </span>
          </div>
        </Link>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pills */}
          <div className="bg-slate-100/90 p-0.5 rounded-xl flex items-center border border-slate-200/60 shadow-2xs">
            {langList.map((l) => {
              const active = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                    active
                      ? 'bg-white text-sky-700 shadow-xs scale-102'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={l.label}
                >
                  {l.short}
                </button>
              );
            })}
          </div>

          {/* Emergency 108 Speed-Dial */}
          <a
            href="tel:108"
            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 px-2.5 py-1 rounded-xl text-xs font-black active:scale-95 transition-all shadow-2xs"
            title="Call 108 Emergency Ambulance"
          >
            <span className="animate-pulse text-xs">🚨</span>
            <span>108</span>
          </a>
        </div>

      </div>
    </header>
  );
}
