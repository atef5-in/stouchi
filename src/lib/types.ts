// Shared types — this is the data contract. Keep CLAUDE.md §7 in sync with this file.

export type TransactionType = "income" | "expense";
export type Currency = "TND"; // MVP: Tunisian Dinar only.

export interface Category {
  id: string;
  name: string;          // e.g. "Groceries", "Salary", "Café"
  icon: string;          // emoji, e.g. "🛒"
  kind: TransactionType | "both";
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;        // positive number, in TND
  currency: Currency;
  categoryId: string;
  note: string;          // short human-readable note
  createdAt: string;     // ISO date string
}

// What /api/parse returns from a free-text/voice input.
export interface ParsedTransaction {
  type: TransactionType;
  amount: number;
  currency: Currency;
  category: string;              // category NAME suggested by the AI
  note: string;
  date: string;                  // ISO date (YYYY-MM-DD)
  confidence: number;            // 0..1
  needsCategoryConfirmation: boolean; // true if category is new / uncertain
  clarify?: string;              // present if the AI needs the user to clarify
}
