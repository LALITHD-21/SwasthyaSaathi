'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import MicButton from '@/components/MicButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import PhotoUploadButton from '@/components/PhotoUploadButton';
import ClarifyingQuestionsModal from '@/components/ClarifyingQuestionsModal';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { checkEmergency } from '@/lib/redflags';
import { COMMON_SYMPTOMS, SymptomPreset } from '@/lib/symptomPresets';
import { ClarifyingQuestion, ClarifyingAnswer } from '@/types';
import { t } from '@/lib/i18n';

export default function CheckPage() {
  const router = useRouter();
  const { language, speechLangCode } = useLanguage();

  // Mode: voice or manual typing
  const [mode, setMode] = useState<'voice' | 'type'>('voice');
  const [typedText, setTypedText] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Multimodal Vision
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);

  // Multi-Turn Clarifying Questions
  const [pendingQuestions, setPendingQuestions] = useState<ClarifyingQuestion[] | null>(null);

  // Submission & Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Recording Timer State
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const {
    transcript,
    isListening,
    isSupported,
    errorCode: speechErrorCode,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText(speechLangCode);

  // Recording timer effect
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const activeText = mode === 'voice' ? transcript : typedText;
  const hasInput = activeText.trim().length > 0 || !!imageBase64;

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      setSelectedPresetId(null);
      startListening();
    }
  };

  const handleSelectPreset = (preset: SymptomPreset) => {
    const text = preset.fullText[language] || preset.fullText.en;
    setSelectedPresetId(preset.id);
    setTypedText(text);
    setMode('type');

    if (preset.isEmergency) {
      router.push('/emergency');
    }
  };

  const handleClear = () => {
    resetTranscript();
    setTypedText('');
    setSelectedPresetId(null);
    setImageBase64(null);
    setImageMimeType(null);
  };

  const handleInitiateTriage = async () => {
    const textToAnalyze = activeText.trim();
    if (!textToAnalyze && !imageBase64) return;

    if (textToAnalyze && checkEmergency(textToAnalyze)) {
      router.push('/emergency');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/triage/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: textToAnalyze || 'Patient submitted a photo of the affected area.',
          language,
          imageBase64,
          imageMimeType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setIsSubmitting(false);
          setPendingQuestions(data.questions);
          return;
        }
      }

      await executeFinalTriage([]);
    } catch {
      await executeFinalTriage([]);
    }
  };

  const executeFinalTriage = async (answers: ClarifyingAnswer[]) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setPendingQuestions(null);

    const textToAnalyze = activeText.trim() || 'Patient submitted a photo of the affected area.';

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: textToAnalyze,
          language,
          imageBase64,
          imageMimeType,
          clarifyingAnswers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Triage service error');
      }

      const result = await response.json();

      sessionStorage.setItem('triageResult', JSON.stringify(result));
      sessionStorage.setItem('transcript', textToAnalyze);
      sessionStorage.setItem('language', language);
      if (imageBase64) {
        sessionStorage.setItem('attachedImage', imageBase64);
      } else {
        sessionStorage.removeItem('attachedImage');
      }

      if (result.red_flag_triggered) {
        router.push('/emergency');
      } else {
        router.push('/results');
      }
    } catch {
      setSubmitError('Unable to analyze right now. Please check your connection and tap retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (isSubmitting) {
    return (
      <main className="max-w-md mx-auto min-h-[calc(100dvh-60px)] flex flex-col justify-center items-center p-6 text-center animate-fade-in">
        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm w-full shadow-2xl">
          <LoadingSpinner text={t(language, 'analyzing')} />
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <p className="text-xs font-bold text-slate-500">
              Evaluating symptoms & matching specialist doctor...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto min-h-[calc(100dvh-60px)] flex flex-col p-4 sm:p-5 pb-32 gap-4 animate-fade-in">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          type="button"
          className="text-slate-700 hover:text-slate-900 font-bold py-2 px-3 flex items-center gap-1.5 rounded-xl hover:bg-white/80 active:scale-95 transition-all text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>{t(language, 'back')}</span>
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
          Step 1 of 4 • Symptom Intake
        </span>
      </div>

      {/* Mode Switcher Segmented Control */}
      <div className="bg-slate-200/60 p-1 rounded-2xl flex gap-1 shadow-inner">
        <button
          onClick={() => setMode('voice')}
          type="button"
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
            mode === 'voice'
              ? 'bg-white text-slate-900 shadow-sm scale-[1.01]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🎙️</span>
          <span>{t(language, 'voiceTab')}</span>
        </button>

        <button
          onClick={() => setMode('type')}
          type="button"
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
            mode === 'type'
              ? 'bg-white text-slate-900 shadow-sm scale-[1.01]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>⌨️</span>
          <span>{t(language, 'typeTab')}</span>
        </button>
      </div>

      {/* Voice Mode View */}
      {mode === 'voice' && (
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center gap-3 relative overflow-hidden shadow-sm">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {isListening ? t(language, 'listening') : t(language, 'tapToSpeak')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Speak in Hindi, Kannada, or English. Tap again when finished.
            </p>
          </div>

          {/* Animated Mic Console */}
          <div className="my-2 relative">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping pointer-events-none scale-125" />
            )}
            <MicButton
              isListening={isListening}
              onClick={handleToggleMic}
              size="lg"
            />
          </div>

          {/* Recording Timer & Waveform Equalizer */}
          {isListening && (
            <div className="flex items-center gap-3 bg-rose-50 px-4 py-2 rounded-full border border-rose-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-black text-rose-700 font-mono tracking-wider">
                {formatTime(recordingSeconds)}
              </span>
              <div className="flex items-center gap-1 h-5">
                <span className="w-1 bg-rose-500 rounded-full animate-wave-1" />
                <span className="w-1 bg-rose-500 rounded-full animate-wave-2" />
                <span className="w-1 bg-rose-500 rounded-full animate-wave-3" />
                <span className="w-1 bg-rose-500 rounded-full animate-wave-4" />
                <span className="w-1 bg-rose-500 rounded-full animate-wave-5" />
              </div>
            </div>
          )}

          {speechErrorCode === 'network' && (
            <div className="mt-2 bg-amber-50 text-amber-900 p-3 rounded-2xl text-xs font-medium border border-amber-200 flex items-center gap-2 text-left">
              <span className="text-lg">💡</span>
              <p>{t(language, 'speechNetworkHelp')}</p>
            </div>
          )}

          {!isSupported && (
            <div className="mt-2 bg-amber-50 text-amber-900 p-3 rounded-2xl text-xs font-medium border border-amber-200 text-left">
              {t(language, 'speechNotSupported')}
            </div>
          )}
        </div>
      )}

      {/* Multimodal Live Camera & Image Attachment */}
      <div className="glass-card p-3.5 rounded-3xl border border-sky-100">
        <PhotoUploadButton
          imagePreview={imageBase64}
          onImageSelected={(base64, mime) => {
            setImageBase64(base64);
            setImageMimeType(mime);
          }}
        />
      </div>

      {/* Symptoms Display / Text Input Area */}
      <div className="glass-card rounded-3xl p-4 shadow-sm border border-slate-200/80 transition-all focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <span>📝</span>
            <span>{t(language, 'symptoms')} Statement</span>
          </span>
          {hasInput && (
            <button
              onClick={handleClear}
              type="button"
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {mode === 'voice' ? (
          <div className="min-h-[90px] text-sm text-slate-800 leading-relaxed font-medium">
            {transcript ? (
              <p className="italic text-slate-900">&ldquo;{transcript}&rdquo;</p>
            ) : (
              <p className="text-slate-400 text-xs italic">
                Your spoken symptoms will appear here in real time...
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder={t(language, 'typePlaceholder')}
            rows={3}
            className="w-full text-sm text-slate-800 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none leading-relaxed font-medium"
          />
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-semibold">
          <span>{activeText.length} characters</span>
          <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md uppercase font-bold">
            Language: {language}
          </span>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs font-semibold border border-red-200 text-center animate-fade-in shadow-sm">
          {submitError}
        </div>
      )}

      {/* One-Tap Common Symptom Cards */}
      <div className="mt-1">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <span>✨</span>
            <span>{t(language, 'quickChipsTitle')}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">1-Tap Fill</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {COMMON_SYMPTOMS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                type="button"
                className={`text-left p-3 rounded-2xl border text-xs font-bold transition-all duration-200 flex items-center gap-2.5 active:scale-98 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-[1.02]'
                    : preset.isEmergency
                    ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100/80 shadow-2xs'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:border-sky-300 hover:bg-sky-50/50 shadow-2xs'
                }`}
              >
                <span className="text-lg flex-shrink-0">{preset.icon}</span>
                <span className="leading-tight flex-1 truncate">
                  {preset.label[language] || preset.label.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      {hasInput && !isListening && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 z-20 max-w-md mx-auto shadow-2xl animate-slide-up">
          <button
            onClick={handleInitiateTriage}
            type="button"
            className="w-full bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-600 text-white font-black text-base py-4 px-6 rounded-2xl shadow-lg shadow-sky-500/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 min-h-[56px] hover:brightness-105 animate-shimmer"
          >
            <span>{t(language, 'submit')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      )}

      {/* Multi-Turn Clarifying Questions Interactive Modal */}
      {pendingQuestions && pendingQuestions.length > 0 && (
        <ClarifyingQuestionsModal
          questions={pendingQuestions}
          onConfirm={(answers) => executeFinalTriage(answers)}
          onSkip={() => executeFinalTriage([])}
        />
      )}

    </main>
  );
}
