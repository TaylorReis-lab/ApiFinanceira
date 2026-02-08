import type { ExpenseEntry } from "@/types";

const KEY = "gastos_api_entries_v1";

export function loadEntries(): ExpenseEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ExpenseEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveEntries(entries: ExpenseEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}
