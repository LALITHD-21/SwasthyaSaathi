'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import ClinicCard from '@/components/ClinicCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Clinic, TriageResult, FacilityCategory } from '@/types';
import { t } from '@/lib/i18n';

const POPULAR_HUBS = [
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376 },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { name: 'Hubballi', lat: 15.3647, lng: 75.1240 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
];

export default function ClinicsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    latitude,
    longitude,
    accuracy,
    localityName,
    error: geoError,
    loading: geoLoading,
    isLiveGps,
    requestLocation,
    setLocation,
  } = useGeolocation();

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [specialist, setSpecialist] = useState<string>('general_physician');
  const [filterCategory, setFilterCategory] = useState<FacilityCategory>('all');
  const [radiusKm, setRadiusKm] = useState<number>(6);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Retrieve specialist from triage result
  useEffect(() => {
    const saved = sessionStorage.getItem('triageResult');
    if (saved) {
      try {
        const result: TriageResult = JSON.parse(saved);
        if (result.recommended_specialist) {
          setSpecialist(result.recommended_specialist);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Fetch clinics when coordinates, specialist, or radius change
  useEffect(() => {
    if (latitude && longitude) {
      fetchClinics(latitude, longitude, specialist, radiusKm * 1000);
    }
  }, [latitude, longitude, specialist, radiusKm]);

  const fetchClinics = async (lat: number, lng: number, spec: string, radiusMeters: number) => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/clinics?lat=${lat}&lng=${lng}&specialist=${spec}&radius=${radiusMeters}`);
      if (!res.ok) throw new Error('Failed to fetch clinics');
      const data = await res.json();
      setClinics(data.clinics || []);
    } catch (err: any) {
      console.error(err);
      setFetchError('Unable to load facilities right now. Please tap retry below.');
    } finally {
      setLoading(false);
    }
  };

  // Location search handler
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingLocation(true);
    setShowSearchDropdown(true);
    try {
      const res = await fetch(`/api/location?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const selectSearchResult = (item: any) => {
    setLocation(item.lat, item.lng, item.name);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Filter facilities based on scheme selected
  const filteredClinics = clinics.filter((clinic) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'govt') return clinic.is_govt;
    if (filterCategory === 'ayushman') return clinic.is_ayushman_bharat;
    if (filterCategory === 'janaushadhi') return clinic.is_janaushadhi;
    return true;
  });

  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col p-4 sm:p-5 bg-gradient-to-b from-sky-50/80 via-white to-sky-50 gap-4 pb-32">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/results')}
          type="button"
          className="text-sky-800 font-semibold py-2 px-3 flex items-center gap-1.5 min-h-[44px] rounded-xl hover:bg-white/80 active:scale-95 transition-all text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>{t(language, 'back')}</span>
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full shadow-2xs">
          Step 3 of 4 • Nearby Care
        </span>
      </div>

      {/* Page Title */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {t(language, 'nearbyClinics')}
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Free Government PHCs, PM-JAY Ayushman Hospitals & Generic Pharmacies
        </p>
      </div>

      {/* Real-Time Location Card */}
      <div className="bg-white p-4 rounded-3xl border border-sky-200/90 shadow-sm flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-2xl bg-sky-100/80 text-sky-700 flex items-center justify-center text-lg flex-shrink-0 shadow-2xs">
              📍
            </span>
            <div className="text-left min-w-0 truncate">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Current Location:
              </span>
              <span className="text-sm font-extrabold text-gray-900 block truncate">
                {localityName || 'Detecting realtime location...'}
              </span>
            </div>
          </div>

          <button
            onClick={requestLocation}
            disabled={geoLoading}
            type="button"
            className="flex-shrink-0 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 py-1.5 px-3 rounded-xl border border-sky-200 active:scale-95 transition-all flex items-center gap-1"
            title="Refresh GPS"
          >
            <span className={geoLoading ? 'animate-spin inline-block' : ''}>🔄</span>
            <span>{geoLoading ? 'Locating...' : 'GPS'}</span>
          </button>
        </div>

        {/* Live GPS Accuracy & Status Note */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100">
          {isLiveGps ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Realtime GPS Active {accuracy ? `(±${accuracy}m)` : ''}</span>
            </span>
          ) : (
            <span className="text-amber-700 font-medium flex items-center gap-1">
              <span>●</span>
              <span>{geoError || 'Estimated Location'}</span>
            </span>
          )}

          {/* Radius Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-medium">Radius:</span>
            {[5, 10, 20].map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                type="button"
                className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
                  radiusKm === r
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        {/* Search Any Village, Town, or Pincode Form */}
        <form onSubmit={handleLocationSearch} className="relative mt-1">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search town, village, or PIN code..."
              className="flex-1 bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={isSearchingLocation}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl active:scale-95 shadow-2xs transition-all flex items-center gap-1"
            >
              <span>🔍</span>
              <span>{isSearchingLocation ? '...' : 'Find'}</span>
            </button>
          </div>

          {/* Dropdown Suggestions */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-sky-200 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1 text-left text-xs animate-fade-in">
              {searchResults.length === 0 && !isSearchingLocation ? (
                <div className="p-3 text-center text-gray-500 font-medium">
                  No places found. Try another district or spelling.
                </div>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSearchResult(item)}
                    className="w-full text-left p-2.5 hover:bg-sky-50 rounded-xl transition-colors border-b border-gray-50 last:border-none flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <strong className="block text-gray-900">{item.name}</strong>
                      <span className="text-[10px] text-gray-400 truncate block">{item.displayName}</span>
                    </div>
                    <span className="text-sky-600 font-bold flex-shrink-0">&rarr;</span>
                  </button>
                ))
              )}
            </div>
          )}
        </form>

        {/* Quick Indian City Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
          <span className="text-gray-400 self-center font-medium pr-1 text-[10px]">Quick:</span>
          {POPULAR_HUBS.map((hub) => (
            <button
              key={hub.name}
              type="button"
              onClick={() => setLocation(hub.lat, hub.lng, hub.name)}
              className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap border border-sky-100 active:scale-95 transition-all shadow-2xs"
            >
              {hub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills (Govt, PM-JAY, Jan Aushadhi) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          type="button"
          className={`py-2 px-3 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 ${
            filterCategory === 'all'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t(language, 'filterAll')} ({clinics.length})
        </button>

        <button
          onClick={() => setFilterCategory('govt')}
          type="button"
          className={`py-2 px-3 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 ${
            filterCategory === 'govt'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          {t(language, 'filterGovt')}
        </button>

        <button
          onClick={() => setFilterCategory('ayushman')}
          type="button"
          className={`py-2 px-3 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 ${
            filterCategory === 'ayushman'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          {t(language, 'filterAyushman')}
        </button>

        <button
          onClick={() => setFilterCategory('janaushadhi')}
          type="button"
          className={`py-2 px-3 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 ${
            filterCategory === 'janaushadhi'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          {t(language, 'filterJanaushadhi')}
        </button>
      </div>

      {/* Facilities List or States */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-sky-100 shadow-sm animate-pulse">
          <LoadingSpinner text={t(language, 'loadingClinics')} />
          <p className="text-xs text-gray-400 mt-2">
            Searching verified healthcare nodes around your coordinates...
          </p>
        </div>
      ) : fetchError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-3xl border border-red-100 shadow-sm">
          <div className="text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 w-full text-xs font-semibold">
            {fetchError}
          </div>
          <button
            onClick={() => latitude && longitude && fetchClinics(latitude, longitude, specialist, radiusKm * 1000)}
            type="button"
            className="bg-sky-600 text-white px-6 py-3 rounded-2xl font-bold active:scale-95 shadow-md text-xs"
          >
            🔄 Retry Search
          </button>
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-sky-100 shadow-sm text-gray-500">
          <span className="text-4xl mb-2">🏥</span>
          <p className="font-bold text-gray-800 text-sm">No centers match this filter in your area.</p>
          <p className="text-xs text-gray-400 mt-1">Try expanding the search radius or viewing all facilities.</p>
          <button
            onClick={() => {
              setFilterCategory('all');
              setRadiusKm(20);
            }}
            type="button"
            className="text-xs font-bold text-sky-600 hover:underline mt-3 bg-sky-50 py-2 px-4 rounded-xl border border-sky-200"
          >
            Expand Radius & View All Facilities
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {filteredClinics.length} Facilities Found
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Sorted nearest first ✓
            </span>
          </div>

          {filteredClinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      )}

      {/* Fixed Floating CTA to proceed to Doctor Summary Card */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-sky-100 z-20 max-w-md mx-auto shadow-2xl">
        <button
          onClick={() => router.push('/summary')}
          type="button"
          className="w-full bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white font-extrabold text-base py-3.5 rounded-2xl shadow-lg shadow-sky-200 active:scale-98 transition-all flex items-center justify-center gap-2 hover:brightness-105"
        >
          <span>📋</span>
          <span>{t(language, 'generateSummary')} &rarr;</span>
        </button>
      </div>

    </main>
  );
}
