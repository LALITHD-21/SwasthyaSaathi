'use client';

import React from 'react';
import { Clinic } from '@/types';
import { t } from '@/lib/i18n';
import { useLanguage } from './LanguageProvider';

interface ClinicCardProps {
  clinic: Clinic;
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const { language } = useLanguage();

  const handleDirections = () => {
    let query = '';
    if (clinic.lat && clinic.lng) {
      query = `${clinic.lat},${clinic.lng}`;
    } else {
      query = encodeURIComponent(`${clinic.name} ${clinic.address || ''}`);
    }
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  const typeIcon = clinic.is_janaushadhi
    ? '💊'
    : clinic.is_govt
    ? '🏛️'
    : clinic.type === 'hospital'
    ? '🏥'
    : '🩺';

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-md p-4 sm:p-5 border border-sky-100/90 flex flex-col gap-3 transition-all duration-200">
      
      {/* Top Header & Scheme Tag */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-3">
          <span className="text-2xl p-2 bg-sky-50 rounded-2xl flex-shrink-0">
            {typeIcon}
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
              {clinic.name}
            </h3>
            <p className="text-xs text-sky-800 font-semibold capitalize mt-0.5">
              {clinic.type} • <span className="text-emerald-700 font-bold">{clinic.distance_km} {t(language, 'km')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scheme & Affordability Badges */}
      <div className="flex flex-wrap gap-1.5">
        {clinic.is_govt && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
            🏛️ Govt PHC / Hospital (Free OPD)
          </span>
        )}

        {clinic.is_ayushman_bharat && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
            💳 Ayushman Bharat (PM-JAY)
          </span>
        )}

        {clinic.is_janaushadhi && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-300">
            💊 Jan Aushadhi (Generic 90% Off)
          </span>
        )}

        {clinic.pricing_note && (
          <span className="text-[10px] font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded-full">
            {clinic.pricing_note}
          </span>
        )}
      </div>
      
      {clinic.address && (
        <p className="text-xs text-gray-500 line-clamp-2 pl-1 font-medium leading-relaxed">
          📍 {clinic.address}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2.5 mt-1 pt-2 border-t border-gray-100">
        {clinic.phone ? (
          <a
            href={`tel:${clinic.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border border-emerald-200 active:scale-95 transition-all min-h-[46px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
            </svg>
            <span>{t(language, 'call')}</span>
          </a>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[11px] text-gray-400 bg-gray-50 py-3 rounded-2xl border border-gray-100 font-medium">
            Walk-in OPD
          </div>
        )}

        <button
          onClick={handleDirections}
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border border-sky-200 active:scale-95 transition-all min-h-[46px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
          </svg>
          <span>{t(language, 'directions')}</span>
        </button>
      </div>
    </div>
  );
}
