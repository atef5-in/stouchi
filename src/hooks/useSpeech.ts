"use client";
import { useState, useRef, useCallback, useEffect } from "react";

type SpeechRecognitionEvent = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
  resultIndex: number;
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

const LANGS = ["ar-TN", "ar-SA", "fr-FR"];

export function useSpeech(onResult: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);
  const langIdxRef = useRef(0);

  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) { setError("Voice not supported in this browser."); return; }

    setError(null);
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = LANGS[langIdxRef.current % LANGS.length];
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[e.resultIndex][0].transcript;
      if (text.trim()) onResult(text.trim());
    };
    rec.onerror = (e: { error: string }) => {
      if (e.error === "language-not-supported") {
        langIdxRef.current++;
        rec.lang = LANGS[langIdxRef.current % LANGS.length];
      } else {
        setError(e.error);
        setListening(false);
      }
    };
    rec.onend = () => setListening(false);
    recogRef.current = rec;
    rec.start();
    setListening(true);
  }, [onResult]);

  const stop = useCallback(() => {
    recogRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop };
}
