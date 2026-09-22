'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';
import LanguageSelector from '@/components/LanguageSelector';
import MicButton from '@/components/MicButton';
import { t } from '@/lib/i18n';
import TelegramBotCard from '@/components/TelegramBotCard';

export default function LandingPage() {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <main className="max-w-md mx-auto min-h-[calc(100dvh-60px)] flex flex-col justify-between p-4 sm:p-5 gap-5 pb-8 animate-fade-in">
      
      {/* Hero Badge, Logo & Headline */}
      <div className="flex flex-col items-center text-center gap-2 pt-1">
        <div className="relative mb-0.5 group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-2 border border-slate-200/90 shadow-md shadow-sky-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="SwasthyaSaathi Official Logo"
              width={88}
              height={88}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-emerald-500/10 border border-sky-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black tracking-wide text-sky-950 uppercase">
            AI Healthcare for Bharat • 24x7
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-1">
          Speak Your Symptoms.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-700">
            Find the Right Doctor Instantly.
          </span>
        </h1>

        <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
          Check urgency in <strong className="text-slate-800">Hindi</strong>, <strong className="text-slate-800">Kannada</strong>, or <strong className="text-slate-800">English</strong>. Locate free Govt PHCs and PM-JAY hospitals near you.
        </p>
      </div>

      {/* Language Selector Card */}
      <div className="glass-panel p-3.5 rounded-3xl">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {t(language, 'selectLanguage')}
          </span>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
            Trilingual Voice AI
          </span>
        </div>
        <LanguageSelector />
      </div>

      {/* Hero Symptom Studio Console */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden text-center flex flex-col items-center shadow-lg shadow-sky-500/5">
        {/* Ambient Glow Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-sky-400/20 via-teal-400/20 to-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
            Tap Microphone & Speak
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {t(language, 'tapToSpeak')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe symptoms naturally in your own words
          </p>
        </div>

        {/* Giant Hero Mic */}
        <div className="my-3 relative z-10">
          <MicButton
            isListening={false}
            onClick={() => router.push('/check')}
            size="xl"
          />
        </div>

        {/* Dual Quick Entry Buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full mt-3 pt-4 border-t border-slate-100 relative z-10">
          <button
            onClick={() => router.push('/check')}
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-3 bg-white hover:bg-sky-50 text-slate-800 rounded-2xl font-extrabold text-xs border border-slate-200 shadow-2xs active:scale-95 transition-all"
          >
            <span className="text-base">📸</span>
            <span>Camera Scan</span>
          </button>

          <button
            onClick={() => router.push('/check')}
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-3 bg-sky-50 hover:bg-sky-100/80 text-sky-900 rounded-2xl font-extrabold text-xs border border-sky-200 shadow-2xs active:scale-95 transition-all"
          >
            <span className="text-base">⌨️</span>
            <span>Type or Pick</span>
          </button>
        </div>
      </div>

      {/* 4-Step Patient Journey Guide */}
      <div className="glass-card rounded-3xl p-4 text-left">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
            How SwasthyaSaathi Works
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            4 Easy Steps
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-black">
          <div className="bg-slate-50 hover:bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs transition-all">
            <span className="text-lg block mb-1">🎤</span>
            <span className="text-slate-800">1. Speak</span>
          </div>
          <div className="bg-slate-50 hover:bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs transition-all">
            <span className="text-lg block mb-1">⚡</span>
            <span className="text-slate-800">2. Triage</span>
          </div>
          <div className="bg-slate-50 hover:bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs transition-all">
            <span className="text-lg block mb-1">🏛️</span>
            <span className="text-slate-800">3. Free Care</span>
          </div>
          <div className="bg-slate-50 hover:bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs transition-all">
            <span className="text-lg block mb-1">📋</span>
            <span className="text-slate-800">4. Card</span>
          </div>
        </div>
      </div>

      {/* Telegram Channel Access Banner */}
      <div>
        <TelegramBotCard compact={false} />
      </div>

      {/* Trust & Safety Footer */}
      <div className="flex flex-col items-center gap-1.5 pt-1 text-center">
        <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold text-slate-500">
          <span>🔒 100% Free & Private</span>
          <span>•</span>
          <span>⚡ Gemini 3.6 Flash</span>
          <span>•</span>
          <span>🏛️ PM-JAY & PHC</span>
        </div>

        <p className="text-[10px] text-slate-400 font-medium max-w-xs leading-normal">
          {t(language, 'trustStatement')}
        </p>
      </div>

    </main>
  );
}
