"use client";
import { useState } from "react";

export default function TextInput({
  onSubmit,
  disabled,
}: {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={disabled}
        placeholder="chrit 9 kilo tmamtem b 150 dinar…"
        aria-label="Describe your transaction"
        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base
                   placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E23A3A]
                   disabled:opacity-50"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Submit"
        className="rounded-xl bg-[#E23A3A] px-5 py-3 text-white font-semibold
                   disabled:opacity-40 hover:bg-red-600 active:scale-95 transition-all"
      >
        →
      </button>
    </div>
  );
}
