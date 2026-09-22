"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type SupportedLang = "hi-IN" | "kn-IN" | "en-IN";

export interface SpeechToTextReturn {
  transcript: string;
  isListening: boolean;
  error: string | null;
  errorCode: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechToText(lang: SupportedLang = "en-IN"): SpeechToTextReturn {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const win = window as any;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser.");
      setErrorCode("not-supported");
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setTranscript(currentTranscript);
          setError(null);
          setErrorCode(null);
        }
      };

      recognition.onerror = (event: any) => {
        const err = event.error || "unknown";
        setErrorCode(err);

        if (err === "no-speech") {
          // Normal when silent, don't show error
          return;
        }

        if (err === "network") {
          setError("Speech recognition network paused. You can use the quick symptom buttons or type below.");
        } else if (err === "not-allowed" || err === "permission-denied") {
          setError("Microphone permission was denied. Please allow microphone access or type your symptoms.");
        } else {
          setError(`Speech note: ${err}`);
        }
        setIsListening(false);
        shouldListenRef.current = false;
      };

      recognition.onend = () => {
        if (shouldListenRef.current) {
          // If stopped automatically by browser timeout while user intended to record
          setIsListening(false);
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } catch (initErr: any) {
      setIsSupported(false);
      setError("Speech recognition initialization failed.");
      setErrorCode("init-error");
    }

    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
    };
  }, [lang]);

  const startListening = useCallback(() => {
    setError(null);
    setErrorCode(null);
    shouldListenRef.current = true;
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e: any) {
      // If already started or failed
      if (e.name !== "InvalidStateError") {
        console.error("Speech start error:", e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
    setErrorCode(null);
  }, []);

  return {
    transcript,
    isListening,
    error,
    errorCode,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
