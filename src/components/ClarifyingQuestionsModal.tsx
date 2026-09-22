'use client';

import React, { useState } from 'react';
import { ClarifyingQuestion, ClarifyingAnswer } from '@/types';
import { useLanguage } from './LanguageProvider';
import { t } from '@/lib/i18n';

interface ClarifyingQuestionsModalProps {
  questions: ClarifyingQuestion[];
  onConfirm: (answers: ClarifyingAnswer[]) => void;
  onSkip: () => void;
}

export default function ClarifyingQuestionsModal({
  questions,
  onConfirm,
  onSkip,
}: ClarifyingQuestionsModalProps) {
  const { language } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleSelect = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleProceed = () => {
    const formatted: ClarifyingAnswer[] = questions.map((q) => ({
      questionId: q.id,
      question: q.question,
      answer: selectedAnswers[q.id] || 'Not specified',
    }));
    onConfirm(formatted);
  };

  const allAnswered = questions.every((q) => !!selectedAnswers[q.id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-sky-100 flex flex-col gap-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-2 bg-sky-100/70 rounded-2xl">
              🩺
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                {t(language, 'clarifyingTitle')}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {t(language, 'clarifyingSub')}
              </p>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex flex-col gap-4 my-1">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100/80 flex flex-col gap-2.5">
              <p className="text-sm font-extrabold text-gray-900 leading-snug">
                <span className="text-sky-600 mr-1.5 font-black">{idx + 1}.</span>
                {q.question}
              </p>

              {/* Options */}
              <div className="flex flex-wrap gap-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      type="button"
                      className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
          <button
            onClick={handleProceed}
            type="button"
            className="w-full bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white font-black text-base py-3.5 rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 hover:brightness-105"
          >
            <span>{allAnswered ? 'Confirm & View Results' : 'Proceed with Answers'}</span>
            <span>&rarr;</span>
          </button>

          <button
            onClick={onSkip}
            type="button"
            className="w-full text-xs font-bold text-gray-400 hover:text-gray-600 py-2 hover:underline"
          >
            {t(language, 'skipQuestions')}
          </button>
        </div>

      </div>
    </div>
  );
}
