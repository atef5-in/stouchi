import type { Transaction, Category } from "./types";
import { DEFAULT_CATEGORIES } from "./categories";

const KEYS = {
  transactions: "stouchi.transactions",
  categories: "stouchi.categories",
} as const;

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.transactions);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(txns: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.transactions, JSON.stringify(txns));
}

export function loadCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(KEYS.categories);
    if (!raw) {
      localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw) as Category[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(cats: Category[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.categories, JSON.stringify(cats));
}

export { KEYS };
