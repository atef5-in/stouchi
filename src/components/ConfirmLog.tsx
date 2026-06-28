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

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Confirm transaction</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isExpense ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
          {isExpense ? "Expense" : "Income"}
        </span>
      </div>

      {draft.clarify && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ {draft.clarify}
        </p>
      )}

      {/* Type toggle */}
      <div className="flex gap-2">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            onClick={() => set("type", t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all
              ${draft.type === t
                ? t === "expense" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {t === "expense" ? "💸 Expense" : "💰 Income"}
          </button>
        ))}
      </div>

      {/* Amount */}
      <label className="block">
        <span className="text-xs text-gray-500 mb-1 block">Amount (TND)</span>
        <input
          type="number"
          min={0}
          step={0.001}
          value={draft.amount}
          onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-lg font-semibold
                     focus:outline-none focus:ring-2 focus:ring-[#E23A3A]"
        />
      </label>

      {/* Category */}
      <label className="block">
        <span className="text-xs text-gray-500 mb-1 block">Category</span>
        <input
          type="text"
          value={draft.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-[#E23A3A]"
        />
        {draft.needsCategoryConfirmation && (
          <p className="text-xs text-amber-500 mt-1">New category — will be created on confirm.</p>
        )}
      </label>

      {/* Note */}
      <label className="block">
        <span className="text-xs text-gray-500 mb-1 block">Note</span>
        <input
          type="text"
          value={draft.note}
          onChange={(e) => set("note", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-[#E23A3A]"
        />
      </label>

      {/* Date */}
      <label className="block">
        <span className="text-xs text-gray-500 mb-1 block">Date</span>
        <input
          type="date"
          value={draft.date}
          onChange={(e) => set("date", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-[#E23A3A]"
        />
      </label>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-gray-600
                     hover:bg-gray-50 active:scale-95 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(draft)}
          className="flex-1 rounded-xl bg-[#E23A3A] py-3 text-white font-semibold
                     hover:bg-red-600 active:scale-95 transition-all"
        >
          ✅ Confirm
        </button>
      </div>
    </div>
  );
}
