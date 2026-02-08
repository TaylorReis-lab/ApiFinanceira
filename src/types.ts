export type CardBrand =
  | "Visa"
  | "Mastercard"
  | "Elo"
  | "American Express"
  | "Hipercard"
  | "Discover"
  | "Diners"
  | "Outra";

export type EntryType = "gasto" | "entrada";

export type ExpenseEntry = {
  id: string;
  createdAt: string; // ISO
  type: EntryType;
  amount: number; // decimal in BRL
  description: string;
  cardBrand?: CardBrand;
};

export type ApiResponse<T> = {
  ok: true;
  data: T;
} | {
  ok: false;
  error: {
    message: string;
    details?: unknown;
  };
};
