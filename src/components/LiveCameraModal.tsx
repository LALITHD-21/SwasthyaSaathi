'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from './LanguageProvider';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (base64Data: string, mimeType: string) => void;
}

export default function LiveCameraModal({
  isOpen,
  onClose,
  onPhotoCaptured,
}: LiveCameraModalProps) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Stop active camera stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Start live camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    stopStream();
    setIsInitializing(true);
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser.');
      } else {
        setCameraError('Unable to open camera. You can upload an existing image instead.');
      }
    } finally {
      setIsInitializing(false);
    }
  }, [stopStream]);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode);
    } else if (!isOpen) {
      stopStream();
      setCapturedImage(null);
      setCameraError(null);
    }
    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, capturedImage, startCamera, stopStream]);

  // Flip between front and back camera
  const handleToggleFacing = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  // Snap photo from video stream
  const handleSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const MAX_DIM = 1024;

    let width = video.videoWidth || 640;
    let height = video.videoHeight || 480;

    if (width > height && width > MAX_DIM) {
      height = Math.round((height * MAX_DIM) / width);
      width = MAX_DIM;
    } else if (height > MAX_DIM) {
      width = Math.round((width * MAX_DIM) / height);
      height = MAX_DIM;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      setCapturedImage(base64);
      stopStream();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage, 'image/jpeg');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-fade-in">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white z-10 pt-2">
        <span className="text-sm font-bold flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
          <span>📸</span>
          <span>Live Symptom Camera</span>
        </span>

        <button
          onClick={onClose}
          type="button"
          className="text-white bg-white/20 hover:bg-white/30 rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg"
        >
          ✕
        </button>
      </div>

      {/* Main Viewfinder / Image Preview */}
      <div className="flex-1 flex items-center justify-center relative my-2 overflow-hidden rounded-3xl bg-black border border-white/20">
        {cameraError ? (
          <div className="p-6 text-center text-red-200 max-w-sm">
            <span className="text-4xl block mb-2">⚠️</span>
            <p className="text-sm font-semibold">{cameraError}</p>
            <button
              onClick={onClose}
              type="button"
              className="mt-4 bg-white text-black font-bold py-2 px-5 rounded-xl text-xs"
            >
              Use File Upload Instead
            </button>
          </div>
        ) : capturedImage ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${capturedImage}`}
              alt="Live captured symptom"
              className="w-full h-full object-contain rounded-3xl"
            />
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Photo Frozen ✓
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover rounded-3xl"
            />
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-medium">
                Starting camera...
              </div>
            )}

            {/* Viewfinder Target Guidelines */}
            <div className="absolute inset-8 border-2 border-white/40 border-dashed rounded-2xl pointer-events-none flex items-center justify-center">
              <span className="text-white/60 text-xs font-medium bg-black/40 px-3 py-1 rounded-full">
                Center rash, eye, or wound here
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-center gap-6 pb-4 pt-2 z-10">
        {capturedImage ? (
          <div className="flex gap-4 w-full max-w-sm">
            <button
              onClick={handleRetake}
              type="button"
              className="flex-1 bg-white/20 text-white border border-white/40 font-bold py-3.5 rounded-2xl active:scale-95 text-sm"
            >
              🔄 Retake
            </button>
            <button
              onClick={handleConfirm}
              type="button"
              className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl active:scale-95 text-sm"
            >
              ✓ Use Photo
            </button>
          </div>
        ) : !cameraError ? (
          <div className="flex items-center justify-between w-full max-w-sm px-6">
            {/* Flip Camera Button */}
            <button
              onClick={handleToggleFacing}
              type="button"
              className="text-white bg-white/20 hover:bg-white/30 p-3 rounded-full active:scale-90 transition-transform"
              title="Switch Front/Back Camera"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>

            {/* Big Shutter Button */}
            <button
              onClick={handleSnap}
              type="button"
              className="w-20 h-20 rounded-full border-4 border-white bg-white/30 flex items-center justify-center p-1.5 active:scale-90 transition-transform shadow-2xl"
              aria-label="Capture Photo"
            >
              <span className="w-full h-full rounded-full bg-white block shadow"></span>
            </button>

            {/* Cancel */}
            <button
              onClick={onClose}
              type="button"
              className="text-white/80 hover:text-white text-xs font-bold px-3 py-2"
            >
              Cancel
            </button>
          </div>
        ) : null}
      </div>

    </div>
  );
}
