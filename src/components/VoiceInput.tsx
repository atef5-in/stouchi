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
        className={`relative grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl text-xl transition-all
          ${listening
            ? "bg-clay text-paper pulse-ring"
            : "bg-ink text-paper hover:bg-ink/90 active:scale-95"
          } disabled:opacity-40`}
      >
        {listening ? (
          // animated sound bars
          <span className="flex items-end gap-[3px] h-5">
            <span className="w-[3px] rounded-full bg-paper animate-[rise_0.5s_ease-in-out_infinite_alternate]" style={{ height: "60%" }} />
            <span className="w-[3px] rounded-full bg-paper animate-[rise_0.4s_ease-in-out_infinite_alternate]" style={{ height: "100%" }} />
            <span className="w-[3px] rounded-full bg-paper animate-[rise_0.6s_ease-in-out_infinite_alternate]" style={{ height: "45%" }} />
          </span>
        ) : (
          <MicIcon />
        )}
      </button>
      {error && (
        <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-clay">{error}</p>
      )}
    </>
  );
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}
