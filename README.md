<div align="center">

# 💰 ApiFinanceira

### Simulador de API RESTful para Gestão Financeira

[![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Sobre o Projeto

**ApiFinanceira** é um simulador front-end completo de API para controle financeiro pessoal. Diferente de uma aplicação tradicional, este projeto **simula endpoints de API** (`GET`, `POST`, `DELETE`) sem necessidade de backend, usando `localStorage` para persistência.

### 🎯 Ideal para:
- 📚 **Estudos** de integração com APIs RESTful
- 🎨 **Prototipação** rápida de sistemas financeiros
- 📊 **Demonstrações** de controle de gastos e entradas
- 🧪 **Testes** de interfaces sem dependência de servidor

---

## ✨ Funcionalidades

### Endpoints Simulados

#### `POST /api/entries`
Cria uma nova transação financeira (gasto ou entrada).

**Body:**
```json
{
  "type": "gasto",
  "amount": 99.90,
  "description": "Mercado",
  "cardBrand": "Mastercard"
}
```

#### `GET /api/entries`
Lista todas as transações com filtros opcionais.

**Query params:**
- `type`: `gasto` | `entrada` | `all`
- `cardBrand`: `Visa` | `Mastercard` | `Elo` | etc.
- `q`: busca textual na descrição

#### `DELETE /api/entries/:id`
Remove uma transação específica.

### Recursos da Interface

✅ **Criação de Transações**
- Cadastro de gastos e entradas
- Suporte a múltiplas bandeiras de cartão
- Validação de campos em tempo real

✅ **Listagem Inteligente**
- Filtros por tipo, bandeira e descrição
- Cálculos automáticos de totais (entradas, gastos, saldo)
- Tabela responsiva com formatação BRL

✅ **Console de API**
- Visualização de requests e responses em JSON
- Exemplos de contratos e erros
- Documentação integrada

✅ **Gestão de Dados**
- Inserção de dados demo para testes
- Limpeza completa do localStorage
- Persistência automática

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/TaylorReis-lab/ApiFinanceira.git
cd ApiFinanceira
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse no navegador**
```
http://localhost:5173
```

---

## 🏗️ Estrutura do Projeto

```
ApiFinanceira/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Field.tsx       # Inputs, Selects, Textareas
│   │   └── JsonBlock.tsx   # Exibição formatada de JSON
│   ├── lib/
│   │   └── api.ts          # Lógica de simulação da API
│   ├── utils/              # Utilitários gerais
│   ├── types.ts            # Tipos TypeScript
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globais
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎨 Stack Tecnológica

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 19.2.3 | UI components e state management |
| **TypeScript** | 5.9.3 | Type safety e developer experience |
| **Vite** | 7.2.4 | Build tool e dev server |
| **TailwindCSS** | 4.1.17 | Estilização utility-first |
| **clsx** | 2.1.1 | Composição de classes CSS |

---

## 💾 Persistência de Dados

Os dados são armazenados no **localStorage** do navegador com a chave:
```javascript
gastos_api_entries_v1
```

### Estrutura do Dado
```typescript
interface ExpenseEntry {
  id: string;              // UUID v4
  createdAt: string;       // ISO 8601
  type: "gasto" | "entrada";
  amount: number;          // valor em reais
  description: string;
  cardBrand?: CardBrand;   // opcional
}
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

---

## 📖 Uso e Exemplos

### Criar um Gasto
1. Selecione o tipo: **gasto**
2. Insira o valor: `49.90`
3. Descrição: `Lanche`
4. Bandeira (opcional): `Visa`
5. Clique em **Enviar**

### Filtrar Transações
1. No painel **GET /api/entries**
2. Selecione filtros desejados
3. As transações são atualizadas automaticamente
4. Clique em **Simular chamada GET** para ver o JSON

### Inserir Dados Demo
Clique no botão **Inserir dados demo** no topo da página para popular a aplicação com transações de exemplo.

---

## 🎯 Casos de Uso

### 1. Protótipo de Sistema Financeiro
Use como base para demonstrar funcionalidades antes de desenvolver o backend completo.

### 2. Aprendizado de APIs
Estude como uma API REST funciona sem complexidade de servidor e banco de dados.

### 3. Interface de Teste
Desenvolva e teste UIs de aplicações financeiras com dados realistas.

---

## 🚧 Próximos Passos

- [ ] Migração para API real (Node.js + Express + MongoDB)
- [ ] Autenticação de usuários
- [ ] Gráficos de despesas com Chart.js
- [ ] Exportação de dados (CSV/PDF)
- [ ] Categorias personalizadas
- [ ] Multi-moeda
- [ ] PWA para uso offline

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 👨‍💻 Autor

**Taylor Reis**

[![GitHub](https://img.shields.io/badge/GitHub-TaylorReis--lab-181717?style=flat&logo=github)](https://github.com/TaylorReis-lab)

---

## ⭐ Mostre seu apoio

Se este projeto foi útil para você, considere dar uma ⭐️!

---

<div align="center">

Desenvolvido com 💙 por [Taylor Reis](https://github.com/TaylorReis-lab)

</div>
