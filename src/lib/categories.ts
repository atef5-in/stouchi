import type { Category } from "./types";

// Default categories seeded on first launch. Keep the list short and friendly.
// TODO: finalize the default set + emojis.
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "groceries", name: "Groceries", icon: "🛒", kind: "expense", isDefault: true },
  { id: "food",      name: "Food & Café", icon: "☕", kind: "expense", isDefault: true },
  { id: "transport", name: "Transport", icon: "🚗", kind: "expense", isDefault: true },
  { id: "bills",     name: "Bills", icon: "🧾", kind: "expense", isDefault: true },
  { id: "salary",    name: "Salary", icon: "💼", kind: "income",  isDefault: true },
  { id: "other",     name: "Other", icon: "📦", kind: "both",    isDefault: true },
];
