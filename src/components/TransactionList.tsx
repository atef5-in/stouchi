"use client";
import type { Transaction, Category } from "@/lib/types";
import { formatTND } from "@/lib/format";

function friendlyDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export default function TransactionList({
  transactions,
  categories,
  onDelete,
}: {
  transactions: Transaction[];
  categories: Category[];
  onDelete?: (id: string) => void;
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-10 text-center">
        <p className="text-3xl mb-2">✍️</p>
        <p className="text-sm text-gray-500 font-medium">No transactions yet</p>
        <p className="text-xs text-gray-400 mt-1">Add your first one above</p>
      </div>
    );
  }

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const groups: { date: string; txns: Transaction[] }[] = [];
  const seen = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const day = t.createdAt.slice(0, 10);
    if (!seen.has(day)) { seen.set(day, []); groups.push({ date: day, txns: seen.get(day)! }); }
    seen.get(day)!.push(t);
  }

  return (
    <div className="space-y-4">
      {groups.map(({ date, txns }) => (
        <div key={date}>
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
            {friendlyDate(date)}
          </p>
          <div className="space-y-2">
            {txns.map((t) => {
              const cat = catMap[t.categoryId];
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                    {cat?.icon ?? "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{t.note || cat?.name || "—"}</p>
                    <p className="text-xs text-gray-400">{cat?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-base ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                      {t.type === "income" ? "+" : "−"}{formatTND(t.amount)}
                    </p>
                    <p className="text-xs text-gray-400">TND</p>
                  </div>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(t.id)}
                      aria-label="Delete transaction"
                      className="ml-1 w-7 h-7 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50
                                 flex items-center justify-center text-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
