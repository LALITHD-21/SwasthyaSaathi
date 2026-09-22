'use client';

import React from 'react';
import { UrgencyLevel, Language } from '@/types';
import { t, TranslationKeys } from '@/lib/i18n';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  size?: 'sm' | 'md' | 'lg';
  lang?: Language;
}

const URGENCY_CONFIG: Record<
  UrgencyLevel,
  {
    containerClass: string;
    dotClass: string;
    labelKey: TranslationKeys;
    icon: string;
  }
> = {
  mild: {
    containerClass:
      'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs shadow-emerald-500/10',
    dotClass: 'bg-emerald-500',
    labelKey: 'urgencyMild',
    icon: '🟢',
  },
  moderate: {
    containerClass:
      'bg-amber-50 text-amber-950 border border-amber-200/80 shadow-xs shadow-amber-500/10',
    dotClass: 'bg-amber-500',
    labelKey: 'urgencyModerate',
    icon: '🟡',
  },
  urgent: {
    containerClass:
      'bg-rose-50 text-rose-950 border border-rose-200/90 shadow-xs shadow-rose-500/15',
    dotClass: 'bg-rose-500',
    labelKey: 'urgencyUrgent',
    icon: '🔴',
  },
};

export default function UrgencyBadge({
  level,
  size = 'sm',
  lang = 'en',
}: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[level] || URGENCY_CONFIG.mild;

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-4 py-1.5 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base sm:text-lg gap-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-black tracking-tight select-none transition-all ${sizeClasses} ${config.containerClass}`}
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.dotClass}`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.dotClass}`}
        />
      </span>
      <span>{t(lang, config.labelKey)}</span>
    </span>
  );
}
