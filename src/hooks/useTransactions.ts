"use client";
import { useState, useEffect, useCallback } from "react";
import type { Transaction, Category } from "@/lib/types";
import {
  loadTransactions,
  saveTransactions,
  loadCategories,
  saveCategories,
} from "@/lib/storage";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setTransactions(loadTransactions());
    setCategories(loadCategories());
  }, []);

  const balance = transactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
    0
  );

  const addTransaction = useCallback(
    (t: Omit<Transaction, "id" | "createdAt">) => {
      const next: Transaction = {
        ...t,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => {
        const updated = [next, ...prev];
        saveTransactions(updated);
        return updated;
      });
    },
    []
  );

  const addCategory = useCallback(
    (c: Omit<Category, "id" | "isDefault">): string => {
      const id = c.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      const next: Category = { ...c, id, isDefault: false };
      setCategories((prev) => {
        const updated = [...prev, next];
        saveCategories(updated);
        return updated;
      });
      return id;
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  return { transactions, categories, balance, addTransaction, addCategory, deleteTransaction };
}
