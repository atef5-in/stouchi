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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">{monthLabel}</p>
        </div>
        <Link href="/" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#E23A3A] transition-colors">
          ← Home
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-semibold">Income</p>
          <p className="text-2xl font-extrabold text-emerald-600">{formatTND(income)}</p>
          <p className="text-xs text-gray-400">TND</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-semibold">Expenses</p>
          <p className="text-2xl font-extrabold text-red-500">{formatTND(expense)}</p>
          <p className="text-xs text-gray-400">TND</p>
        </div>
      </div>

      {/* Net */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Net this month</span>
        <span className={`text-lg font-extrabold ${net >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {net >= 0 ? "+" : "−"}{formatTND(Math.abs(net))} TND
        </span>
      </div>

      {/* Spend by category */}
      {catRows.length > 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">By category</h2>
          <div className="space-y-4">
            {catRows.map((row) => (
              <div key={row.name} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-lg">{row.icon}</span>
                    {row.name}
                  </span>
                  <span className="text-sm font-bold text-red-500">{formatTND(row.total)} TND</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#E23A3A] h-2 rounded-full transition-all"
                    style={{ width: `${Math.max(4, (row.total / maxCat) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-8 text-center">
          <p className="text-2xl mb-2">📊</p>
          <p className="text-sm text-gray-500">No expenses logged this month yet</p>
        </div>
      )}

      {/* All-time */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">All time</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Transactions</span>
          <span className="font-bold text-gray-900">{transactions.length}</span>
        </div>
      </div>
    </div>
  );
}
