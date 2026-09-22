'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import UrgencyBadge from '@/components/UrgencyBadge';
import Disclaimer from '@/components/Disclaimer';
import { TriageResult, SPECIALIST_LABELS, SPECIALIST_ICONS, SpecialistType } from '@/types';
import { t } from '@/lib/i18n';
import Link from 'next/link';

export default function ResultsPage() {
  const router = useRouter();
  const { language, speechLangCode } = useLanguage();
  const [result, setResult] = useState<TriageResult | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Text-To-Speech function
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
    utterance.rate = 0.9;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const urgencyStyles = {
    mild: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950',
    moderate: 'from-amber-50 to-orange-50 border-amber-200 text-amber-950',
    urgent: 'from-red-50 to-rose-50 border-red-200 text-red-950',
  }[result.urgency_level] || 'from-sky-50 to-white border-sky-200 text-sky-950';

  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col p-4 sm:p-6 pb-36 gap-5 bg-gradient-to-b from-sky-50/70 via-white to-sky-50">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/check')}
          type="button"
          className="text-sky-800 font-semibold py-2 px-3 flex items-center gap-1.5 min-h-[44px] rounded-xl hover:bg-white/80 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t(language, 'back')}
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
          Step 2 of 4 • AI Assessment
        </span>
      </div>

      {/* Urgency Badge Hero Card */}
      <div className={`p-5 rounded-3xl border shadow-sm bg-gradient-to-b ${urgencyStyles} flex flex-col items-center text-center gap-2`}>
        <span className="text-xs font-black uppercase tracking-wider opacity-75">
          {t(language, 'urgency')}
        </span>
        <UrgencyBadge level={result.urgency_level} size="lg" lang={language} />
        <p className="text-xs opacity-75 mt-1 font-medium">
          {result.urgency_level === 'urgent'
            ? 'Immediate clinical attention is recommended.'
            : result.urgency_level === 'moderate'
            ? 'Consult a doctor within 24-48 hours for clinical evaluation.'
            : 'Mild symptoms. Rest, monitor, and consult if conditions persist.'}
        </p>
      </div>

      {/* Multimodal Photo & Visual Observations (if image was submitted) */}
      {attachedImage && (
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-sky-800 uppercase tracking-wider">
              {t(language, 'visualObservations')}
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Gemini Vision Inspected ✓
            </span>
          </div>

          <div className="flex gap-4 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${attachedImage}`}
              alt="Submitted symptom"
              className="w-20 h-20 object-cover rounded-2xl border border-sky-200 shadow-sm flex-shrink-0"
            />
            <div className="flex-1 text-xs text-gray-700 space-y-1">
              {result.visual_observations && result.visual_observations.length > 0 ? (
                result.visual_observations.map((obs, idx) => (
                  <p key={idx} className="font-semibold text-gray-800">
                    • {obs}
                  </p>
                ))
              ) : (
                <p className="font-medium text-gray-600">
                  Visual characteristics analyzed alongside patient symptom notes.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recommended Specialist Card */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100 flex flex-col gap-3">
        <h2 className="text-xs font-bold text-sky-800 uppercase tracking-wider">
          {t(language, 'recommendedSpecialist')}
        </h2>
        
        <div className="flex items-center gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
          <span className="text-4xl p-2 bg-white rounded-2xl shadow-sm">
            {SPECIALIST_ICONS[specialistKey] || '🩺'}
          </span>
          <div>
            <p className="text-xs text-gray-500 font-medium">Consult with a</p>
            <p className="text-xl font-extrabold text-gray-900">
              {SPECIALIST_LABELS[specialistKey] || result.recommended_specialist}
            </p>
          </div>
        </div>
      </section>

      {/* AI Reasoning / Advice Card with Audio Speaker */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            AI Guidance
          </h2>
          <button
            onClick={handleToggleSpeech}
            type="button"
            className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-full transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
            }`}
          >
            <span>{isSpeaking ? '⏹' : '🔊'}</span>
            <span>{isSpeaking ? t(language, 'stopAudio') : t(language, 'listenAdvice')}</span>
          </button>
        </div>

        <p className="text-gray-800 text-base leading-relaxed font-medium bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
          {result.reasoning}
        </p>

        {/* Patient Clarifying Q&A (if multi-turn questions were answered) */}
        {result.clarifying_answers && result.clarifying_answers.length > 0 && (
          <div className="mt-2 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1.5">
            <span className="font-bold text-gray-500 uppercase tracking-wider block text-[10px]">
              Clarifications Factored In:
            </span>
            {result.clarifying_answers.map((qa, i) => (
              <p key={i} className="leading-snug">
                <strong className="text-gray-800 font-semibold">{qa.question}:</strong>{' '}
                <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-md">{qa.answer}</span>
              </p>
            ))}
          </div>
        )}
      </section>

      {/* Detected Symptoms Pills */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100">
        <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
          {t(language, 'detectedSymptoms')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {result.detected_symptoms.map((sym, i) => (
            <span key={i} className="bg-sky-50 text-sky-800 border border-sky-100 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold">
              • {sym}
            </span>
          ))}
        </div>
        {result.duration && (
          <p className="mt-3 text-xs font-semibold text-gray-600 bg-gray-50 inline-block px-3 py-1.5 rounded-xl border border-gray-100">
            ⏱ {t(language, 'duration')}: {result.duration}
          </p>
        )}
      </section>

      {/* Disclaimer */}
      <Disclaimer lang={language} />

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-sky-100 z-20 max-w-md mx-auto shadow-2xl flex flex-col gap-2.5">
        <button
          onClick={() => router.push('/clinics')}
          type="button"
          className="w-full bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-sky-200 active:scale-98 transition-all flex items-center justify-center gap-2 min-h-[56px] hover:brightness-105"
        >
          <span>📍</span>
          <span>{t(language, 'findClinics')}</span>
        </button>

        <button
          onClick={() => router.push('/summary')}
          type="button"
          className="w-full bg-white text-sky-800 border-2 border-sky-200 font-bold text-base py-3 rounded-2xl active:bg-sky-50 transition-all flex items-center justify-center gap-2 min-h-[48px]"
        >
          <span>📋</span>
          <span>{t(language, 'generateSummary')}</span>
        </button>
      </div>

    </main>
  );
}
