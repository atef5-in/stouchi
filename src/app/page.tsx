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

type Status = "idle" | "parsing" | "confirm" | "error";

export default function Home() {
  const { transactions, categories, balance, addTransaction, addCategory, deleteTransaction } =
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Stouchi <span className="text-[#E23A3A]">🪙</span>
          </h1>
          <p className="text-xs text-gray-400">Your pocket money tracker</p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#E23A3A] transition-colors"
        >
          <span>📊</span> Dashboard
        </Link>
      </div>

      {/* Balance */}
      <BalanceCard balance={balance} />

      {/* Input area */}
      {status !== "confirm" && (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
          <p className="text-sm font-medium text-gray-600 text-center">
            {isParsing ? "Thinking…" : "What did you spend or earn?"}
          </p>

          {/* Unified input row: mic | text | send */}
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
              className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base
                         placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E23A3A]
                         focus:bg-white disabled:opacity-50 transition-colors"
            />
            <button
              onClick={handleSubmit}
              disabled={isParsing || !textValue.trim()}
              aria-label="Submit"
              className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#E23A3A] text-white text-lg font-bold
                         flex items-center justify-center shadow-sm
                         disabled:opacity-40 hover:bg-red-600 active:scale-95 transition-all"
            >
              →
            </button>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <p className="text-xs text-gray-400 text-center">
            Speak or type in Tunisian, Arabic, or French
          </p>
        </div>
      )}

      {/* Confirmation card */}
      {status === "confirm" && parsed && (
        <ConfirmLog parsed={parsed} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}

      {/* Recent transactions */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recent</h2>
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
