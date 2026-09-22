'use client';

import React from 'react';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  size?: 'lg' | 'xl';
}

export default function MicButton({ isListening, onClick, size = 'lg' }: MicButtonProps) {
  const isXl = size === 'xl';
  const sizeClasses = isXl ? 'w-28 h-28 sm:w-36 sm:h-36' : 'w-20 h-20';
  const iconSize = isXl ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-9 h-9';

  return (
    <div className="relative inline-flex items-center justify-center p-4">
      {/* Outer Ripple Rings */}
      {isListening && (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-25 animate-ping duration-1000"></span>
          <span className="absolute inline-flex h-[130%] w-[130%] rounded-full bg-red-300 opacity-20 animate-pulse"></span>
        </>
      )}

      {!isListening && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-sky-200 opacity-40 animate-pulse"></span>
      )}

      {/* Main Interactive Button */}
      <button
        onClick={onClick}
        type="button"
        className={`
          relative z-10 flex items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer
          ${sizeClasses}
          ${
            isListening
              ? 'bg-gradient-to-tr from-red-600 to-rose-500 shadow-red-300/80 ring-8 ring-red-100'
              : 'bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-500 shadow-sky-300/80 ring-8 ring-sky-50 hover:shadow-sky-400/90 hover:scale-105'
          }
        `}
        aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
      >
        {isListening ? (
          <div className="flex flex-col items-center justify-center gap-1">
            {/* Animated Soundwave bars */}
            <div className="flex items-center gap-1 h-8">
              <span className="w-1.5 bg-white rounded-full animate-[bounce_0.6s_infinite_100ms] h-4"></span>
              <span className="w-1.5 bg-white rounded-full animate-[bounce_0.6s_infinite_200ms] h-7"></span>
              <span className="w-1.5 bg-white rounded-full animate-[bounce_0.6s_infinite_300ms] h-5"></span>
              <span className="w-1.5 bg-white rounded-full animate-[bounce_0.6s_infinite_150ms] h-8"></span>
              <span className="w-1.5 bg-white rounded-full animate-[bounce_0.6s_infinite_250ms] h-4"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Stop</span>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconSize}
          >
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
