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

  const typeMeta = clinic.is_janaushadhi
    ? { icon: '💊', bg: 'bg-purple-100/80 text-purple-700', label: 'Jan Aushadhi' }
    : clinic.is_govt
    ? { icon: '🏛️', bg: 'bg-emerald-100/80 text-emerald-800', label: 'Govt PHC' }
    : clinic.type === 'hospital'
    ? { icon: '🏥', bg: 'bg-sky-100/80 text-sky-800', label: 'Hospital' }
    : { icon: '🩺', bg: 'bg-cyan-100/80 text-cyan-800', label: 'Clinic' };

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 flex flex-col gap-3 group">
      
      {/* Top Header & Distance */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-2xl ${typeMeta.bg} flex items-center justify-center text-xl flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
            {typeMeta.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 leading-snug truncate">
              {clinic.name}
            </h3>
            <p className="text-xs text-slate-500 font-semibold capitalize mt-0.5 flex items-center gap-1.5">
              <span>{clinic.type}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-emerald-700 font-extrabold">
                {clinic.distance_km} {t(language, 'km')}
              </span>
            </p>
          </div>
        </div>

        {/* Distance Pill */}
        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-black text-[11px] px-2.5 py-1 rounded-full flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{clinic.distance_km} km</span>
        </span>
      </div>

      {/* Public Health Scheme & Affordability Badges */}
      <div className="flex flex-wrap gap-1.5">
        {clinic.is_govt && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 py-0.5 rounded-full shadow-2xs">
            🏛️ Govt PHC (Free OPD)
          </span>
        )}

        {clinic.is_ayushman_bharat && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/90 px-2.5 py-0.5 rounded-full shadow-2xs">
            💳 Ayushman Bharat (PM-JAY)
          </span>
        )}

        {clinic.is_janaushadhi && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-900 border border-purple-200/90 px-2.5 py-0.5 rounded-full shadow-2xs">
            💊 Jan Aushadhi (Generic 90% Off)
          </span>
        )}

        {clinic.pricing_note && (
          <span className="text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-100 px-2.5 py-0.5 rounded-full">
            {clinic.pricing_note}
          </span>
        )}
      </div>
      
      {/* Physical Address */}
      {clinic.address && (
        <p className="text-xs text-slate-500 line-clamp-2 pl-0.5 font-medium leading-relaxed flex items-start gap-1.5">
          <span className="text-slate-400 mt-0.5 flex-shrink-0">📍</span>
          <span>{clinic.address}</span>
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1 pt-3 border-t border-slate-100">
        {clinic.phone ? (
          <a
            href={`tel:${clinic.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-2xl font-black text-xs shadow-sm shadow-emerald-500/20 active:scale-95 transition-all min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
            </svg>
            <span>{t(language, 'call')}</span>
          </a>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[11px] text-slate-400 bg-slate-50 py-2.5 rounded-2xl border border-slate-100 font-bold">
            Walk-in OPD
          </div>
        )}

        <button
          onClick={handleDirections}
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-3 rounded-2xl font-black text-xs shadow-sm shadow-slate-900/20 active:scale-95 transition-all min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <span>{t(language, 'directions')}</span>
        </button>
      </div>
    </div>
  );
}
