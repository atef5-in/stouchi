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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="font-semibold text-gray-800 text-lg">New category</h2>

        <label className="block">
          <span className="text-xs text-gray-500 mb-1 block">Name</span>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Health, Hobbies…"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E23A3A]"
          />
        </label>

        <div>
          <span className="text-xs text-gray-500 mb-2 block">Icon</span>
          <div className="flex flex-wrap gap-2">
            {EMOJI_SUGGESTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setIcon(e)}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all
                  ${icon === e ? "bg-red-100 ring-2 ring-[#E23A3A]" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim()}
            className="flex-1 rounded-xl bg-[#E23A3A] py-3 text-white font-semibold
                       disabled:opacity-40 hover:bg-red-600 transition-all"
          >
            Add category
          </button>
        </div>
      </div>
    </div>
  );
}
