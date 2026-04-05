/**
 * Zustand Store — Single source of truth for the Finance Dashboard.
 *
 * We use the `persist` middleware so data survives page refreshes
 * (stored in localStorage). The store manages:
 *   • transactions list
 *   • budget goals
 *   • UI state: role, theme, current page, filters
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Transaction, Role, Theme, Page, FilterState, BudgetGoal, ExpenseCategory,} from '../types'
import { initialTransactions, initialBudgetGoals } from '../data/mockData'

interface AppState {
  transactions: Transaction[]
  budgetGoals: BudgetGoal[]

  role: Role
  theme: Theme
  activePage: Page
  filters: FilterState

  setRole: (role: Role) => void
  toggleTheme: () => void
  setActivePage: (page: Page) => void
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  setFilters: (partial: Partial<FilterState>) => void
  resetFilters: () => void

  updateBudgetGoal: (category: ExpenseCategory, limit: number) => void
}

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
  month: 'all',
}

// ─── Store definition ─────────────────────────────────────────────────────────

export const useStore = create<AppState>()(persist((set) => ({
      transactions: initialTransactions,
      budgetGoals: initialBudgetGoals,
      role: 'admin',
      theme: 'dark',
      activePage: 'dashboard',
      filters: defaultFilters,

      // ── Role & Theme ─────────────────────────────────
      setRole: (role) => set({ role }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      // ── Navigation ───────────────────────────────────
      setActivePage: (activePage) => set({ activePage }),

      // ── CRUD: Transactions ───────────────────────────
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: Math.random().toString(36).substr(2, 9) },
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // ── Filters ──────────────────────────────────────
      setFilters: (partial) =>
        set((state) => ({ filters: { ...state.filters, ...partial } })),

      resetFilters: () => set({ filters: defaultFilters }),

      // ── Budget Goals ─────────────────────────────────
      updateBudgetGoal: (category, limit) =>
        set((state) => ({
          budgetGoals: state.budgetGoals.map((g) =>
            g.category === category ? { ...g, monthlyLimit: limit } : g
          ),
        })),
    }),
    {
      name: 'finlens-storage', // key in localStorage
      // only persist data + preferences (not filters, active page)
      partialize: (state: AppState) => ({
        transactions: state.transactions,
        budgetGoals: state.budgetGoals,
        role: state.role,
        theme: state.theme,
      }),
    }
  )
)
