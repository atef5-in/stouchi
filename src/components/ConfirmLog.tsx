"use client";
import { useState } from "react";
import type { ParsedTransaction } from "@/lib/types";

export default function ConfirmLog({
  parsed,
  onConfirm,
  onCancel,
}: {
  parsed: ParsedTransaction;
  onConfirm: (t: ParsedTransaction) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ParsedTransaction>({ ...parsed });

  const set = <K extends keyof ParsedTransaction>(key: K, val: ParsedTransaction[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const isExpense = draft.type === "expense";

  const field =
    "w-full rounded-2xl border border-line bg-paper px-4 py-2.5 text-ink " +
    "focus:outline-none focus:border-clay/50 focus:ring-2 focus:ring-clay/15 transition-all";

  return (
    <div className="rise rounded-[1.4rem] border border-line bg-paper-card shadow-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${isExpense ? "bg-clay" : "bg-olive"}`} />
          <h2 className="font-display text-lg font-semibold text-ink">Does this look right?</h2>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isExpense ? "bg-clay/12 text-clay" : "bg-olive/12 text-olive"
          }`}
        >
          {isExpense ? "Spent" : "Earned"}
        </span>
      </div>

      {draft.clarify && (
        <p className="rounded-2xl bg-saffron/12 px-3 py-2 text-sm text-clay-deep">
          {draft.clarify}
        </p>
      )}

      {/* The amount — the star of the card, in serif */}
      <div className="rounded-2xl bg-ink px-4 py-4 text-paper">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper/55">Amount</span>
        <div className="mt-1 flex items-end gap-2">
          <input
            type="number"
            min={0}
            step={0.001}
            value={draft.amount}
            onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
            className="w-full bg-transparent font-display text-4xl font-semibold tnum text-paper
                       focus:outline-none placeholder:text-paper/30"
          />
          <span className="mb-1.5 font-display text-base text-saffron">DT</span>
        </div>
      </div>

      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-paper p-1">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            onClick={() => set("type", t)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
              draft.type === t
                ? t === "expense"
                  ? "bg-clay text-paper shadow-sm"
                  : "bg-olive text-paper shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {t === "expense" ? "Spent" : "Earned"}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">Category</span>
        <input type="text" value={draft.category} onChange={(e) => set("category", e.target.value)} className={field} />
        {draft.needsCategoryConfirmation && (
          <p className="mt-1.5 text-xs text-saffron">New category — we&apos;ll create it when you confirm.</p>
        )}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">Note</span>
        <input type="text" value={draft.note} onChange={(e) => set("note", e.target.value)} className={field} />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">Date</span>
        <input type="date" value={draft.date} onChange={(e) => set("date", e.target.value)} className={field} />
      </label>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-2xl border border-line py-3 font-medium text-ink-soft
                     hover:bg-paper active:scale-95 transition-all"
        >
          Discard
        </button>
        <button
          onClick={() => onConfirm(draft)}
          className="flex-[1.4] rounded-2xl bg-clay py-3 font-semibold text-paper
                     hover:bg-clay-deep active:scale-95 transition-all"
        >
          Save it
        </button>
      </div>
    </div>
  );
}
