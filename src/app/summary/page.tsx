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

  useEffect(() => {
    const savedResult = sessionStorage.getItem('triageResult');
    const savedTranscript = sessionStorage.getItem('transcript');
    const image = sessionStorage.getItem('attachedImage');
    
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
        setTranscript(savedTranscript || '');
        if (image) setAttachedImage(image);
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

  const shareText = `*SwasthyaSaathi Doctor Consultation Card*\n• Symptoms: ${result.detected_symptoms.join(', ')}\n• Urgency: ${result.urgency_level.toUpperCase()}\n• Recommended Doctor: ${specialistName}\n• Notes: ${result.reasoning}`;

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
          title: 'SwasthyaSaathi Doctor Summary Card',
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
    dateStyle: 'medium',
  });

  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col p-4 sm:p-6 bg-gradient-to-b from-sky-50 via-white to-sky-50 gap-5 pb-28">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          type="button"
          className="text-sky-800 font-semibold py-2 px-3 flex items-center gap-1.5 min-h-[44px] rounded-xl hover:bg-white/80 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t(language, 'back')}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
            Step 4 of 4 • Doctor Card
          </span>

          <button
            onClick={handlePrint}
            type="button"
            className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-gray-50 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-gray-900">
          {t(language, 'doctorSummary')}
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Show this card to your healthcare provider so you don&apos;t have to repeat symptoms
        </p>
      </div>

      {/* Clinical Card Design */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-sky-100 overflow-hidden">
        {/* Card Top Banner */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 text-white p-5 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🩺</span>
              <h2 className="font-black text-xl tracking-tight">SwasthyaSaathi</h2>
            </div>
            <p className="text-sky-100 text-xs font-medium mt-1">Pre-Consultation Summary Card</p>
          </div>
          <div className="text-right">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              {today}
            </span>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-5 flex flex-col gap-4 text-sm">
          
          {/* Triage Status */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t(language, 'urgency')}
            </span>
            <UrgencyBadge level={result.urgency_level} size="sm" lang={language} />
          </div>

          {/* Key Symptoms */}
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              {t(language, 'symptoms')} & Duration
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.detected_symptoms.map((s, i) => (
                <span key={i} className="bg-sky-50 text-sky-900 border border-sky-100 font-semibold px-2.5 py-1 rounded-lg text-xs">
                  ✓ {s}
                </span>
              ))}
            </div>
            {result.duration && (
              <p className="text-xs text-gray-600 mt-2 font-medium">
                Duration noted: <strong className="text-gray-900">{result.duration}</strong>
              </p>
            )}
          </div>

          {/* Attached Photo & Visual Observations */}
          {attachedImage && (
            <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100 flex gap-3 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/jpeg;base64,${attachedImage}`}
                alt="Patient symptom photo"
                className="w-16 h-16 object-cover rounded-xl border border-sky-200 shadow-sm flex-shrink-0"
              />
              <div className="text-xs">
                <span className="font-bold text-sky-900 block">
                  Attached Patient Photo
                </span>
                {result.visual_observations && result.visual_observations.length > 0 && (
                  <p className="text-gray-700 text-[11px] mt-0.5 leading-snug">
                    AI visual notes: {result.visual_observations.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recommended Specialist */}
          <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                {t(language, 'recommendedSpecialist')}
              </span>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">
                {specialistName}
              </p>
            </div>
            <span className="text-2xl">👨‍⚕️</span>
          </div>

          {/* Patient Voice Description */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Patient&apos;s Exact Statement:
            </span>
            <p className="text-xs text-gray-700 italic leading-relaxed">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>

          {/* Patient Clarifying Answers */}
          {result.clarifying_answers && result.clarifying_answers.length > 0 && (
            <div className="bg-sky-50/40 p-3 rounded-2xl border border-sky-100 text-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Patient Clarifications:
              </span>
              {result.clarifying_answers.map((qa, i) => (
                <p key={i} className="text-gray-700 leading-snug">
                  • <strong>{qa.question}:</strong> <span className="text-sky-800 font-semibold">{qa.answer}</span>
                </p>
              ))}
            </div>
          )}

          {/* Clinical Reasoning */}
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              AI Triage Rationale:
            </span>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {result.reasoning}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-medium leading-normal">
              {result.disclaimer}
            </p>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-2">
        <button 
          onClick={handleDownload}
          disabled={downloading}
          type="button"
          className="w-full bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-sky-200 active:scale-98 transition-all flex justify-center items-center gap-2.5 min-h-[56px] hover:brightness-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{downloading ? 'Preparing PDF...' : t(language, 'downloadPDF')}</span>
        </button>

        {/* Messaging Shares Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* WhatsApp Share */}
          <button 
            onClick={handleWhatsAppShare}
            type="button"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-2xl shadow-sm active:scale-98 transition-all flex justify-center items-center gap-1.5 min-h-[46px]"
          >
            <span className="text-base">💬</span>
            <span className="truncate">{t(language, 'whatsappShare')}</span>
          </button>

          {/* Telegram Share */}
          <button 
            onClick={handleTelegramShare}
            type="button"
            className="w-full bg-[#229ED9] hover:bg-[#1B89BD] text-white font-bold text-xs py-3 rounded-2xl shadow-sm active:scale-98 transition-all flex justify-center items-center gap-1.5 min-h-[46px]"
          >
            <span className="text-base">✈️</span>
            <span className="truncate">{t(language, 'telegramShare')}</span>
          </button>
        </div>

        {/* Native Web Share */}
        <button 
          onClick={handleNativeShare}
          type="button"
          className="w-full bg-white text-sky-800 border-2 border-sky-200 font-bold text-xs py-2.5 rounded-2xl active:bg-sky-50 transition-all flex justify-center items-center gap-1.5"
        >
          <span>📤</span>
          <span>{t(language, 'share')}</span>
        </button>
      </div>

      {/* Telegram Bot Card for Direct Consultations */}
      <div className="mt-1">
        <TelegramBotCard compact={true} />
      </div>

      {/* Check Another Link */}
      <div className="mt-2 text-center pb-6">
        <Link 
          href="/check" 
          className="text-xs font-bold text-sky-700 hover:text-sky-900 underline py-2 inline-block"
        >
          &larr; {t(language, 'startNew')}
        </Link>
      </div>

    </main>
  );
}
