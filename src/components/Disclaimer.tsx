'use client';

import React from 'react';
import { Language } from '@/types';
import { t } from '@/lib/i18n';

interface DisclaimerProps {
  lang: Language;
}

export default function Disclaimer({ lang }: DisclaimerProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 mt-6">
      <span className="text-xl">⚠️</span>
      <p className="text-sm font-medium leading-relaxed">
        {t(lang, 'disclaimer')}
      </p>
    </div>
  );
}
