"use client";
import Link from "next/link";
import { useTransactions } from "@/hooks/useTransactions";
import { formatTND } from "@/lib/format";

export default function Dashboard() {
  const { transactions, categories } = useTransactions();

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthTxns = transactions.filter((t) => t.createdAt.startsWith(thisMonth));
  const income = monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const byCat: Record<string, { name: string; icon: string; total: number }> = {};
  for (const t of monthTxns.filter((t) => t.type === "expense")) {
    const cat = catMap[t.categoryId];
    const key = t.categoryId;
    if (!byCat[key]) byCat[key] = { name: cat?.name ?? "Other", icon: cat?.icon ?? "📦", total: 0 };
    byCat[key].total += t.amount;
  }
  const catRows = Object.values(byCat).sort((a, b) => b.total - a.total);
  const maxCat = catRows[0]?.total ?? 1;

  const monthLabel = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const net = income - expense;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[1.75rem] font-semibold tracking-tight text-ink">This month</h1>
          <p className="text-sm text-ink-soft">{monthLabel}</p>
        </div>
        <Link
          href="/"
          aria-label="Back home"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-paper-card text-ink-soft
                     shadow-card hover:text-clay hover:border-clay/40 active:scale-95 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
          </svg>
        </Link>
      </header>

      {/* Net — the wallet treatment again for continuity */}
      <div className="relative overflow-hidden rounded-[1.6rem] bg-ink px-6 py-6 text-paper shadow-wallet">
        <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-saffron/20 blur-3xl" />
        <div className="relative">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-paper/55">Net this month</p>
          <p className="mt-2 font-display text-[3rem] leading-none font-semibold tnum">
            {net >= 0 ? "+" : "−"}{formatTND(Math.abs(net))}
            <span className="ml-2 font-display text-base text-saffron">DT</span>
          </p>
        </div>
      </div>

      {/* Income / expense */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.4rem] border border-line bg-paper-card p-4 shadow-card">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-olive" />
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">In</p>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold tnum text-olive">{formatTND(income)}</p>
        </div>
        <div className="rounded-[1.4rem] border border-line bg-paper-card p-4 shadow-card">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-clay" />
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Out</p>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold tnum text-clay">{formatTND(expense)}</p>
        </div>
      </div>

      {/* Spend by category */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Where it went</h2>
          <div className="rule h-px flex-1" />
        </div>
        {catRows.length > 0 ? (
          <div className="space-y-4 rounded-[1.4rem] border border-line bg-paper-card p-5 shadow-card">
            {catRows.map((row) => (
              <div key={row.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    <span className="text-lg">{row.icon}</span>
                    {row.name}
                  </span>
                  <span className="font-display text-sm font-semibold tnum text-ink">{formatTND(row.total)}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-paper-deep">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-clay to-saffron transition-all"
                    style={{ width: `${Math.max(5, (row.total / maxCat) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-line bg-paper-card/60 px-4 py-10 text-center">
            <p className="font-display text-2xl text-ink-soft/70">٠٠٠</p>
            <p className="mt-2 text-sm text-ink-soft">No expenses logged this month yet</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-[1.4rem] border border-line bg-paper-card px-5 py-4 shadow-card">
        <span className="text-sm text-ink-soft">All-time transactions</span>
        <span className="font-display text-lg font-semibold tnum text-ink">{transactions.length}</span>
      </div>
    </div>
  );
}
