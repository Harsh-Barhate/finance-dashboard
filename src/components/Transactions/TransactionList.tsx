import { useState } from 'react'
import {
  Search, SlidersHorizontal, ArrowUpDown, Trash2, Pencil,
  ChevronUp, ChevronDown, Download, Plus, X
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Transaction, ALL_CATEGORIES } from '../../types'
import { formatCurrency, formatDate, applyFilters } from '../../utils/calculations'
import { AddTransactionModal } from './AddTransactionModal'

// Category colour badges
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining':  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'Transport':      'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  'Housing & Rent': 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'Entertainment':  'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
  'Healthcare':     'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  'Shopping':       'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  'Utilities':      'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
  'Education':      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'Salary':         'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  'Freelance':      'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  'Investment':     'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  'Gift':           'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}
const fallbackBadge = 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'

// Export transactions as CSV file
function exportCSV(transactions: Transaction[]) {
  const header = 'Date,Description,Category,Type,Amount\n'
  const rows = transactions
    .map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`)
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function TransactionList() {
  const { transactions, filters, setFilters, resetFilters, deleteTransaction, role } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  // Apply all active filters
  const filtered = applyFilters(transactions, filters)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSort = (field: 'date' | 'amount') => {
    if (filters.sortBy === field) {
      setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
    } else {
      setFilters({ sortBy: field, sortOrder: 'desc' })
    }
    setPage(1)
  }

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={12} className="text-slate-400" />
    return filters.sortOrder === 'asc'
      ? <ChevronUp size={12} className="text-emerald-500" />
      : <ChevronDown size={12} className="text-emerald-500" />
  }

  // Unique month options for the month filter
  const months = Array.from(new Set(transactions.map((t) => t.date.slice(0, 7)))).sort().reverse()

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions…"
              value={filters.search}
              onChange={(e) => { setFilters({ search: e.target.value }); setPage(1) }}
              className="input-base pl-9"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            {/* Toggle filter panel */}
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`btn-secondary flex items-center gap-1.5 ${showFilters ? 'ring-2 ring-emerald-500/40' : ''}`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
              {(filters.type !== 'all' || filters.category !== 'all' || filters.month !== 'all') && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            {/* Export CSV */}
            <button
              onClick={() => exportCSV(filtered)}
              className="btn-secondary flex items-center gap-1.5"
              title="Export as CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Add transaction — admin only */}
            {role === 'admin' && (
              <button
                onClick={() => { setEditingTx(null); setShowModal(true) }}
                className="btn-primary flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Filter panel (collapsible) ────────────────── */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">

            {/* Type filter */}
            <div>
              <label className="label-base">Type</label>
              <select
                value={filters.type}
                onChange={(e) => { setFilters({ type: e.target.value as typeof filters.type }); setPage(1) }}
                className="input-base"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label className="label-base">Category</label>
              <select
                value={filters.category}
                onChange={(e) => { setFilters({ category: e.target.value as typeof filters.category }); setPage(1) }}
                className="input-base"
              >
                <option value="all">All categories</option>
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Month filter */}
            <div>
              <label className="label-base">Month</label>
              <select
                value={filters.month}
                onChange={(e) => { setFilters({ month: e.target.value }); setPage(1) }}
                className="input-base"
              >
                <option value="all">All months</option>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Reset button */}
            <div className="flex items-end">
              <button
                onClick={() => { resetFilters(); setPage(1) }}
                className="btn-secondary w-full flex items-center justify-center gap-1"
              >
                <X size={13} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Results count ────────────────────────────────── */}
      <div className="px-5 py-2 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> transactions
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Page {page} of {Math.max(1, totalPages)}
        </p>
      </div>

      {/* ── Table ────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {/* Date — sortable */}
              <th className="text-left px-5 py-3">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Date <SortIcon field="date" />
                </button>
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Description
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Type
              </th>
              {/* Amount — sortable */}
              <th className="text-right px-5 py-3">
                <button
                  onClick={() => handleSort('amount')}
                  className="ml-auto flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Amount <SortIcon field="amount" />
                </button>
              </th>
              {/* Admin actions column */}
              {role === 'admin' && (
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5} className="text-center py-16">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">No transactions found</p>
                  <button onClick={() => { resetFilters(); setPage(1) }} className="mt-2 text-xs text-emerald-500 hover:underline">
                    Clear filters
                  </button>
                </td>
              </tr>
            ) : (
              paginated.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Date */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="font-num text-xs text-slate-600 dark:text-slate-400">
                      {formatDate(tx.date)}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="px-5 py-3.5 max-w-[200px]">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {tx.description}
                    </p>
                    {tx.note && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{tx.note}</p>
                    )}
                  </td>

                  {/* Category badge */}
                  <td className="px-5 py-3.5">
                    <span className={`
                      inline-block px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap
                      ${CATEGORY_COLORS[tx.category] ?? fallbackBadge}
                    `}>
                      {tx.category}
                    </span>
                  </td>

                  {/* Type badge */}
                  <td className="px-5 py-3.5">
                    <span className={tx.type === 'income' ? 'badge-income' : 'badge-expense'}>
                      {tx.type === 'income' ? '↑' : '↓'} {tx.type}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-num font-bold text-sm ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Admin actions */}
                  {role === 'admin' && (
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingTx(tx); setShowModal(true) }}
                          className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this transaction?')) {
                              deleteTransaction(tx.id)
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2)
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  p === page
                    ? 'bg-emerald-500 text-white'
                    : 'btn-secondary'
                }`}
              >
                {p}
              </button>
            ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────── */}
      {showModal && (
        <AddTransactionModal
          editingTx={editingTx}
          onClose={() => { setShowModal(false); setEditingTx(null) }}
        />
      )}
    </div>
  )
}
