export type Role = 'admin' | 'viewer'
export type Theme = 'dark' | 'light'
export type TransactionType = 'income' | 'expense'
export type Page = 'dashboard' | 'transactions' | 'insights'

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Housing & Rent',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Utilities',
  'Education',
  'Other',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other Income',
] as const

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type Category = ExpenseCategory | IncomeCategory

// A single financial transaction
export interface Transaction {
  id: string
  date: string 
  amount: number 
  category: Category
  type: TransactionType
  description: string
  note?: string
}

// State for the transaction filter/search panel
export interface FilterState {
  search: string
  type: 'all' | TransactionType
  category: 'all' | Category
  sortBy: 'date' | 'amount'
  sortOrder: 'asc' | 'desc'
  month: string 
}

// Monthly budget goals (used in Insights)
export interface BudgetGoal {
  category: ExpenseCategory
  monthlyLimit: number
}

// Computed summary numbers
export interface Summary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  prevMonthIncome: number
  prevMonthExpenses: number
}

// Data shape for a single month in the balance trend chart
export interface MonthlyData {
  month: string  
  income: number
  expenses: number
  balance: number
}

// Data shape for the spending breakdown donut chart
export interface CategorySpend {
  name: string
  value: number
  color: string
}
