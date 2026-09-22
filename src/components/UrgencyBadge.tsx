'use client';

import React from 'react';
import { UrgencyLevel, Language } from '@/types';
import { t, TranslationKeys } from '@/lib/i18n';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  size?: 'sm' | 'lg';
  lang?: Language;
}

const URGENCY_CONFIG: Record<UrgencyLevel, { bg: string; icon: string; labelKey: TranslationKeys }> = {
  mild: {
    bg: 'bg-green-100 text-green-800 border-green-200',
    icon: '🟢',
    labelKey: 'urgencyMild',
  },
  moderate: {
    bg: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: '🟡',
    labelKey: 'urgencyModerate',
  },
  urgent: {
    bg: 'bg-red-100 text-red-800 border-red-200',
    icon: '🔴',
    labelKey: 'urgencyUrgent',
  },
};

export default function UrgencyBadge({ level, size = 'sm', lang = 'en' }: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[level] || URGENCY_CONFIG.mild;
  const padding = size === 'lg' ? 'px-6 py-3 text-xl' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border font-bold ${padding} ${config.bg}`}>
      <span>{config.icon}</span>
      <span>{t(lang, config.labelKey)}</span>
    </span>
  );
}
