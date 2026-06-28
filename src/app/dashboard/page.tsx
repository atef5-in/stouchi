"use client";
import Link from "next/link";
import { useTransactions } from "@/hooks/useTransactions";
import { formatTND } from "@/lib/format";

export default function Dashboard() {
  const { transactions, categories } = useTransactions();

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTxns = transactions.filter((t) => t.createdAt.startsWith(thisMonth));

  const income  = monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const net     = income - expense;

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const byCat: Record<string, { name: string; icon: string; total: number }> = {};
  for (const t of monthTxns.filter((t) => t.type === "expense")) {
    const cat = catMap[t.categoryId];
    if (!byCat[t.categoryId]) byCat[t.categoryId] = { name: cat?.name ?? "Other", icon: cat?.icon ?? "📦", total: 0 };
    byCat[t.categoryId].total += t.amount;
  }
  const catRows = Object.values(byCat).sort((a, b) => b.total - a.total);
  const maxCat  = catRows[0]?.total ?? 1;

  const monthLabel = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-xs text-ink-soft">{monthLabel}</p>
        </div>
        <Link href="/" className="text-sm font-medium text-ink-soft hover:text-clay transition-colors">
          ← Home
        </Link>
      </div>

      {/* Income / Expense cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.4rem] border border-line bg-paper-card shadow-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="h-2 w-2 rounded-full bg-olive" />
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-ink-soft">Income</p>
          </div>
          <p className="font-display text-2xl font-semibold text-olive tnum">{formatTND(income)}</p>
          <p className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-ink-soft/60">dt</p>
        </div>
        <div className="rounded-[1.4rem] border border-line bg-paper-card shadow-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="h-2 w-2 rounded-full bg-clay" />
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-ink-soft">Expenses</p>
          </div>
          <p className="font-display text-2xl font-semibold text-clay tnum">{formatTND(expense)}</p>
          <p className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-ink-soft/60">dt</p>
        </div>
      </div>

      {/* Net */}
      <div className="rounded-[1.4rem] border border-line bg-paper-card shadow-card px-5 py-4 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-soft">Net this month</span>
        <span className={`font-display text-lg font-semibold tnum ${net >= 0 ? "text-olive" : "text-clay"}`}>
          {net >= 0 ? "+" : "−"}{formatTND(Math.abs(net))} <span className="text-xs font-normal text-ink-soft/60">dt</span>
        </span>
      </div>

      {/* Spend by category */}
      {catRows.length > 0 ? (
        <div className="rounded-[1.4rem] border border-line bg-paper-card shadow-card p-5 space-y-4">
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-ink-soft">By category</h2>
          <div className="space-y-4">
            {catRows.map((row) => (
              <div key={row.name} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    <span className="text-base">{row.icon}</span>
                    {row.name}
                  </span>
                  <span className="font-display text-sm font-semibold text-clay tnum">
                    {formatTND(row.total)} <span className="text-[0.65rem] font-normal text-ink-soft/60">dt</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-clay transition-all"
                    style={{ width: `${Math.max(4, (row.total / maxCat) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[1.4rem] border border-dashed border-line bg-paper-card/60 px-4 py-10 text-center">
          <p className="font-display text-2xl text-ink-soft/50">٠٠٠</p>
          <p className="mt-2 text-sm font-medium text-ink">No expenses this month</p>
          <p className="mt-1 text-xs text-ink-soft">Add one on the home screen.</p>
        </div>
      )}

      {/* All-time */}
      <div className="rounded-[1.4rem] border border-line bg-paper-card shadow-card px-5 py-4">
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-ink-soft mb-3">All time</h2>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Transactions</span>
          <span className="font-display font-semibold text-ink tnum">{transactions.length}</span>
        </div>
      </div>
    </div>
  );
}
