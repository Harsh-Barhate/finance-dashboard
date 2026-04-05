/**
 * Pure utility functions for computing derived financial data.
 * These are kept separate from the store so they're easy to test and reuse.
 */

import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns'
import { Transaction, Summary, MonthlyData, CategorySpend, ExpenseCategory } from '../types'

// ─── Formatting ────────────────────────────────────────────────────────────────

/** Format a number as Indian Rupee currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format a date string like '2026-03-15' → 'Mar 15, 2026' */
export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

/** Format a date string to 'YYYY-MM' for month grouping */
export function toMonthKey(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy-MM')
}

// ─── Aggregation helpers ───────────────────────────────────────────────────────

/** Sum all income transactions */
export function totalIncome(txs: Transaction[]): number {
  return txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
}

/** Sum all expense transactions */
export function totalExpenses(txs: Transaction[]): number {
  return txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
}

/** Filter transactions to a given month (YYYY-MM) */
export function txsInMonth(txs: Transaction[], monthKey: string): Transaction[] {
  return txs.filter((t) => toMonthKey(t.date) === monthKey)
}

/** Get the current month key */
export function currentMonthKey(): string {
  return format(new Date(), 'yyyy-MM')
}

/** Get the previous month key */
export function prevMonthKey(): string {
  return format(subMonths(new Date(), 1), 'yyyy-MM')
}

// ─── Summary computation ──────────────────────────────────────────────────────

export function computeSummary(transactions: Transaction[]): Summary {
  const thisMonth = txsInMonth(transactions, currentMonthKey())
  const lastMonth = txsInMonth(transactions, prevMonthKey())

  const monthlyIncome = totalIncome(thisMonth)
  const monthlyExpenses = totalExpenses(thisMonth)
  const totalBalance = totalIncome(transactions) - totalExpenses(transactions)
  const savingsRate =
    monthlyIncome > 0
      ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : 0

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    prevMonthIncome: totalIncome(lastMonth),
    prevMonthExpenses: totalExpenses(lastMonth),
  }
}

// ─── Chart data ────────────────────────────────────────────────────────────────

/** Build the last N months of income/expense/balance data for the trend chart */
export function buildMonthlyTrend(transactions: Transaction[], months = 6): MonthlyData[] {
  const result: MonthlyData[] = []

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const key = format(date, 'yyyy-MM')
    const label = format(date, 'MMM')
    const txs = txsInMonth(transactions, key)
    const income = totalIncome(txs)
    const expenses = totalExpenses(txs)
    result.push({ month: label, income, expenses, balance: income - expenses })
  }

  return result
}

// Colour palette for spending categories
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining':   '#f59e0b',
  'Transport':       '#3b82f6',
  'Housing & Rent':  '#8b5cf6',
  'Entertainment':   '#ec4899',
  'Healthcare':      '#ef4444',
  'Shopping':        '#f97316',
  'Utilities':       '#06b6d4',
  'Education':       '#10b981',
  'Other':           '#94a3b8',
}

/** Build spending breakdown per category for the current month */
export function buildCategoryBreakdown(transactions: Transaction[]): CategorySpend[] {
  const thisMonth = txsInMonth(transactions, currentMonthKey())
  const expenses = thisMonth.filter((t) => t.type === 'expense')

  const map: Record<string, number> = {}
  expenses.forEach((t) => {
    map[t.category] = (map[t.category] ?? 0) + t.amount
  })

  return Object.entries(map)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value)
}

// ─── Budget helpers ────────────────────────────────────────────────────────────

/** How much has been spent in a given category this month? */
export function spentThisMonth(transactions: Transaction[], category: ExpenseCategory): number {
  const thisMonth = txsInMonth(transactions, currentMonthKey())
  return thisMonth
    .filter((t) => t.type === 'expense' && t.category === category)
    .reduce((s, t) => s + t.amount, 0)
}

// ─── Insights helpers ─────────────────────────────────────────────────────────

/** Compute a simple financial health score (0–100) */
export function computeHealthScore(summary: Summary): number {
  let score = 50

  // Savings rate: 20% = neutral, more = better, negative = bad
  score += Math.min(30, Math.max(-30, (summary.savingsRate - 20) * 1.5))

  // Month-over-month expense change: going down = good
  if (summary.prevMonthExpenses > 0) {
    const change =
      (summary.monthlyExpenses - summary.prevMonthExpenses) / summary.prevMonthExpenses
    score -= change * 20
  }

  return Math.round(Math.min(100, Math.max(0, score)))
}

/** Get the highest spending category this month */
export function topSpendingCategory(transactions: Transaction[]): string | null {
  const breakdown = buildCategoryBreakdown(transactions)
  return breakdown.length > 0 ? breakdown[0].name : null
}

/** Month over month expense change percentage */
export function momExpenseChange(summary: Summary): number {
  if (summary.prevMonthExpenses === 0) return 0
  return Math.round(
    ((summary.monthlyExpenses - summary.prevMonthExpenses) / summary.prevMonthExpenses) * 100
  )
}

/** Filter transactions by FilterState */
export function applyFilters(
  transactions: Transaction[],
  filters: {
    search: string
    type: 'all' | 'income' | 'expense'
    category: string
    sortBy: 'date' | 'amount'
    sortOrder: 'asc' | 'desc'
    month: string
  }
): Transaction[] {
  let result = [...transactions]

  // Search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    )
  }

  // Type filter
  if (filters.type !== 'all') {
    result = result.filter((t) => t.type === filters.type)
  }

  // Category filter
  if (filters.category !== 'all') {
    result = result.filter((t) => t.category === filters.category)
  }

  // Month filter
  if (filters.month !== 'all') {
    result = result.filter((t) => toMonthKey(t.date) === filters.month)
  }

  // Sort
  result.sort((a, b) => {
    const mul = filters.sortOrder === 'asc' ? 1 : -1
    if (filters.sortBy === 'date') {
      return mul * (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)
    } else {
      return mul * (a.amount - b.amount)
    }
  })

  return result
}
