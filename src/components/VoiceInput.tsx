"use client";
import { useSpeech } from "@/hooks/useSpeech";

export default function VoiceInput({
  onResult,
  disabled,
}: {
  onResult: (text: string) => void;
  disabled?: boolean;
}) {
  const { supported, listening, error, start, stop } = useSpeech(onResult);

  if (!supported) return null;

  return (
    <>
      <button
        aria-label={listening ? "Stop recording" : "Start voice input"}
        onClick={listening ? stop : start}
        disabled={disabled}
        className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-xl shadow-sm transition-all
          ${listening
            ? "bg-red-500 text-white animate-pulse"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
          } disabled:opacity-40`}
      >
        {listening ? "⏹" : "🎙️"}
      </button>
      {error && (
        <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-500">{error}</p>
      )}
    </>
  );
}
