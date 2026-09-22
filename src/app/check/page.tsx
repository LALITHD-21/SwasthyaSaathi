'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import MicButton from '@/components/MicButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import PhotoUploadButton from '@/components/PhotoUploadButton';
import ClarifyingQuestionsModal from '@/components/ClarifyingQuestionsModal';
import { useSpeechToText, SupportedLang } from '@/hooks/useSpeechToText';
import { checkEmergency } from '@/lib/redflags';
import { t } from '@/lib/i18n';
import { COMMON_SYMPTOMS, SymptomPreset } from '@/lib/symptomPresets';
import { ClarifyingQuestion, ClarifyingAnswer } from '@/types';

export default function CheckPage() {
  const router = useRouter();
  const { language, speechLangCode } = useLanguage();
  
  const [mode, setMode] = useState<'voice' | 'type'>('voice');
  const [manualText, setManualText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Multimodal Photo state
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);

  // Multi-Turn Clarifying Questions state
  const [pendingQuestions, setPendingQuestions] = useState<ClarifyingQuestion[] | null>(null);

  const {
    isListening,
    transcript,
    errorCode: speechErrorCode,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText(speechLangCode as SupportedLang);

  // Sync speech transcript into manualText
  useEffect(() => {
    if (transcript) {
      setManualText(transcript);
      setSelectedPresetId(null);
    }
  }, [transcript]);

  const activeText = manualText.trim();
  const hasInput = !!activeText || !!imageBase64;

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      setSubmitError(null);
      startListening();
    }
  };

  const handleSelectPreset = (preset: SymptomPreset) => {
    const text = preset.fullText[language] || preset.fullText.en;
    setManualText(text);
    setSelectedPresetId(preset.id);
    resetTranscript();
    setSubmitError(null);
  };

  const handleClear = () => {
    setManualText('');
    setSelectedPresetId(null);
    setImageBase64(null);
    setImageMimeType(null);
    resetTranscript();
  };

  const handleImageSelected = (base64: string | null, mime: string | null) => {
    setImageBase64(base64);
    setImageMimeType(mime);
    if (base64 && !manualText) {
      setManualText('Attached photo of affected area for AI visual examination');
    }
  };

  // Step 1: Initial check & fetch clarifying questions
  const handleInitiateTriage = async () => {
    if (!hasInput) return;

    const textToAnalyze = activeText || 'Patient submitted a photo of the affected area.';

    // Check emergency red-flags
    const hasEmergency = checkEmergency(textToAnalyze);
    if (hasEmergency) {
      sessionStorage.setItem('emergencyTrigger', textToAnalyze);
      router.push('/emergency');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if clarifying questions can help
      const res = await fetch('/api/triage/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: textToAnalyze,
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

      // If no questions generated, finalize triage directly
      await executeFinalTriage([]);
    } catch {
      // Fallback directly to final triage
      await executeFinalTriage([]);
    }
  };

  // Step 2: Finalize triage with answers
  const executeFinalTriage = async (answers: ClarifyingAnswer[]) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setPendingQuestions(null);

    const textToAnalyze = activeText || 'Patient submitted a photo of the affected area.';

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      if (result.error) {
        throw new Error(result.error);
      }

      // Check if Gemini detected red flag in photo or answers
      if (result.red_flag_triggered) {
        sessionStorage.setItem('emergencyTrigger', textToAnalyze);
        router.push('/emergency');
        return;
      }

      // Save state
      sessionStorage.setItem('triageResult', JSON.stringify(result));
      sessionStorage.setItem('transcript', textToAnalyze);
      sessionStorage.setItem('language', language);
      if (imageBase64) {
        sessionStorage.setItem('attachedImage', imageBase64);
      } else {
        sessionStorage.removeItem('attachedImage');
      }

      router.push('/results');
    } catch (err: any) {
      console.error(err);
      setSubmitError('Unable to analyze symptoms right now. Please check your internet connection and try again.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <main className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50 to-white text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-sky-100 flex flex-col items-center max-w-sm w-full">
          <LoadingSpinner text={t(language, 'analyzing')} />
          <p className="text-xs text-gray-500 mt-4 animate-pulse font-medium">
            {imageBase64
              ? 'Analyzing visual features & symptoms with Gemini Vision...'
              : 'Checking urgency & matching the right specialist doctor...'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col p-4 sm:p-6 pb-28 gap-5 bg-gradient-to-b from-sky-50 via-white to-sky-50">
      
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

        <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
          Step 1 of 4 • Symptom Intake
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-sky-100/70 p-1.5 rounded-2xl flex gap-1 shadow-inner">
        <button
          onClick={() => setMode('voice')}
          type="button"
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            mode === 'voice'
              ? 'bg-white text-sky-900 shadow-md scale-[1.02]'
              : 'text-sky-700 hover:text-sky-900'
          }`}
        >
          {t(language, 'voiceTab')}
        </button>
        <button
          onClick={() => setMode('type')}
          type="button"
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            mode === 'type'
              ? 'bg-white text-sky-900 shadow-md scale-[1.02]'
              : 'text-sky-700 hover:text-sky-900'
          }`}
        >
          {t(language, 'typeTab')}
        </button>
      </div>

      {/* Voice Mode View */}
      {mode === 'voice' && (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
            {isListening ? t(language, 'listening') : t(language, 'tapToSpeak')}
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mb-3">
            Speak in Hindi, Kannada, or English. Tap again when finished.
          </p>

          <MicButton
            isListening={isListening}
            onClick={handleToggleMic}
            size="lg"
          />

          {/* Real-Time Audio Waves Indicator */}
          {isListening && (
            <div className="flex items-center gap-1.5 my-3.5 bg-rose-50 px-4 py-2 rounded-full border border-rose-200 shadow-2xs">
              <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:0.25s]" />
              <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-7 bg-rose-500 rounded-full animate-bounce [animation-delay:0.35s]" />
              <span className="w-1.5 h-3.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="text-xs font-bold text-rose-700 ml-1">Recording Audio...</span>
            </div>
          )}

          {speechErrorCode === 'network' && (
            <div className="mt-4 bg-amber-50 text-amber-900 p-3.5 rounded-2xl text-xs font-medium border border-amber-200 flex items-center gap-2.5 text-left shadow-sm">
              <span className="text-xl flex-shrink-0">💡</span>
              <p>{t(language, 'speechNetworkHelp')}</p>
            </div>
          )}

          {!isSupported && (
            <div className="mt-4 bg-amber-50 text-amber-900 p-3.5 rounded-2xl text-xs font-medium border border-amber-200 text-left">
              {t(language, 'speechNotSupported')}
            </div>
          )}
        </div>
      )}

      {/* Symptoms Display / Text Input Area */}
      <div className="bg-white border-2 border-sky-100 rounded-3xl p-4 shadow-sm relative transition-all duration-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-50">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {t(language, 'symptoms')}
          </span>
          {hasInput && (
            <button
              onClick={handleClear}
              type="button"
              className="text-xs text-rose-500 font-semibold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          value={manualText}
          onChange={(e) => {
            setManualText(e.target.value);
            setSelectedPresetId(null);
          }}
          placeholder={t(language, 'typePlaceholder')}
          className="w-full text-gray-800 text-base sm:text-lg leading-relaxed resize-none focus:outline-none placeholder:text-gray-300 min-h-[90px]"
          rows={3}
        />
      </div>

      {/* Multimodal Photo Upload Section */}
      <PhotoUploadButton
        imagePreview={imageBase64}
        onImageSelected={handleImageSelected}
      />

      {submitError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium border border-red-200 text-center animate-fade-in shadow-sm">
          {submitError}
        </div>
      )}

      {/* One-Tap Common Symptom Cards */}
      <div className="mt-1">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span>✨</span>
          <span>{t(language, 'quickChipsTitle')}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_SYMPTOMS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                type="button"
                className={`text-left p-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2.5 active:scale-98 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                    : preset.isEmergency
                    ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100/70'
                    : 'bg-white text-gray-800 border-gray-200/90 hover:border-sky-300 hover:bg-sky-50/50 shadow-sm'
                }`}
              >
                <span className="text-lg flex-shrink-0">{preset.icon}</span>
                <span className="leading-tight flex-1 font-semibold">
                  {preset.label[language] || preset.label.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      {hasInput && !isListening && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-sky-100 z-20 max-w-md mx-auto shadow-2xl animate-slide-up">
          <button
            onClick={handleInitiateTriage}
            type="button"
            className="w-full bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white font-extrabold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-sky-300 active:scale-98 transition-all flex items-center justify-center gap-3 min-h-[56px] cursor-pointer hover:brightness-105"
          >
            <span>{t(language, 'submit')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
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
