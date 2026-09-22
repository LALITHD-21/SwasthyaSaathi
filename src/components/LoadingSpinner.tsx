'use client';

import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin" role="status" aria-label="loading"></div>
      {text && <p className="text-gray-600 font-medium text-lg text-center animate-pulse">{text}</p>}
    </div>
  );
}
