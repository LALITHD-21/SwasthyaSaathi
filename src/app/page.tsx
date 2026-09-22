'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import LanguageSelector from '@/components/LanguageSelector';
import MicButton from '@/components/MicButton';
import { t } from '@/lib/i18n';
import TelegramBotCard from '@/components/TelegramBotCard';

export default function LandingPage() {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col justify-between p-4 sm:p-5 text-center bg-gradient-to-b from-sky-50/90 via-white to-sky-100/70 relative overflow-hidden gap-4 pb-8">
      
      {/* 24x7 Emergency Helpline Banner */}
      <a
        href="tel:108"
        className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm font-extrabold py-2.5 px-4 rounded-2xl shadow-md shadow-rose-200 flex items-center justify-between hover:brightness-105 active:scale-98 transition-all"
      >
        <span className="flex items-center gap-2">
          <span className="animate-pulse text-base">🚨</span>
          <span>{t(language, 'emergencyQuickAccess')}</span>
        </span>
        <span className="bg-white text-red-700 px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-2xs">
          Call 108
        </span>
      </a>

      {/* Hero Branding */}
      <div className="flex flex-col items-center gap-2 mt-1 animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-tr from-sky-600 to-cyan-500 rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-sky-200 text-white">
          🩺
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-[11px] font-extrabold px-3 py-0.5 rounded-full mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Health Companion • 24x7 Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-800 via-sky-600 to-teal-700 tracking-tight">
            SwasthyaSaathi
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-0.5">
            {t(language, 'tagline')}
          </p>
        </div>
      </div>

      {/* Language Picker */}
      <div className="w-full bg-white/90 backdrop-blur-sm p-3.5 rounded-3xl border border-sky-100 shadow-xs">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
          {t(language, 'selectLanguage')}
        </p>
        <LanguageSelector />
      </div>

      {/* Hero Interactive Mic CTA */}
      <div className="flex flex-col items-center justify-center bg-white/80 p-5 rounded-3xl border border-sky-100 shadow-sm relative overflow-hidden">
        <div className="mb-2">
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            {t(language, 'tapToSpeak')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Speak in Hindi, Kannada, or English
          </p>
        </div>

        <div className="my-2 relative">
          {/* Subtle Outer Pulsing Wave */}
          <div className="absolute inset-0 rounded-full bg-sky-400/20 animate-ping pointer-events-none scale-125" />
          <MicButton
            isListening={false}
            onClick={() => router.push('/check')}
            size="xl"
          />
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => router.push('/check')}
            type="button"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl font-bold text-xs border border-sky-200 active:scale-95 transition-all"
          >
            <span>⌨️</span>
            <span>Type or Pick</span>
          </button>

          <button
            onClick={() => router.push('/clinics')}
            type="button"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 active:scale-95 transition-all"
          >
            <span>📍</span>
            <span>Nearby Clinics</span>
          </button>
        </div>
      </div>

      {/* 4-Step Patient Journey Guide */}
      <div className="bg-sky-50/60 rounded-2xl p-3 border border-sky-100/80 text-left text-xs">
        <span className="font-extrabold text-sky-950 uppercase text-[10px] tracking-wider block mb-2">
          How SwasthyaSaathi Works:
        </span>
        <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold text-sky-900">
          <div className="bg-white p-2 rounded-xl shadow-2xs border border-sky-100">
            <span className="text-base block mb-0.5">🎤</span>
            <span>1. Voice/Snap</span>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-2xs border border-sky-100">
            <span className="text-base block mb-0.5">⚡</span>
            <span>2. AI Triage</span>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-2xs border border-sky-100">
            <span className="text-base block mb-0.5">🏛️</span>
            <span>3. Free PHC</span>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-2xs border border-sky-100">
            <span className="text-base block mb-0.5">📋</span>
            <span>4. PDF Card</span>
          </div>
        </div>
      </div>

      {/* Telegram Channel Access Banner */}
      <div>
        <TelegramBotCard compact={false} />
      </div>

      {/* Trust & Safety Footer */}
      <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-sky-100">
        <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-gray-500">
          <span>🔒 100% Free & Private</span>
          <span>•</span>
          <span>⚡ Gemini 3.6 Flash</span>
          <span>•</span>
          <span>🏛️ PM-JAY & PHC</span>
        </div>

        <p className="text-[10px] text-gray-400 font-medium max-w-xs leading-tight">
          {t(language, 'trustStatement')}
        </p>
      </div>

    </main>
  );
}
