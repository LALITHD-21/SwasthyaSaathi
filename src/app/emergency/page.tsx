'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { t } from '@/lib/i18n';
import Link from 'next/link';

export default function EmergencyPage() {
  const { language } = useLanguage();
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-700 via-red-600 to-rose-900 flex flex-col items-center justify-between p-6 text-white text-center">
      
      {/* Top Warning Badge */}
      <div className="w-full max-w-sm flex items-center justify-center gap-2 bg-red-800/80 backdrop-blur-sm py-2 px-4 rounded-full border border-red-400/40 mt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
        <span className="text-xs font-black uppercase tracking-wider text-red-100">
          Red-Flag Safety Protocol Triggered
        </span>
      </div>

      {/* Main Alert Icon & Title */}
      <div className="flex flex-col items-center my-6 animate-fade-in max-w-sm">
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl mb-4 ring-8 ring-white/15 animate-bounce">
          🚨
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight">
          {t(language, 'emergencyTitle')}
        </h1>
        
        <p className="text-base sm:text-lg font-medium opacity-95 leading-relaxed">
          {t(language, 'emergencyMessage')}
        </p>

        {triggerText && (
          <div className="mt-4 bg-black/20 border border-white/20 p-3 rounded-2xl text-xs text-left w-full">
            <span className="font-bold opacity-80 block mb-1">Triggered Symptoms:</span>
            <span className="italic opacity-95">&ldquo;{triggerText}&rdquo;</span>
          </div>
        )}
      </div>

      {/* Emergency Action Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3.5 my-2">
        {/* Call 108 Ambulance */}
        <a 
          href="tel:108"
          className="w-full bg-white text-red-700 font-black text-2xl py-5 rounded-3xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-red-50 ring-4 ring-white/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 flex-shrink-0 animate-pulse">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
          </svg>
          <span>{t(language, 'call108')}</span>
        </a>

        {/* Secondary: Call 112 */}
        <a 
          href="tel:112"
          className="w-full bg-red-800/80 border border-white/40 text-white font-bold text-base py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all hover:bg-red-800"
        >
          <span>📞</span>
          <span>Call 112 (National Emergency)</span>
        </a>

        {/* Find Hospital on Google Maps */}
        <button 
          onClick={handleHospitalSearch}
          type="button"
          className="w-full bg-red-900/60 border border-white/20 text-white font-bold text-base py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all hover:bg-red-900"
        >
          <span>🗺️</span>
          <span>{t(language, 'goToHospital')}</span>
        </button>
      </div>

      {/* First Aid Quick Tips */}
      <div className="w-full max-w-sm bg-black/25 p-4 rounded-3xl border border-white/10 text-left text-xs space-y-1.5 my-2">
        <p className="font-bold text-red-200 uppercase tracking-wider text-[11px]">
          Immediate First-Aid Steps:
        </p>
        <p className="opacity-90">• Keep the patient in a seated, comfortable position.</p>
        <p className="opacity-90">• Loosen tight clothing around neck and chest.</p>
        <p className="opacity-90">• Do not offer water or medicine until ambulance arrives.</p>
      </div>

      {/* Bottom Link */}
      <div className="mt-4 mb-2">
        <Link 
          href="/" 
          className="text-white/80 hover:text-white font-semibold underline text-sm py-2 px-4 rounded-xl inline-block"
        >
          &larr; Return to Home Screen
        </Link>
      </div>

    </main>
  );
}
