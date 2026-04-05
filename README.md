# 💸 FinLens — Finance Dashboard

A clean, interactive personal finance dashboard built as an internship screening assignment for Zorvyn FinTech.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher  
- **npm** v9 or higher

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Zustand** | Global state management (with localStorage persistence) |
| **Recharts** | Charts & visualizations |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon set |
| **date-fns** | Date formatting & calculations |
| **Vite** | Build tool & dev server |

---

## ✨ Features

### Core Requirements ✅
| Feature | Details |
|---------|---------|
| **Dashboard Overview** | Total Balance, Monthly Income, Expenses, Savings Rate cards |
| **Time-Based Visualization** | 6-month line chart showing income, expenses & net balance |
| **Categorical Visualization** | Donut chart + legend for spending by category |
| **Transaction List** | Full list with date, description, category badge, type & amount |
| **Transaction Filtering** | Filter by type, category, and month |
| **Search & Sort** | Full-text search + sort by date or amount (asc/desc) |
| **Role-Based UI** | Admin can add/edit/delete; Viewer is read-only |
| **Insights Section** | Health score, auto insights, monthly comparison, top categories |
| **State Management** | Zustand store with localStorage persistence |
| **Responsive Design** | Works on mobile (bottom nav), tablet, and desktop |
| **Dark / Light Mode** | Toggle in the header; preference persists |

### Extra Features 🌟
| Feature | Details |
|---------|---------|
| **Financial Health Score** | 0–100 computed score based on savings rate & spending trends |
| **Monthly Budget Goals** | Per-category spending limits with visual progress bars |
| **Editable Budget Limits** | Admin can update budget limits directly in the UI |
| **CSV Export** | Download any filtered set of transactions as a CSV file |
| **Pagination** | Transaction list paginates at 12 rows per page |
| **Animated UI** | Smooth slide-up page transitions, progress bar animations |
| **Empty States** | Friendly messages when no data or no search results |
| **Custom Tooltips** | Rich hover tooltips on all charts |

---

## 📁 Project Structure

```
src/
├── types/
│   └── index.ts          ← All TypeScript types & constants
├── data/
│   └── mockData.ts       ← 6 months of realistic mock transactions
├── store/
│   └── useStore.ts       ← Zustand global store
├── utils/
│   └── calculations.ts   ← Pure functions (summaries, chart data, filters)
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx   ← Desktop sidebar navigation
│   │   └── Header.tsx    ← Top bar with theme + role toggles
│   ├── Dashboard/
│   │   ├── SummaryCards.tsx          ← 4 KPI cards
│   │   ├── BalanceTrendChart.tsx     ← Line chart
│   │   └── SpendingBreakdownChart.tsx ← Donut chart
│   ├── Transactions/
│   │   ├── TransactionList.tsx       ← Filterable table
│   │   └── AddTransactionModal.tsx   ← Add/edit modal (admin only)
│   └── Insights/
│       ├── InsightsSection.tsx       ← Auto-generated insights + bar chart
│       └── BudgetGoals.tsx           ← Budget progress bars
├── pages/
│   ├── DashboardPage.tsx
│   ├── TransactionsPage.tsx
│   └── InsightsPage.tsx
├── App.tsx               ← Root: theme sync + layout
├── main.tsx              ← Entry point
└── index.css             ← Tailwind + custom styles
```

---

## 🔐 Role-Based UI

Switch roles using the **dropdown in the header** (for demo purposes):

| Role | Capabilities |
|------|-------------|
| **Admin** | View all data, add/edit/delete transactions, edit budget goals |
| **Viewer** | View and filter/search data only — no write access |

---

## 💾 Data Persistence

All data (transactions, budget goals, theme, role) is persisted in **localStorage** via Zustand's `persist` middleware under the key `finlens-storage`.

To reset to the original mock data, open DevTools → Application → Local Storage → delete the `finlens-storage` key and refresh.

---

## 🎨 Design Decisions

- **Font**: Plus Jakarta Sans (UI) + DM Mono (numbers & code)
- **Palette**: Emerald for income/positive, Red for expenses, Blue for totals
- **Theme**: Both dark (default) and light modes, toggled without a page reload
- **Layout**: Sidebar on desktop, bottom tab bar on mobile

---

## 📝 Assumptions Made

1. All monetary values are in **Indian Rupees (₹)**
2. "Current month" is computed dynamically from `new Date()`
3. The mock data covers Oct 2025 – Apr 2026 to give meaningful 6-month charts
4. No backend — all data lives in the browser's localStorage

---

*Built by Harsh Barhate for the Zorvyn Frontend Developer Intern assignment.*
