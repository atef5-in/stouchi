"use client";
import type { Transaction, Category } from "@/lib/types";
import { formatTND } from "@/lib/format";

function friendlyDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Today";
  if (same(d, y)) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
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
      <div className="rounded-[1.4rem] border border-dashed border-line bg-paper-card/60 px-4 py-12 text-center">
        <p className="font-display text-2xl text-ink-soft/70">٠٠٠</p>
        <p className="mt-2 text-sm font-medium text-ink">Nothing logged yet</p>
        <p className="mt-1 text-xs text-ink-soft">Say your first one above — try the example.</p>
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
    <div className="space-y-5">
      {groups.map(({ date, txns }) => {
        const dayNet = txns.reduce((s, t) => (t.type === "income" ? s + t.amount : s - t.amount), 0);
        return (
          <div key={date}>
            <div className="mb-2 flex items-baseline justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
                {friendlyDate(date)}
              </p>
              <p className={`font-display text-xs tnum ${dayNet >= 0 ? "text-olive" : "text-clay"}`}>
                {dayNet >= 0 ? "+" : "−"}{formatTND(Math.abs(dayNet))}
              </p>
            </div>

            {/* one card per day, rows divided by ledger rules */}
            <div className="overflow-hidden rounded-[1.4rem] border border-line bg-paper-card shadow-card">
              {txns.map((t, i) => {
                const cat = catMap[t.categoryId];
                const isIncome = t.type === "income";
                return (
                  <div
                    key={t.id}
                    className={`group flex items-center gap-3 px-3.5 py-3 ${i > 0 ? "border-t border-line/70" : ""}`}
                  >
                    <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-paper text-xl">
                      {cat?.icon ?? "📦"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.95rem] font-medium text-ink">{t.note || cat?.name || "—"}</p>
                      <p className="text-xs text-ink-soft">{cat?.name}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className={`font-display text-base font-semibold tnum ${isIncome ? "text-olive" : "text-clay"}`}>
                        {isIncome ? "+" : "−"}{formatTND(t.amount)}
                      </p>
                      <p className="text-[0.65rem] uppercase tracking-wider text-ink-soft/70">dt</p>
                    </div>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(t.id)}
                        aria-label="Delete transaction"
                        className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-ink-soft/40
                                   hover:bg-clay/10 hover:text-clay transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
