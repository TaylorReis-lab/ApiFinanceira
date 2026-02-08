import { useMemo, useState } from "react";
import type { CardBrand, EntryType } from "@/types";
import {
  apiCreateEntry,
  apiDeleteEntry,
  apiListEntries,
  apiSeedDemo,
  type CreateEntryInput,
} from "@/lib/api";
import { Input, Label, Select, Textarea } from "@/components/Field";
import { JsonBlock } from "@/components/JsonBlock";

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

function moneyBRL(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

export function App() {
  // --- "API" state ---
  const [refreshKey, setRefreshKey] = useState(0);
  const data = useMemo(() => apiListEntries({}), [refreshKey]);

  // --- create form ---
  const [type, setType] = useState<EntryType>("gasto");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cardBrand, setCardBrand] = useState<CardBrand | "">("");

  // --- filters ---
  const [fType, setFType] = useState<EntryType | "all">("all");
  const [fBrand, setFBrand] = useState<CardBrand | "all">("all");
  const [q, setQ] = useState<string>("");

  // --- last responses (to show as API output) ---
  const [lastRequest, setLastRequest] = useState<unknown>(null);
  const [lastResponse, setLastResponse] = useState<unknown>(null);

  const list = useMemo(() => {
    const res = apiListEntries({ type: fType, cardBrand: fBrand, q });
    return res.ok ? res.data : [];
  }, [refreshKey, fType, fBrand, q]);

  const totals = useMemo(() => {
    const gastos = list.filter((e) => e.type === "gasto").reduce((a, e) => a + e.amount, 0);
    const entradas = list.filter((e) => e.type === "entrada").reduce((a, e) => a + e.amount, 0);
    return { gastos, entradas, saldo: entradas - gastos };
  }, [list]);

  function bump() {
    setRefreshKey((k) => k + 1);
  }

  function submitCreate() {
    const payload: CreateEntryInput = {
      type,
      amount,
      description,
      ...(cardBrand ? { cardBrand } : {}),
    };

    setLastRequest({ method: "POST", path: "/api/entries", body: payload });
    const res = apiCreateEntry(payload);
    setLastResponse(res);
    if (res.ok) {
      setAmount("");
      setDescription("");
      setCardBrand("");
      bump();
    }
  }

  function doDelete(id: string) {
    setLastRequest({ method: "DELETE", path: `/api/entries/${id}` });
    const res = apiDeleteEntry(id);
    setLastResponse(res);
    bump();
  }

  function seed() {
    setLastRequest({ method: "POST", path: "/api/seed" });
    const res = apiSeedDemo();
    setLastResponse(res);
    bump();
  }

  function listApiCall() {
    const query = { type: fType, cardBrand: fBrand, q };
    setLastRequest({ method: "GET", path: "/api/entries", query });
    setLastResponse(apiListEntries(query));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">API de Recebimento de Gastos e Entradas</h1>
            <p className="text-sm text-slate-600">
              Simulador de API (sem backend) para registrar <span className="font-medium">gastos</span> e <span className="font-medium">entradas</span>,
              com <span className="font-medium">valor</span>, <span className="font-medium">tipo</span> e <span className="font-medium">bandeira do cartão</span>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={seed}
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              type="button"
            >
              Inserir dados demo
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("gastos_api_entries_v1");
                bump();
                setLastRequest({ method: "POST", path: "/api/reset" });
                setLastResponse({ ok: true, data: { reset: true } });
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              type="button"
            >
              Limpar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">POST /api/entries</h2>
              <p className="text-sm text-slate-600">Criar registro (gasto/entrada).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={type} onChange={(e) => setType(e.target.value as EntryType)}>
                <option value="gasto">gasto</option>
                <option value="entrada">entrada</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Valor</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex.: 99,90" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Almoço, Mercado, Salário..." />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Bandeira do cartão (opcional)</Label>
              <Select value={cardBrand} onChange={(e) => setCardBrand(e.target.value as CardBrand | "")}>
                <option value="">(sem cartão)</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={submitCreate}
              className="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              type="button"
            >
              Enviar
            </button>
            <button
              onClick={() => {
                setType("gasto");
                setAmount("");
                setDescription("");
                setCardBrand("");
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              type="button"
            >
              Reset form
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">Exemplo de body</div>
              <JsonBlock
                value={{ type: "gasto", amount: 99.9, description: "Mercado", cardBrand: "Mastercard" }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">GET /api/entries</h2>
            <p className="text-sm text-slate-600">Listar e filtrar registros.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={fType} onChange={(e) => setFType(e.target.value as EntryType | "all")}> 
                <option value="all">todos</option>
                <option value="gasto">gasto</option>
                <option value="entrada">entrada</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Bandeira</Label>
              <Select value={fBrand} onChange={(e) => setFBrand(e.target.value as CardBrand | "all")}>
                <option value="all">todas</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Busca</Label>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="descrição..." />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={listApiCall}
                className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                type="button"
              >
                Simular chamada GET
              </button>
            </div>
            <div className="text-sm text-slate-700">
              <span className="font-medium">Entradas:</span> {moneyBRL(totals.entradas)} &nbsp;|&nbsp;
              <span className="font-medium">Gastos:</span> {moneyBRL(totals.gastos)} &nbsp;|&nbsp;
              <span className="font-medium">Saldo:</span> {moneyBRL(totals.saldo)}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              <div className="col-span-4">Descrição</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-3">Bandeira</div>
              <div className="col-span-2 text-right">Valor</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y divide-slate-200">
              {list.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-slate-500">Nenhum registro.</div>
              ) : (
                list.map((e) => (
                  <div key={e.id} className="grid grid-cols-12 items-center px-3 py-2 text-sm">
                    <div className="col-span-4">
                      <div className="font-medium text-slate-900">{e.description}</div>
                      <div className="text-xs text-slate-500">{new Date(e.createdAt).toLocaleString("pt-BR")}</div>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={
                          e.type === "gasto"
                            ? "inline-flex rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700"
                            : "inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                        }
                      >
                        {e.type}
                      </span>
                    </div>
                    <div className="col-span-3 text-slate-700">{e.cardBrand ?? "-"}</div>
                    <div className="col-span-2 text-right tabular-nums font-semibold text-slate-900">
                      {moneyBRL(e.amount)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => doDelete(e.id)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                        type="button"
                        title="Excluir"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            <div className="font-semibold text-slate-600">Outros endpoints simulados</div>
            <ul className="mt-1 list-disc pl-5">
              <li>GET /api/entries/:id</li>
              <li>DELETE /api/entries/:id</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Console da API (Request/Response)</h2>
              <p className="text-sm text-slate-600">Veja o payload e a resposta JSON retornada pela API.</p>
            </div>
            <div className="text-xs text-slate-500">Persistência: localStorage</div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">Último request</div>
              <JsonBlock value={lastRequest ?? { note: "Nenhuma chamada ainda" }} />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">Última response</div>
              <JsonBlock value={lastResponse ?? data} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">Contrato (modelo)</div>
              <JsonBlock
                value={{
                  ExpenseEntry: {
                    id: "uuid",
                    createdAt: "ISO",
                    type: "gasto | entrada",
                    amount: 99.9,
                    description: "string",
                    cardBrand: "Visa | Mastercard | ... (opcional)",
                  },
                }}
              />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">Erros comuns</div>
              <JsonBlock
                value={{
                  ok: false,
                  error: {
                    message: "Campo 'amount' inválido | Campo 'description' é obrigatório | Campo 'type' inválido",
                  },
                }}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
          Dica: isto é um <span className="font-medium">simulador</span> (front-end). Se você quiser uma API real (Node/Express), posso adaptar.
        </div>
      </footer>
    </div>
  );
}
