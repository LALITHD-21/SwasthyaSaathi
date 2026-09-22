'use client';

import React, { useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { t } from '@/lib/i18n';
import LiveCameraModal from './LiveCameraModal';

interface PhotoUploadButtonProps {
  imagePreview: string | null;
  onImageSelected: (base64Data: string | null, mimeType: string | null) => void;
}

export default function PhotoUploadButton({
  imagePreview,
  onImageSelected,
}: PhotoUploadButtonProps) {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Compress image client-side to <= 1024px to save mobile bandwidth
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1024;
        let width = img.width;
        let height = img.height;

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
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          // Split off prefix: data:image/jpeg;base64,
          const base64Data = compressedDataUrl.split(',')[1];
          onImageSelected(base64Data, 'image/jpeg');
        }
        setCompressing(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageSelected(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = (base64Data: string, mimeType: string) => {
    onImageSelected(base64Data, mimeType);
    setIsCameraOpen(false);
  };

  return (
    <div className="w-full">
      {/* Hidden File Input for Gallery / Local file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="photo-upload-input"
      />

      {imagePreview ? (
        /* Preview Card when Photo is selected */
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-300 bg-sky-50/50 p-2.5 shadow-sm animate-fade-in flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${imagePreview}`}
              alt="Uploaded symptom preview"
              className="w-14 h-14 object-cover rounded-xl border border-sky-200 shadow-sm flex-shrink-0"
            />
            <div className="text-left truncate">
              <span className="text-xs font-extrabold text-sky-900 flex items-center gap-1">
                <span>✓</span>
                <span>Photo attached</span>
              </span>
              <span className="text-[11px] text-gray-500 font-medium block truncate">
                AI Vision will inspect this symptom
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setIsCameraOpen(true)}
              type="button"
              className="text-xs font-bold text-sky-700 bg-white hover:bg-sky-100 py-1.5 px-2.5 rounded-xl border border-sky-200 active:scale-95 transition-all shadow-xs"
              title="Retake with Camera"
            >
              📸 {t(language, 'retakePhoto')}
            </button>
            <button
              onClick={handleRemove}
              type="button"
              className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 py-1.5 px-2.5 rounded-xl border border-rose-200 active:scale-95 transition-all"
              title="Remove"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        /* Dual Action Buttons: Live Camera & Gallery Upload */
        <div className="bg-white border border-dashed border-sky-300 hover:border-sky-400 rounded-2xl p-2.5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-left">
              <span className="text-xs font-bold text-sky-900 block">
                {compressing ? 'Compressing image...' : t(language, 'attachPhoto')}
              </span>
              <span className="text-[10px] text-gray-400 font-medium block">
                {t(language, 'photoDescription')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Live Camera Button */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="py-2.5 px-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="text-sm">📸</span>
              <span>{t(language, 'takeLivePhoto')}</span>
            </button>

            {/* Gallery Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100/80 text-sky-800 font-bold text-xs rounded-xl border border-sky-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="text-sm">📁</span>
              <span>{t(language, 'chooseFilePhoto')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handleCameraCapture}
      />
    </div>
  );
}
