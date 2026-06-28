"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import type { ParsedTransaction } from "@/lib/types";
import { useTransactions } from "@/hooks/useTransactions";
import BalanceCard from "@/components/BalanceCard";
import VoiceInput from "@/components/VoiceInput";
import TransactionList from "@/components/TransactionList";
import ConfirmLog from "@/components/ConfirmLog";
import AddCategoryModal from "@/components/AddCategoryModal";
import Coin from "@/components/Coin";

type Status = "idle" | "parsing" | "confirm" | "error";

export default function Home() {
  const { transactions, categories, balance, income, expense, addTransaction, addCategory, deleteTransaction } =
    useTransactions();

  const [status, setStatus] = useState<Status>("idle");
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [textValue, setTextValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | undefined>();
  const [pendingParsed, setPendingParsed] = useState<ParsedTransaction | null>(null);

  const isParsing = status === "parsing";

  const handleInput = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setStatus("parsing");
      setErrorMsg("");
      setTextValue("");
      try {
        const res = await fetch("/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, categories: categories.map((c) => c.name) }),
        });
        if (!res.ok) throw new Error("Parse failed");
        const data: ParsedTransaction = await res.json();
        setParsed(data);
        setStatus("confirm");
      } catch {
        setErrorMsg("Couldn't understand that — try again.");
        setStatus("error");
      }
    },
    [categories]
  );

  const handleVoiceResult = useCallback(
    (text: string) => {
      setTextValue(text);
      handleInput(text);
    },
    [handleInput]
  );

  const handleSubmit = () => handleInput(textValue);

  const handleConfirm = useCallback(
    (p: ParsedTransaction) => {
      if (p.needsCategoryConfirmation) {
        setPendingParsed(p);
        setPendingCategory(p.category);
        setModalOpen(true);
        return;
      }
      const cat = categories.find((c) => c.name.toLowerCase() === p.category.toLowerCase());
      const categoryId = cat?.id ?? "other";
      addTransaction({ type: p.type, amount: p.amount, currency: p.currency, categoryId, note: p.note });
      setParsed(null);
      setStatus("idle");
    },
    [categories, addTransaction]
  );

  const handleModalCreate = useCallback(
    (name: string, icon: string) => {
      const id = addCategory({ name, icon, kind: pendingParsed?.type ?? "both" });
      if (pendingParsed) {
        addTransaction({
          type: pendingParsed.type,
          amount: pendingParsed.amount,
          currency: pendingParsed.currency,
          categoryId: id,
          note: pendingParsed.note,
        });
      }
      setPendingParsed(null);
      setPendingCategory(undefined);
      setParsed(null);
      setStatus("idle");
    },
    [pendingParsed, addCategory, addTransaction]
  );

  const handleCancel = () => { setParsed(null); setStatus("idle"); setErrorMsg(""); };

  return (
    <div className="space-y-6">
      {/* Header — wordmark with the coin + Arabic name */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coin size={42} className="drop-shadow-sm" />
          <div className="leading-none">
            <h1 className="font-display text-[1.75rem] font-semibold tracking-tight text-ink">
              Stouchi
            </h1>
            <p className="font-arabic text-sm text-ink-soft mt-0.5" dir="rtl">ستوشي · فلوسي</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-paper-card text-ink-soft
                     shadow-card hover:text-clay hover:border-clay/40 active:scale-95 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="20" x2="6" y2="13" />
            <line x1="12" y1="20" x2="12" y2="7" />
            <line x1="18" y1="20" x2="18" y2="11" />
          </svg>
        </Link>
      </header>

      {/* The wallet */}
      <BalanceCard balance={balance} income={income} expense={expense} />

      {/* Input — the one main action */}
      {status !== "confirm" && (
        <div className="rounded-[1.4rem] border border-line bg-paper-card shadow-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" />
            <p className="text-sm font-semibold text-ink">
              {isParsing ? "Reading it…" : "Say what you spent or earned"}
            </p>
          </div>

          <div className="relative flex items-center gap-2">
            <VoiceInput onResult={handleVoiceResult} disabled={isParsing} />
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={isParsing}
              placeholder="chrit 9 kilo tmamtem b 150 dinar…"
              aria-label="Describe your transaction"
              className="flex-1 min-w-0 rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink
                         placeholder:text-ink-soft/60 focus:outline-none focus:border-clay/50 focus:ring-2 focus:ring-clay/15
                         disabled:opacity-50 transition-all"
            />
            <button
              onClick={handleSubmit}
              disabled={isParsing || !textValue.trim()}
              aria-label="Submit"
              className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-clay text-paper
                         disabled:opacity-30 hover:bg-clay-deep active:scale-95 transition-all"
            >
              {isParsing ? (
                <span className="h-4 w-4 rounded-full border-2 border-paper/40 border-t-paper animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              )}
            </button>
          </div>

          {status === "error" && (
            <p className="text-sm text-clay">{errorMsg}</p>
          )}

          <p className="text-xs text-ink-soft/80">
            Tunisian · العربية · français — say it however you talk.
          </p>
        </div>
      )}

      {/* Confirmation card */}
      {status === "confirm" && parsed && (
        <ConfirmLog parsed={parsed} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}

      {/* The ledger */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">The ledger</h2>
          <div className="rule h-px flex-1" />
        </div>
        <TransactionList
          transactions={transactions}
          categories={categories}
          onDelete={deleteTransaction}
        />
      </div>

      {/* New category modal */}
      <AddCategoryModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setPendingParsed(null); setStatus("idle"); }}
        onCreate={handleModalCreate}
        suggestedName={pendingCategory}
      />
    </div>
  );
}
