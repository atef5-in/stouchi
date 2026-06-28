"use client";
import { formatTND } from "@/lib/format";

// The "wallet" — a deep warm-ink slab that anchors the whole screen.
// Cream serif figure, gold accents, a tiny income/expense pulse split.
export default function BalanceCard({
  balance,
  income,
  expense,
}: {
  balance: number;
  income: number;
  expense: number;
}) {
  const isPositive = balance >= 0;
  const flow = income + expense;
  const inPct = flow > 0 ? (income / flow) * 100 : 50;

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] bg-ink text-paper shadow-wallet px-6 pt-6 pb-5">
      {/* warm glow + faint zellige-ish ring motif */}
      <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-saffron/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-clay/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 -bottom-10 h-40 w-40 rounded-full border border-saffron/15" />
      <div className="pointer-events-none absolute -right-2 -bottom-4 h-40 w-40 rounded-full border border-saffron/10" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-paper/55">
            In the pocket
          </p>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-[3.4rem] leading-none font-semibold tracking-tight tnum">
            {!isPositive && "−"}
            {formatTND(Math.abs(balance))}
          </span>
          <span className="mb-2 font-display text-lg text-saffron">DT</span>
        </div>

        {/* income / expense split — a single honest bar */}
        <div className="mt-5">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-paper/12">
            {flow > 0 && (
              <>
                <div className="h-full bg-olive" style={{ width: `${inPct}%` }} />
                <div className="h-full bg-clay" style={{ width: `${100 - inPct}%` }} />
              </>
            )}
          </div>
          <div className="mt-2.5 flex justify-between text-[0.78rem]">
            <span className="flex items-center gap-1.5 text-paper/70">
              <span className="h-2 w-2 rounded-full bg-olive" />
              in <span className="font-display tnum text-paper">{formatTND(income)}</span>
            </span>
            <span className="flex items-center gap-1.5 text-paper/70">
              out <span className="font-display tnum text-paper">{formatTND(expense)}</span>
              <span className="h-2 w-2 rounded-full bg-clay" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
