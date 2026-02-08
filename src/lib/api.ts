import type { ApiResponse, CardBrand, EntryType, ExpenseEntry } from "@/types";
import { loadEntries, saveEntries } from "@/lib/storage";

function uuid() {
  // browser-safe uuid
  if ("randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function toAmount(input: unknown): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (typeof input === "string") {
    const normalized = input
      .trim()
      .split(".").join("")
      .replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

const BRANDS: CardBrand[] = [
  "Visa",
  "Mastercard",
  "Elo",
  "American Express",
  "Hipercard",
  "Discover",
  "Diners",
  "Outra",
];

export type CreateEntryInput = {
  type: EntryType;
  amount: number | string;
  description?: string;
  cardBrand?: CardBrand;
};

export type ListParams = {
  type?: EntryType | "all";
  cardBrand?: CardBrand | "all";
  q?: string;
  from?: string; // ISO date
  to?: string; // ISO date
};

export function apiCreateEntry(input: CreateEntryInput): ApiResponse<ExpenseEntry> {
  const amount = toAmount(input.amount);
  if (amount === null) {
    return { ok: false, error: { message: "Campo 'amount' inválido" } };
  }
  if (!isFiniteNumber(amount) || amount <= 0) {
    return { ok: false, error: { message: "Campo 'amount' deve ser > 0" } };
  }

  const type = input.type;
  if (type !== "gasto" && type !== "entrada") {
    return { ok: false, error: { message: "Campo 'type' inválido" } };
  }

  const description = (input.description ?? "").trim();
  if (!description) {
    return { ok: false, error: { message: "Campo 'description' é obrigatório" } };
  }

  const cardBrand = input.cardBrand;
  if (cardBrand && !BRANDS.includes(cardBrand)) {
    return { ok: false, error: { message: "Campo 'cardBrand' inválido" } };
  }

  const entry: ExpenseEntry = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    type,
    amount: Math.round(amount * 100) / 100,
    description,
    ...(cardBrand ? { cardBrand } : {}),
  };

  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);

  return { ok: true, data: entry };
}

export function apiListEntries(params: ListParams = {}): ApiResponse<ExpenseEntry[]> {
  const entries = loadEntries();
  const { type = "all", cardBrand = "all", q, from, to } = params;

  let filtered = entries.slice();

  if (type !== "all") filtered = filtered.filter((e) => e.type === type);
  if (cardBrand !== "all") filtered = filtered.filter((e) => e.cardBrand === cardBrand);
  if (q && q.trim()) {
    const s = q.trim().toLowerCase();
    filtered = filtered.filter((e) => e.description.toLowerCase().includes(s));
  }
  if (from) {
    const f = new Date(from).getTime();
    if (!Number.isNaN(f)) filtered = filtered.filter((e) => new Date(e.createdAt).getTime() >= f);
  }
  if (to) {
    const t = new Date(to).getTime();
    if (!Number.isNaN(t)) filtered = filtered.filter((e) => new Date(e.createdAt).getTime() <= t);
  }

  return { ok: true, data: filtered };
}

export function apiGetEntry(id: string): ApiResponse<ExpenseEntry> {
  const entries = loadEntries();
  const found = entries.find((e) => e.id === id);
  if (!found) return { ok: false, error: { message: "Registro não encontrado" } };
  return { ok: true, data: found };
}

export function apiDeleteEntry(id: string): ApiResponse<{ id: string }> {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return { ok: false, error: { message: "Registro não encontrado" } };
  entries.splice(idx, 1);
  saveEntries(entries);
  return { ok: true, data: { id } };
}

export function apiSeedDemo(): ApiResponse<{ seeded: number }> {
  const now = Date.now();
  const demo: ExpenseEntry[] = [
    {
      id: uuid(),
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      type: "gasto",
      amount: 79.9,
      description: "Mercado",
      cardBrand: "Mastercard",
    },
    {
      id: uuid(),
      createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
      type: "entrada",
      amount: 2500,
      description: "Salário",
    },
    {
      id: uuid(),
      createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      type: "gasto",
      amount: 39.9,
      description: "Assinatura",
      cardBrand: "Visa",
    },
  ];
  saveEntries([...demo, ...loadEntries()]);
  return { ok: true, data: { seeded: demo.length } };
}
