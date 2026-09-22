"use client";

import { useState, useCallback, useEffect } from "react";

interface GeolocationReturn {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  localityName: string | null;
  error: string | null;
  loading: boolean;
  isLiveGps: boolean;
  requestLocation: () => void;
  setLocation: (lat: number, lng: number, localityName?: string) => void;
}

export function useGeolocation(): GeolocationReturn {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [localityName, setLocalityName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLiveGps, setIsLiveGps] = useState(false);

  // Reverse geocode lat/lng to human locality
  const resolveLocality = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(`/api/location?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.locality) return data.locality;
      }
    } catch {
      // ignore
    }
    return `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
  }, []);

  // Set location manually (e.g. city picker or search)
  const setLocation = useCallback((lat: number, lng: number, name?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setAccuracy(null);
    setIsLiveGps(false);
    setError(null);
    if (name) {
      setLocalityName(name);
    } else {
      resolveLocality(lat, lng).then(setLocalityName);
    }
  }, [resolveLocality]);

  // Request high-accuracy real-time GPS with IP fallback
  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    const fallbackToIp = async () => {
      try {
        const res = await fetch('/api/location?action=ip');
        if (res.ok) {
          const data = await res.json();
          if (data.lat && data.lng) {
            setLatitude(data.lat);
            setLongitude(data.lng);
            setLocalityName(data.locality || `${data.city}, ${data.region}`);
            setAccuracy(null);
            setIsLiveGps(false);
            setError('Using IP-based estimated location (Turn on GPS for 10m accuracy)');
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      // Hard fallback to Bengaluru centroid
      setLatitude(12.9716);
      setLongitude(77.5946);
      setLocalityName('Bengaluru, Karnataka');
      setAccuracy(null);
      setIsLiveGps(false);
      setLoading(false);
    };

    if (typeof window === 'undefined' || !navigator.geolocation) {
      fallbackToIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy);

        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        setIsLiveGps(true);
        setError(null);

        const resolved = await resolveLocality(lat, lng);
        setLocalityName(resolved);
        setLoading(false);
      },
      (err) => {
        console.warn('GPS error or denied:', err.message);
        fallbackToIp();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Force real-time measurement
      }
    );
  }, [resolveLocality]);

  // Auto-request location on initial mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    latitude,
    longitude,
    accuracy,
    localityName,
    error,
    loading,
    isLiveGps,
    requestLocation,
    setLocation,
  };
}
