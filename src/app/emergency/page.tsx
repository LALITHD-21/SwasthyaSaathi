'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import { Language } from '@/types';

export default function EmergencyPage() {
  const { language, setLanguage } = useLanguage();
  const [triggerText, setTriggerText] = useState<string | null>(null);

  useEffect(() => {
    const trigger = sessionStorage.getItem('emergencyTrigger');
    if (trigger) {
      setTriggerText(trigger);
    }
  }, []);

  const handleHospitalSearch = () => {
    window.open('https://www.google.com/maps/search/emergency+hospital+near+me', '_blank');
  };

  const langs: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Emergency Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-600/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header with Emergency Protocol & Language Switcher */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/40 px-3 py-1 rounded-full backdrop-blur-md shadow-lg shadow-rose-950/50">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-wider text-rose-200">
            Emergency Protocol
          </span>
        </div>

        {/* Quick Language Toggle for Bystanders */}
        <div className="flex bg-white/10 backdrop-blur-md p-0.5 rounded-xl border border-white/15">
          {langs.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                language === l.code
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Center Emergency Alert Console */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center my-6 z-10">
        
        {/* Pulsing Emergency Radar Ring */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-rose-600/30 animate-ping absolute inset-0 duration-1000" />
          <div className="w-24 h-24 rounded-full bg-rose-600/40 animate-pulse absolute inset-0" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-5xl shadow-2xl shadow-rose-600/60 relative z-10 border-2 border-rose-300/40">
            🚨
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight text-white">
          {t(language, 'emergencyTitle')}
        </h1>

        <p className="text-sm sm:text-base font-medium text-rose-100/90 leading-relaxed max-w-sm">
          {t(language, 'emergencyMessage')}
        </p>

        {/* Highlight Triggered Symptoms */}
        {triggerText && (
          <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left w-full">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 block mb-1">
              Triggered Critical Symptoms:
            </span>
            <p className="text-xs text-white/90 italic font-medium leading-relaxed">
              &ldquo;{triggerText}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons Hub */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-3 z-10 my-2">
        {/* Call 108 Ambulance - Hero Action */}
        <a 
          href="tel:108"
          className="w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 text-white font-black text-2xl py-4 sm:py-5 rounded-3xl shadow-2xl shadow-rose-600/50 flex items-center justify-center gap-3 active:scale-95 transition-all hover:brightness-110 border border-rose-400/50 animate-shimmer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 flex-shrink-0 animate-pulse">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
          </svg>
          <span>{t(language, 'call108')}</span>
        </a>

        {/* Secondary: National Emergency 112 */}
        <div className="grid grid-cols-2 gap-2">
          <a 
            href="tel:112"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-2xl backdrop-blur-md active:scale-98 transition-all"
          >
            <span>📞</span>
            <span>Dial 112 (All Help)</span>
          </a>

          <button 
            onClick={handleHospitalSearch}
            type="button"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-2xl backdrop-blur-md active:scale-98 transition-all"
          >
            <span>🗺️</span>
            <span>{t(language, 'goToHospital')}</span>
          </button>
        </div>
      </div>

      {/* Critical First-Aid Guidelines Card */}
      <div className="w-full max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-3xl text-left text-xs space-y-2 z-10 my-2">
        <span className="font-black text-rose-300 uppercase tracking-wider text-[11px] block">
          Immediate Bystander Actions While Waiting:
        </span>
        <div className="grid grid-cols-1 gap-1.5 text-slate-300 font-medium">
          <p className="flex items-start gap-2">
            <span>🪑</span>
            <span>Keep patient upright & seated. Do not force them to lie flat if breathless.</span>
          </p>
          <p className="flex items-start gap-2">
            <span>👔</span>
            <span>Loosen tight clothing around collar, neck, and waist immediately.</span>
          </p>
          <p className="flex items-start gap-2">
            <span>🚫</span>
            <span>Do NOT give food, drinks, or oral medicines until medical staff arrives.</span>
          </p>
        </div>
      </div>

      {/* Bottom Dismiss Link */}
      <div className="w-full max-w-md mx-auto text-center z-10 pb-4 pt-2">
        <Link 
          href="/" 
          className="text-slate-400 hover:text-white text-xs font-bold underline transition-colors inline-block py-2"
        >
          &larr; Exit Emergency Screen and Return Home
        </Link>
      </div>

    </main>
  );
}
