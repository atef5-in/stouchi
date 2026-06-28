"use client";
import type { Category } from "@/lib/types";

export default function CategoryList({
  categories,
  onPick,
  selected,
}: {
  categories: Category[];
  onPick?: (id: string) => void;
  selected?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onPick?.(c.id)}
          className={`flex flex-col items-center gap-1 rounded-xl border py-3 px-2 text-center transition-all
            ${selected === c.id
              ? "border-[#E23A3A] bg-red-50 text-[#E23A3A]"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}
        >
          <span className="text-2xl">{c.icon}</span>
          <span className="text-xs font-medium leading-tight">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
