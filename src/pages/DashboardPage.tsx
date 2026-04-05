import { useStore } from '../store/useStore'
import { SummaryCards } from '../components/Dashboard/SummaryCards'
import { BalanceTrendChart } from '../components/Dashboard/BalanceTrendChart'
import { SpendingBreakdownChart } from '../components/Dashboard/SpendingBreakdownChart'
import { TransactionList } from '../components/Transactions/TransactionList'
import {
  computeSummary,
  buildMonthlyTrend,
  buildCategoryBreakdown,
  totalExpenses,
  txsInMonth,
  currentMonthKey,
} from '../utils/calculations'

export function DashboardPage() {
  const { transactions } = useStore()

  // Derived data (computed fresh each render — fast with ~100 transactions)
  const summary = computeSummary(transactions)
  const trendData = buildMonthlyTrend(transactions, 6)
  const breakdownData = buildCategoryBreakdown(transactions)
  const thisMonthTxs = txsInMonth(transactions, currentMonthKey())
  const thisMonthExpenses = totalExpenses(thisMonthTxs)

  return (
    <div className="space-y-6 pb-20 md:pb-6 page-enter">

      {/* ── Summary cards ─────────────────────────────────────── */}
      <SummaryCards summary={summary} />

      {/* ── Charts row ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Trend chart takes 3/5 width on large screens */}
        <div className="lg:col-span-3">
          <BalanceTrendChart data={trendData} />
        </div>
        {/* Breakdown chart takes 2/5 */}
        <div className="lg:col-span-2">
          <SpendingBreakdownChart
            data={breakdownData}
            totalExpenses={thisMonthExpenses}
          />
        </div>
      </div>

      {/* ── Recent transactions ───────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-heading">Recent Transactions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {transactions.length} total records
          </p>
        </div>
        <TransactionList />
      </div>
    </div>
  )
}
