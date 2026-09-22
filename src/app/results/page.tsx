'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import UrgencyBadge from '@/components/UrgencyBadge';
import Disclaimer from '@/components/Disclaimer';
import { TriageResult, SPECIALIST_LABELS, SPECIALIST_ICONS, SpecialistType } from '@/types';
import { t } from '@/lib/i18n';

export default function ResultsPage() {
  const router = useRouter();
  const { language, speechLangCode } = useLanguage();
  const [result, setResult] = useState<TriageResult | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  useEffect(() => {
    const saved = sessionStorage.getItem('triageResult');
    const image = sessionStorage.getItem('attachedImage');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
        if (image) setAttachedImage(image);
      } catch {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!result) return null;

  const specialistKey = result.recommended_specialist as SpecialistType;
  const specialistName = SPECIALIST_LABELS[specialistKey] || result.recommended_specialist;
  const specialistIcon = SPECIALIST_ICONS[specialistKey] || '🩺';

  // Text-To-Speech function with speed control
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${result.reasoning}. ${result.disclaimer}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = speechLangCode;
    utterance.rate = speechRate;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const urgencyMeta = {
    mild: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-900',
      pill: 'bg-emerald-100 text-emerald-800',
      timeframe: 'Non-emergency. Rest, hydrate & monitor symptoms.',
      meterActiveIndex: 0,
    },
    moderate: {
      border: 'border-amber-200',
      bg: 'bg-amber-50/70',
      text: 'text-amber-900',
      pill: 'bg-amber-100 text-amber-800',
      timeframe: 'Consult a qualified doctor within 24 to 48 hours.',
      meterActiveIndex: 1,
    },
    urgent: {
      border: 'border-rose-200',
      bg: 'bg-rose-50/70',
      text: 'text-rose-900',
      pill: 'bg-rose-100 text-rose-800',
      timeframe: 'Immediate medical attention required. Dial 108 if severe.',
      meterActiveIndex: 2,
    },
  }[result.urgency_level] || {
    border: 'border-slate-200',
    bg: 'bg-slate-50',
    text: 'text-slate-900',
    pill: 'bg-slate-100 text-slate-800',
    timeframe: 'Consult a doctor for assessment.',
    meterActiveIndex: 0,
  };

  return (
    <main className="max-w-md mx-auto min-h-[calc(100dvh-60px)] flex flex-col p-4 sm:p-5 pb-36 gap-4 animate-fade-in">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/check')}
          type="button"
          className="text-slate-700 hover:text-slate-900 font-bold py-2 px-3 flex items-center gap-1.5 rounded-xl hover:bg-white/80 active:scale-95 transition-all text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>{t(language, 'back')}</span>
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
          Step 2 of 4 • AI Assessment
        </span>
      </div>

      {/* Clinical Urgency Spectrum Meter Card */}
      <div className={`glass-card p-5 rounded-3xl border ${urgencyMeta.border} shadow-sm flex flex-col gap-3 relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {t(language, 'urgency')} Assessment
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${urgencyMeta.pill}`}>
            AI Validated ✓
          </span>
        </div>

        {/* Urgency Badge */}
        <div className="flex justify-center py-1">
          <UrgencyBadge level={result.urgency_level} size="lg" lang={language} />
        </div>

        {/* 3-Stage Urgency Visual Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="grid grid-cols-3 gap-1.5 h-2 w-full rounded-full bg-slate-100 p-0.5">
            <div className={`rounded-full transition-all ${urgencyMeta.meterActiveIndex >= 0 ? 'bg-emerald-500 shadow-2xs' : 'bg-slate-200'}`} />
            <div className={`rounded-full transition-all ${urgencyMeta.meterActiveIndex >= 1 ? 'bg-amber-500 shadow-2xs' : 'bg-slate-200'}`} />
            <div className={`rounded-full transition-all ${urgencyMeta.meterActiveIndex >= 2 ? 'bg-rose-500 shadow-2xs' : 'bg-slate-200'}`} />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
            <span className={urgencyMeta.meterActiveIndex === 0 ? 'text-emerald-700 font-extrabold' : ''}>Mild</span>
            <span className={urgencyMeta.meterActiveIndex === 1 ? 'text-amber-700 font-extrabold' : ''}>Moderate</span>
            <span className={urgencyMeta.meterActiveIndex === 2 ? 'text-rose-700 font-extrabold' : ''}>Urgent</span>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-600 text-center leading-relaxed pt-1 border-t border-slate-100">
          💡 {urgencyMeta.timeframe}
        </p>
      </div>

      {/* Recommended Specialist Hero Card */}
      <div className="glass-panel p-5 rounded-3xl border border-sky-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center text-3xl shadow-md shadow-sky-400/25 flex-shrink-0">
            {specialistIcon}
          </div>
          <div className="text-left min-w-0 truncate">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
              {t(language, 'recommendedSpecialist')}
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-snug truncate">
              {specialistName}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              Specialized in managing your reported symptoms
            </p>
          </div>
        </div>
      </div>

      {/* Multimodal Vision Observation Card (if photo attached) */}
      {attachedImage && (
        <div className="glass-card p-4 rounded-3xl border border-sky-100 flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>📸</span>
              <span>{t(language, 'visualObservations')}</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Gemini Vision Inspected ✓
            </span>
          </div>

          <div className="flex gap-3 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${attachedImage}`}
              alt="Submitted symptom"
              className="w-16 h-16 object-cover rounded-2xl border border-sky-200 shadow-2xs flex-shrink-0"
            />
            <div className="flex-1 text-xs text-slate-700 space-y-1">
              {result.visual_observations && result.visual_observations.length > 0 ? (
                result.visual_observations.map((obs, idx) => (
                  <p key={idx} className="font-semibold text-slate-800 leading-snug">
                    • {obs}
                  </p>
                ))
              ) : (
                <p className="font-medium text-slate-600 text-[11px]">
                  Visual indicators analyzed alongside patient symptom notes.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Clinical Guidance & Audio Podcast Player */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <span>💡</span>
            <span>Clinical Guidance</span>
          </span>

          {/* Accessible Audio Player Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSpeechRate(speechRate === 0.9 ? 1.15 : 0.9)}
              type="button"
              className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg hover:bg-slate-200"
              title="Toggle reading speed"
            >
              {speechRate === 0.9 ? '1.0x' : '1.2x'}
            </button>
            <button
              onClick={handleToggleSpeech}
              type="button"
              className={`flex items-center gap-1.5 text-xs font-extrabold py-1.5 px-3 rounded-full transition-all active:scale-95 ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-200'
                  : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
              }`}
            >
              <span>{isSpeaking ? '⏹' : '🔊'}</span>
              <span>{isSpeaking ? t(language, 'stopAudio') : t(language, 'listenAdvice')}</span>
            </button>
          </div>
        </div>

        <p className="text-slate-800 text-sm leading-relaxed font-medium bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
          {result.reasoning}
        </p>

        {/* Patient Clarifying Answers (if any) */}
        {result.clarifying_answers && result.clarifying_answers.length > 0 && (
          <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 text-xs space-y-1">
            <span className="text-[10px] font-extrabold text-sky-900 uppercase tracking-wider block">
              Clarifications Included:
            </span>
            {result.clarifying_answers.map((qa, i) => (
              <p key={i} className="text-slate-700 leading-snug">
                • <strong>{qa.question}:</strong> <span className="text-sky-800 font-bold">{qa.answer}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Identified Symptoms Pill Cloud */}
      <div className="glass-card p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
          {t(language, 'detectedSymptoms')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {result.detected_symptoms.map((sym, i) => (
            <span key={i} className="bg-sky-50 text-sky-900 border border-sky-100 font-bold px-3 py-1 rounded-xl text-xs">
              ✓ {sym}
            </span>
          ))}
        </div>
        {result.duration && (
          <p className="mt-2.5 text-xs font-semibold text-slate-600 bg-slate-50 inline-block px-3 py-1 rounded-xl border border-slate-100">
            ⏱ {t(language, 'duration')}: <strong className="text-slate-900">{result.duration}</strong>
          </p>
        )}
      </div>

      {/* Doctor Appointment Preparation Checklist */}
      <div className="bg-emerald-50/60 p-4 rounded-3xl border border-emerald-100 text-xs text-emerald-950 space-y-1.5">
        <span className="font-extrabold uppercase text-[10px] tracking-wider text-emerald-800 flex items-center gap-1">
          <span>🩺</span>
          <span>Doctor Consultation Preparation Tips</span>
        </span>
        <p className="leading-relaxed font-medium">
          • Carry any past prescriptions or medicines you are currently taking.
        </p>
        <p className="leading-relaxed font-medium">
          • If visiting a Government hospital, keep your <strong>Aadhaar</strong> or <strong>Ayushman Bharat Card</strong> ready for free care.
        </p>
        <p className="leading-relaxed font-medium">
          • Show the <strong>Doctor Summary Card</strong> on the next screen to save time.
        </p>
      </div>

      {/* Medical Safety Disclaimer */}
      <Disclaimer lang={language} />

      {/* Fixed Bottom Action Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 z-20 max-w-md mx-auto shadow-2xl flex flex-col gap-2.5">
        <button
          onClick={() => router.push('/clinics')}
          type="button"
          className="w-full bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-600 text-white font-black text-base py-3.5 rounded-2xl shadow-lg shadow-sky-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 hover:brightness-105 min-h-[52px]"
        >
          <span>📍</span>
          <span>{t(language, 'findClinics')} &rarr;</span>
        </button>

        <button
          onClick={() => router.push('/summary')}
          type="button"
          className="w-full bg-white text-slate-800 border border-slate-200 font-extrabold text-xs py-2.5 rounded-xl active:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
        >
          <span>📋</span>
          <span>{t(language, 'generateSummary')}</span>
        </button>
      </div>

    </main>
  );
}
