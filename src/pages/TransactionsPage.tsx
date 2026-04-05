import { TransactionList } from '../components/Transactions/TransactionList'
import { useStore } from '../store/useStore'
import { formatCurrency, totalIncome, totalExpenses, applyFilters } from '../utils/calculations'
import { ArrowDownLeft, ArrowUpRight, Hash } from 'lucide-react'

export function TransactionsPage() {
  const { transactions, filters, role } = useStore()
  const filtered = applyFilters(transactions, filters)

  const filteredIncome   = totalIncome(filtered)
  const filteredExpenses = totalExpenses(filtered)

  return (
    <div className="space-y-5 pb-20 md:pb-6 page-enter">

      {/* ── Quick stats for the current filter result ──────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <Hash size={14} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Transactions</p>
            <p className="font-num text-lg font-bold text-slate-900 dark:text-white">{filtered.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <ArrowDownLeft size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Income</p>
            <p className="font-num text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(filteredIncome)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <ArrowUpRight size={14} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Expenses</p>
            <p className="font-num text-lg font-bold text-red-600 dark:text-red-400">
              {formatCurrency(filteredExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Viewer notice */}
      {role === 'viewer' && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
          <span className="text-base">👁️</span>
          <span>
            <strong>Viewer mode:</strong> You can browse and filter transactions, but adding or editing requires Admin access.
            Switch your role in the header to try Admin features.
          </span>
        </div>
      )}

      {/* ── Main transaction list ───────────────────────────── */}
      <TransactionList />
    </div>
  )
}
