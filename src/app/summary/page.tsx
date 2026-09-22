'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import UrgencyBadge from '@/components/UrgencyBadge';
import { TriageResult, SPECIALIST_LABELS, SpecialistType } from '@/types';
import { generateSummaryPDF } from '@/lib/pdf';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import TelegramBotCard from '@/components/TelegramBotCard';

export default function SummaryPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [result, setResult] = useState<TriageResult | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [passId, setPassId] = useState<string>('');

  useEffect(() => {
    const savedResult = sessionStorage.getItem('triageResult');
    const savedTranscript = sessionStorage.getItem('transcript');
    const image = sessionStorage.getItem('attachedImage');
    
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
        setTranscript(savedTranscript || '');
        if (image) setAttachedImage(image);
        
        // Generate stable 6-digit reference ID for the summary pass
        const randId = Math.floor(100000 + Math.random() * 900000);
        setPassId(`SS-${randId}`);
      } catch {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  if (!result) return null;

  const specialistKey = result.recommended_specialist as SpecialistType;
  const specialistName = SPECIALIST_LABELS[specialistKey] || result.recommended_specialist;

  const handleDownload = () => {
    if (result && transcript) {
      setDownloading(true);
      try {
        generateSummaryPDF(result, transcript, language, attachedImage || undefined);
      } finally {
        setTimeout(() => setDownloading(false), 800);
      }
    }
  };

  const shareText = `*SwasthyaSaathi Clinical Summary Slip*\nID: ${passId}\n• Urgency: ${result.urgency_level.toUpperCase()}\n• Doctor: ${specialistName}\n• Symptoms: ${result.detected_symptoms.join(', ')}\n• Notes: ${result.reasoning}`;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://swasthyasaathi.vercel.app';
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SwasthyaSaathi Doctor Consultation Summary',
          text: shareText,
        });
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const nowTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="max-w-md mx-auto min-h-[calc(100dvh-60px)] flex flex-col p-4 sm:p-5 gap-4 pb-36 animate-fade-in">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/results')}
          type="button"
          className="text-slate-700 hover:text-slate-900 font-bold py-2 px-3 flex items-center gap-1.5 rounded-xl hover:bg-white/80 active:scale-95 transition-all text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>{t(language, 'back')}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
            Step 4 of 4 • Health Pass
          </span>

          <button
            onClick={handlePrint}
            type="button"
            className="text-xs font-extrabold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-2xs hover:bg-slate-50 flex items-center gap-1 active:scale-95 transition-all"
            title="Print Summary Slip"
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Header Intro */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t(language, 'doctorSummary')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Present this verified clinical slip at hospital OPD to speed up consultation.
        </p>
      </div>

      {/* High-End Digital Clinical Slip */}
      <div className="bg-white rounded-3xl shadow-xl shadow-sky-950/5 border border-slate-200 overflow-hidden relative">
        
        {/* Slip Top Security Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 relative overflow-hidden">
          {/* Subtle Grid / Watermark Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-500/30 border border-sky-400/40 flex items-center justify-center text-sm">
                  🩺
                </span>
                <span className="font-black text-lg tracking-tight text-white">
                  SwasthyaSaathi
                </span>
              </div>
              <p className="text-sky-300 text-[11px] font-bold mt-1 tracking-wide uppercase">
                Digital Health Passport
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-white/15 text-white text-[10px] font-mono font-black px-2.5 py-1 rounded-full border border-white/20">
                {passId || 'SS-RECORD'}
              </span>
              <p className="text-slate-400 text-[10px] font-medium mt-1">
                {today} • {nowTime}
              </p>
            </div>
          </div>
        </div>

        {/* Triage Status Banner Strip */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            {t(language, 'urgency')}
          </span>
          <UrgencyBadge level={result.urgency_level} size="sm" lang={language} />
        </div>

        {/* Slip Body Content */}
        <div className="p-5 flex flex-col gap-4 text-sm">
          
          {/* Recommended Specialist Spotlight */}
          <div className="glass-card p-4 rounded-2xl border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-full inline-block mb-1">
                {t(language, 'recommendedSpecialist')}
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {specialistName}
              </h3>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center text-xl font-bold">
              👨‍⚕️
            </span>
          </div>

          {/* Reported Symptoms & Duration */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
              {t(language, 'symptoms')} & Timeline
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.detected_symptoms.map((s, i) => (
                <span 
                  key={i} 
                  className="bg-slate-100 text-slate-800 border border-slate-200/80 font-bold px-2.5 py-1 rounded-xl text-xs"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
            {result.duration && (
              <p className="text-xs text-slate-600 mt-2 font-medium">
                ⏱ Symptom Duration: <strong className="text-slate-900">{result.duration}</strong>
              </p>
            )}
          </div>

          {/* Attached Patient Photo (if available) */}
          {attachedImage && (
            <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100 flex gap-3 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/jpeg;base64,${attachedImage}`}
                alt="Patient symptom snap"
                className="w-16 h-16 object-cover rounded-xl border border-sky-200 shadow-2xs flex-shrink-0"
              />
              <div className="text-xs min-w-0">
                <span className="font-extrabold text-sky-950 block">
                  Attached Patient Photo
                </span>
                {result.visual_observations && result.visual_observations.length > 0 ? (
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-snug line-clamp-2">
                    {result.visual_observations.join(', ')}
                  </p>
                ) : (
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Attached for physician inspection.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Patient Spoken Statement */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Patient Spoken Statement:
            </span>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>

          {/* Clarifying Q&A Details */}
          {result.clarifying_answers && result.clarifying_answers.length > 0 && (
            <div className="bg-sky-50/40 p-3 rounded-2xl border border-sky-100 text-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                Clinical Clarifications:
              </span>
              {result.clarifying_answers.map((qa, i) => (
                <p key={i} className="text-slate-700 leading-snug text-xs">
                  • <strong>{qa.question}:</strong> <span className="text-sky-800 font-bold">{qa.answer}</span>
                </p>
              ))}
            </div>
          )}

          {/* Clinical Rationale */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              AI Triage Rationale:
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {result.reasoning}
            </p>
          </div>

          {/* Slip Footer Security Seal */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span>🛡️</span>
              <span>AI Pre-Consultation Slip</span>
            </span>
            <span>Ref: {passId}</span>
          </div>

        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-1">
        {/* Download PDF Slip */}
        <button 
          onClick={handleDownload}
          disabled={downloading}
          type="button"
          className="w-full bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-600 text-white font-black text-base py-4 rounded-2xl shadow-lg shadow-sky-500/25 active:scale-98 transition-all flex justify-center items-center gap-2.5 min-h-[56px] hover:brightness-105 animate-shimmer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{downloading ? 'Preparing PDF Slip...' : t(language, 'downloadPDF')}</span>
        </button>

        {/* Messaging Shares Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* WhatsApp Share */}
          <button 
            onClick={handleWhatsAppShare}
            type="button"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-2xl shadow-sm active:scale-98 transition-all flex justify-center items-center gap-1.5 min-h-[46px]"
          >
            <span className="text-base">💬</span>
            <span className="truncate">{t(language, 'whatsappShare')}</span>
          </button>

          {/* Telegram Share */}
          <button 
            onClick={handleTelegramShare}
            type="button"
            className="w-full bg-[#229ED9] hover:bg-[#1B89BD] text-white font-black text-xs py-3 rounded-2xl shadow-sm active:scale-98 transition-all flex justify-center items-center gap-1.5 min-h-[46px]"
          >
            <span className="text-base">✈️</span>
            <span className="truncate">{t(language, 'telegramShare')}</span>
          </button>
        </div>

        {/* Native Web Share */}
        <button 
          onClick={handleNativeShare}
          type="button"
          className="w-full bg-white text-slate-800 border border-slate-200 font-extrabold text-xs py-2.5 rounded-xl active:bg-slate-50 transition-all flex justify-center items-center gap-1.5"
        >
          <span>📤</span>
          <span>{t(language, 'share')}</span>
        </button>
      </div>

      {/* Telegram 24x7 Channel */}
      <div className="mt-1">
        <TelegramBotCard compact={true} />
      </div>

      {/* Navigation Footer */}
      <div className="mt-2 flex items-center justify-between text-xs font-bold text-slate-500 pb-8 px-2">
        <Link 
          href="/clinics" 
          className="text-sky-700 hover:underline flex items-center gap-1"
        >
          <span>📍</span>
          <span>Find Nearby Clinics</span>
        </Link>

        <Link 
          href="/check" 
          className="text-slate-600 hover:underline flex items-center gap-1"
        >
          <span>&larr;</span>
          <span>{t(language, 'startNew')}</span>
        </Link>
      </div>

    </main>
  );
}
