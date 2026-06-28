"use client";
import { formatTND } from "@/lib/format";

export default function BalanceCard({ balance }: { balance: number }) {
  const isPositive = balance >= 0;
  return (
    <div className={`rounded-2xl p-6 text-center shadow-sm
      ${isPositive
        ? "bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
        : "bg-gradient-to-br from-red-50 to-white border border-red-100"}`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Balance</p>
      <p className={`text-5xl font-extrabold tracking-tight ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
        {formatTND(Math.abs(balance))}
      </p>
      <p className="text-sm font-medium text-gray-400 mt-1">TND</p>
    </div>
  );
}
