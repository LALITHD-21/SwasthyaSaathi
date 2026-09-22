'use client';

import React from 'react';
import { Language } from '@/types';
import { t } from '@/lib/i18n';

interface DisclaimerProps {
  lang: Language;
}

export default function Disclaimer({ lang }: DisclaimerProps) {
  return (
    <div className="glass-card bg-amber-50/70 border border-amber-200/80 rounded-3xl p-4 flex gap-3 text-amber-950 shadow-xs">
      <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
      <p className="text-xs font-semibold leading-relaxed">
        {t(lang, 'disclaimer')}
      </p>
    </div>
  );
}
