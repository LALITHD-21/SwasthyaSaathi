'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { t } from '@/lib/i18n';

interface TelegramBotCardProps {
  compact?: boolean;
}

export default function TelegramBotCard({ compact = false }: TelegramBotCardProps) {
  const { language } = useLanguage();
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'SwasthyaSaathi_bot';
  const telegramUrl = `https://t.me/${botUsername}`;

  if (compact) {
    return (
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-gradient-to-r from-[#229ED9]/10 to-sky-100/60 border border-[#229ED9]/30 rounded-2xl p-3 flex items-center justify-between gap-3 hover:bg-[#229ED9]/15 transition-all group active:scale-98 shadow-xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-[#229ED9] text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-xs">
            ✈️
          </span>
          <div className="text-left truncate">
            <span className="text-xs font-bold text-sky-950 block truncate">
              {t(language, 'telegramBotTitle')}
            </span>
            <span className="text-[10px] text-sky-800 font-medium block truncate">
              {t(language, 'telegramBotDesc')}
            </span>
          </div>
        </div>
        <span className="text-xs font-bold text-[#229ED9] group-hover:translate-x-0.5 transition-transform flex-shrink-0 bg-white px-2.5 py-1 rounded-lg border border-[#229ED9]/20 shadow-2xs">
          Open &rarr;
        </span>
      </a>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-white via-sky-50/50 to-blue-50/40 rounded-3xl p-4 sm:p-5 border border-[#229ED9]/30 shadow-sm relative overflow-hidden text-left">
      {/* Background Decorative Telegram Logo Accent */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#229ED9]/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2AABEE] to-[#229ED9] text-white flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
          ✈️
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
              {t(language, 'telegramBotTitle')}
            </h3>
            <span className="bg-[#229ED9]/10 text-[#1785B8] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              24x7 Bot
            </span>
          </div>

          <p className="text-xs text-gray-600 mt-1 leading-relaxed font-medium">
            {t(language, 'telegramBotDesc')}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#229ED9] hover:bg-[#1C8CC4] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs active:scale-95 transition-all"
            >
              <span>{t(language, 'openTelegramBot')}</span>
              <span className="text-sm">&rarr;</span>
            </a>

            <span className="text-[11px] text-gray-400 font-medium">
              Free • Zero App Download
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
