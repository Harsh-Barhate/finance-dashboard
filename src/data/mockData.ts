import { Transaction, BudgetGoal } from '../types'

// ─────────────────────────────────────────────
//  Realistic mock data — 6 months of history
//  Amounts are in Indian Rupees (₹)
// ─────────────────────────────────────────────

const id = () => Math.random().toString(36).substr(2, 9)

export const initialTransactions: Transaction[] = [
  // ── April 2026 ──────────────────────────────
  { id: id(), date: '2026-04-01', amount: 90000, type: 'income',  category: 'Salary',         description: 'April Salary' },
  { id: id(), date: '2026-04-02', amount: 1350,  type: 'expense', category: 'Food & Dining',   description: 'Weekly groceries' },
  { id: id(), date: '2026-04-03', amount: 450,   type: 'expense', category: 'Transport',        description: 'Metro monthly pass' },
  { id: id(), date: '2026-04-04', amount: 16000, type: 'expense', category: 'Housing & Rent',   description: 'April rent' },
  { id: id(), date: '2026-04-05', amount: 699,   type: 'expense', category: 'Entertainment',    description: 'Netflix subscription' },

  // ── March 2026 ──────────────────────────────
  { id: id(), date: '2026-03-01', amount: 90000, type: 'income',  category: 'Salary',          description: 'March Salary' },
  { id: id(), date: '2026-03-03', amount: 1200,  type: 'expense', category: 'Food & Dining',   description: 'Weekly groceries' },
  { id: id(), date: '2026-03-05', amount: 16000, type: 'expense', category: 'Housing & Rent',  description: 'March rent' },
  { id: id(), date: '2026-03-07', amount: 4500,  type: 'income',  category: 'Freelance',       description: 'Logo design project' },
  { id: id(), date: '2026-03-09', amount: 450,   type: 'expense', category: 'Transport',       description: 'Metro pass' },
  { id: id(), date: '2026-03-10', amount: 699,   type: 'expense', category: 'Entertainment',   description: 'Netflix' },
  { id: id(), date: '2026-03-12', amount: 2400,  type: 'expense', category: 'Shopping',        description: 'New sneakers' },
  { id: id(), date: '2026-03-14', amount: 650,   type: 'expense', category: 'Food & Dining',   description: 'Team lunch' },
  { id: id(), date: '2026-03-17', amount: 1800,  type: 'expense', category: 'Healthcare',      description: 'Doctor visit & medicines' },
  { id: id(), date: '2026-03-20', amount: 5500,  type: 'income',  category: 'Investment',      description: 'Mutual fund dividend' },
  { id: id(), date: '2026-03-21', amount: 980,   type: 'expense', category: 'Utilities',       description: 'Electricity + internet bill' },
  { id: id(), date: '2026-03-24', amount: 720,   type: 'expense', category: 'Food & Dining',   description: 'Weekend dining out' },
  { id: id(), date: '2026-03-27', amount: 3500,  type: 'expense', category: 'Education',       description: 'Udemy courses bundle' },
  { id: id(), date: '2026-03-29', amount: 320,   type: 'expense', category: 'Transport',       description: 'Cab rides' },

  // ── February 2026 ───────────────────────────
  { id: id(), date: '2026-02-01', amount: 90000, type: 'income',  category: 'Salary',          description: 'February Salary' },
  { id: id(), date: '2026-02-02', amount: 1100,  type: 'expense', category: 'Food & Dining',   description: 'Groceries' },
  { id: id(), date: '2026-02-03', amount: 16000, type: 'expense', category: 'Housing & Rent',  description: 'February rent' },
  { id: id(), date: '2026-02-07', amount: 3200,  type: 'income',  category: 'Freelance',       description: 'Website copy writing' },
  { id: id(), date: '2026-02-10', amount: 3800,  type: 'expense', category: 'Shopping',        description: "Valentine's Day gift" },
  { id: id(), date: '2026-02-14', amount: 2200,  type: 'expense', category: 'Food & Dining',   description: "Valentine's dinner" },
  { id: id(), date: '2026-02-15', amount: 450,   type: 'expense', category: 'Transport',       description: 'Metro pass' },
  { id: id(), date: '2026-02-18', amount: 699,   type: 'expense', category: 'Entertainment',   description: 'Netflix' },
  { id: id(), date: '2026-02-19', amount: 920,   type: 'expense', category: 'Utilities',       description: 'Bills' },
  { id: id(), date: '2026-02-22', amount: 7000,  type: 'income',  category: 'Investment',      description: 'Stock dividend (Q4)' },
  { id: id(), date: '2026-02-25', amount: 850,   type: 'expense', category: 'Food & Dining',   description: 'Eating out' },
  { id: id(), date: '2026-02-27', amount: 1200,  type: 'expense', category: 'Healthcare',      description: 'Dental checkup' },

  // ── January 2026 ────────────────────────────
  { id: id(), date: '2026-01-01', amount: 90000, type: 'income',  category: 'Salary',          description: 'January Salary' },
  { id: id(), date: '2026-01-03', amount: 3200,  type: 'expense', category: 'Shopping',        description: 'New Year shopping spree' },
  { id: id(), date: '2026-01-04', amount: 16000, type: 'expense', category: 'Housing & Rent',  description: 'January rent' },
  { id: id(), date: '2026-01-06', amount: 1350,  type: 'expense', category: 'Food & Dining',   description: 'Groceries' },
  { id: id(), date: '2026-01-10', amount: 6000,  type: 'income',  category: 'Freelance',       description: 'Mobile app UI design' },
  { id: id(), date: '2026-01-13', amount: 450,   type: 'expense', category: 'Transport',       description: 'Metro pass' },
  { id: id(), date: '2026-01-15', amount: 1400,  type: 'expense', category: 'Entertainment',   description: 'Cinema + streaming apps' },
  { id: id(), date: '2026-01-19', amount: 980,   type: 'expense', category: 'Utilities',       description: 'Bills' },
  { id: id(), date: '2026-01-23', amount: 4200,  type: 'expense', category: 'Healthcare',      description: 'Annual health checkup' },
  { id: id(), date: '2026-01-28', amount: 2200,  type: 'expense', category: 'Education',       description: 'React course' },
  { id: id(), date: '2026-01-30', amount: 500,   type: 'income',  category: 'Gift',            description: 'Birthday gift money' },

  // ── December 2025 ───────────────────────────
  { id: id(), date: '2025-12-01', amount: 90000, type: 'income',  category: 'Salary',          description: 'December Salary' },
  { id: id(), date: '2025-12-04', amount: 16000, type: 'expense', category: 'Housing & Rent',  description: 'December rent' },
  { id: id(), date: '2025-12-06', amount: 8500,  type: 'expense', category: 'Shopping',        description: 'Christmas shopping' },
  { id: id(), date: '2025-12-08', amount: 1400,  type: 'expense', category: 'Food & Dining',   description: 'Groceries' },
  { id: id(), date: '2025-12-10', amount: 6000,  type: 'income',  category: 'Investment',      description: 'Year-end dividend payout' },
  { id: id(), date: '2025-12-12', amount: 3800,  type: 'income',  category: 'Freelance',       description: 'Holiday season project' },
  { id: id(), date: '2025-12-17', amount: 450,   type: 'expense', category: 'Transport',       description: 'Metro pass' },
  { id: id(), date: '2025-12-20', amount: 5500,  type: 'expense', category: 'Entertainment',   description: 'Holiday travel & parties' },
  { id: id(), date: '2025-12-25', amount: 2400,  type: 'expense', category: 'Food & Dining',   description: 'Christmas dinner & celebrations' },
  { id: id(), date: '2025-12-27', amount: 980,   type: 'expense', category: 'Utilities',       description: 'Bills' },
  { id: id(), date: '2025-12-29', amount: 699,   type: 'expense', category: 'Entertainment',   description: 'Streaming subscriptions' },

  // ── November 2025 ───────────────────────────
  { id: id(), date: '2025-11-01', amount: 85000, type: 'income',  category: 'Salary',          description: 'November Salary' },
  { id: id(), date: '2025-11-02', amount: 16000, type: 'expense', category: 'Housing & Rent',  description: 'November rent' },
  { id: id(), date: '2025-11-05', amount: 1100,  type: 'expense', category: 'Food & Dining',   description: 'Groceries' },
  { id: id(), date: '2025-11-08', amount: 2800,  type: 'income',  category: 'Freelance',       description: 'Content writing batch' },
  { id: id(), date: '2025-11-12', amount: 450,   type: 'expense', category: 'Transport',       description: 'Metro pass' },
  { id: id(), date: '2025-11-15', amount: 920,   type: 'expense', category: 'Utilities',       description: 'Bills' },
  { id: id(), date: '2025-11-20', amount: 2100,  type: 'expense', category: 'Shopping',        description: 'Black Friday deals' },
  { id: id(), date: '2025-11-22', amount: 699,   type: 'expense', category: 'Entertainment',   description: 'Streaming' },
  { id: id(), date: '2025-11-25', amount: 850,   type: 'expense', category: 'Food & Dining',   description: 'Dining out' },
  { id: id(), date: '2025-11-28', amount: 1500,  type: 'expense', category: 'Healthcare',      description: 'Eye checkup & glasses' },

  // ── October 2025 ────────────────────────────
  { id: id(), date: '2025-10-01', amount: 85000, type: 'income',  category: 'Salary',          description: 'October Salary' },
  { id: id(), date: '2025-10-02', amount: 16000, type: 'expense', category: 'Housing & Rent',  description: 'October rent' },
  { id: id(), date: '2025-10-05', amount: 1200,  type: 'expense', category: 'Food & Dining',   description: 'Groceries' },
  { id: id(), date: '2025-10-08', amount: 4000,  type: 'income',  category: 'Freelance',       description: 'Dashboard UI project' },
  { id: id(), date: '2025-10-11', amount: 450,   type: 'expense', category: 'Transport',       description: 'Metro pass' },
  { id: id(), date: '2025-10-14', amount: 980,   type: 'expense', category: 'Utilities',       description: 'Bills' },
  { id: id(), date: '2025-10-18', amount: 3000,  type: 'income',  category: 'Investment',      description: 'Q3 stock dividend' },
  { id: id(), date: '2025-10-20', amount: 1600,  type: 'expense', category: 'Entertainment',   description: 'Diwali events & streaming' },
  { id: id(), date: '2025-10-22', amount: 3200,  type: 'expense', category: 'Shopping',        description: 'Diwali shopping' },
  { id: id(), date: '2025-10-25', amount: 699,   type: 'expense', category: 'Entertainment',   description: 'Netflix' },
  { id: id(), date: '2025-10-28', amount: 900,   type: 'expense', category: 'Food & Dining',   description: 'Diwali sweets & dining' },
]

// Default monthly budget goals (all expense categories)
export const initialBudgetGoals: BudgetGoal[] = [
  { category: 'Food & Dining',  monthlyLimit: 4000 },
  { category: 'Transport',      monthlyLimit: 1000 },
  { category: 'Entertainment',  monthlyLimit: 2000 },
  { category: 'Shopping',       monthlyLimit: 5000 },
  { category: 'Utilities',      monthlyLimit: 1500 },
  { category: 'Healthcare',     monthlyLimit: 3000 },
  { category: 'Education',      monthlyLimit: 4000 },
]
