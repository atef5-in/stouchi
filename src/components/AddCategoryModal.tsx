"use client";
import { useState } from "react";

const EMOJI_SUGGESTIONS = ["🏠", "🎓", "💊", "🎮", "✈️", "👗", "🐾", "🔧", "📱", "🎵", "🍕", "💪"];

export default function AddCategoryModal({
  open,
  onClose,
  onCreate,
  suggestedName,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, icon: string) => void;
  suggestedName?: string;
}) {
  const [name, setName] = useState(suggestedName ?? "");
  const [icon, setIcon] = useState("📦");

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed, icon);
    setName("");
    setIcon("📦");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/45 backdrop-blur-sm sm:items-center">
      <div className="rise w-full max-w-md rounded-t-[1.6rem] border border-line bg-paper-card p-6 shadow-wallet sm:rounded-[1.6rem]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" />
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron/15 text-lg">{icon}</span>
          <h2 className="font-display text-xl font-semibold text-ink">New category</h2>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">Name</span>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Health, Hobbies…"
            className="w-full rounded-2xl border border-line bg-paper px-4 py-2.5 text-ink
                       focus:outline-none focus:border-clay/50 focus:ring-2 focus:ring-clay/15 transition-all"
          />
        </label>

        <div className="mt-4">
          <span className="mb-2 block text-xs font-medium text-ink-soft">Pick an icon</span>
          <div className="flex flex-wrap gap-2">
            {EMOJI_SUGGESTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setIcon(e)}
                className={`grid h-11 w-11 place-items-center rounded-2xl text-xl transition-all ${
                  icon === e ? "bg-clay/12 ring-2 ring-clay" : "bg-paper hover:bg-paper-deep"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-line py-3 font-medium text-ink-soft hover:bg-paper transition-all"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim()}
            className="flex-[1.4] rounded-2xl bg-clay py-3 font-semibold text-paper
                       disabled:opacity-30 hover:bg-clay-deep transition-all"
          >
            Add category
          </button>
        </div>
      </div>
    </div>
  );
}
