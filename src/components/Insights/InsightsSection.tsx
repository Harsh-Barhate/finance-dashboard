import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from 'recharts'
import { Lightbulb, TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react'
import { useStore } from '../../store/useStore'
import {
  computeSummary,
  buildCategoryBreakdown,
  buildMonthlyTrend,
  computeHealthScore,
  topSpendingCategory,
  momExpenseChange,
  formatCurrency,
} from '../../utils/calculations'

// ─── Health Score Ring ────────────────────────────────────────────────────────

function HealthScoreRing({ score }: { score: number }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 70 ? '#10b981'
    : score >= 40 ? '#f59e0b'
    : '#ef4444'

  const label =
    score >= 70 ? 'Excellent 🎉'
    : score >= 50 ? 'Good 👍'
    : score >= 30 ? 'Fair ⚠️'
    : 'Needs Work 🔧'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor"
            className="text-slate-200 dark:text-slate-800" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-num text-2xl font-bold text-slate-900 dark:text-white" style={{ color }}>
            {score}
          </span>
          <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Score
          </span>
        </div>
      </div>
      <p className="mt-1.5 text-xs font-bold" style={{ color }}>{label}</p>
    </div>
  )
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

interface InsightCardProps {
  icon: React.ReactNode
  title: string
  description: string
  variant: 'positive' | 'negative' | 'neutral'
}

function InsightCard({ icon, title, description, variant }: InsightCardProps) {
  const colours = {
    positive: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    negative: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
    neutral:  'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
  }
  const textColour = {
    positive: 'text-emerald-700 dark:text-emerald-300',
    negative: 'text-red-700 dark:text-red-300',
    neutral:  'text-blue-700 dark:text-blue-300',
  }

  return (
    <div className={`flex gap-3 p-3.5 rounded-xl border ${colours[variant]}`}>
      <div className={`mt-0.5 shrink-0 ${textColour[variant]}`}>{icon}</div>
      <div>
        <p className={`text-xs font-bold mb-0.5 ${textColour[variant]}`}>{title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ─── Month comparison bar chart tooltip ──────────────────────────────────────

function CompTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; fill: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}</span>
          <span className="font-num font-bold text-slate-900 dark:text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InsightsSection() {
  const { transactions, theme } = useStore()
  const isDark = theme === 'dark'

  const summary = computeSummary(transactions)
  const healthScore = computeHealthScore(summary)
  const topCategory = topSpendingCategory(transactions)
  const expenseChange = momExpenseChange(summary)
  const monthlyTrend = buildMonthlyTrend(transactions, 6)
  const breakdown = buildCategoryBreakdown(transactions)

  // Auto-generate insight bullets
  const insights: InsightCardProps[] = []

  if (topCategory) {
    insights.push({
      icon: <AlertTriangle size={14} />,
      title: `Top Spending: ${topCategory}`,
      description: `Your highest expense category this month is "${topCategory}". Consider setting a tighter budget here.`,
      variant: 'neutral',
    })
  }

  if (expenseChange > 0) {
    insights.push({
      icon: <TrendingUp size={14} />,
      title: `Expenses Up ${expenseChange}% This Month`,
      description: `You spent ${formatCurrency(summary.monthlyExpenses - summary.prevMonthExpenses)} more than last month. Review your recent transactions to find opportunities to cut back.`,
      variant: 'negative',
    })
  } else if (expenseChange < 0) {
    insights.push({
      icon: <TrendingDown size={14} />,
      title: `Expenses Down ${Math.abs(expenseChange)}% This Month 🎉`,
      description: `Great job! You saved ${formatCurrency(summary.prevMonthExpenses - summary.monthlyExpenses)} compared to last month.`,
      variant: 'positive',
    })
  }

  if (summary.savingsRate >= 20) {
    insights.push({
      icon: <Award size={14} />,
      title: `${summary.savingsRate}% Savings Rate — Great!`,
      description: 'Financial advisors recommend saving at least 20% of income. You\'re right on track — keep it up!',
      variant: 'positive',
    })
  } else {
    insights.push({
      icon: <Lightbulb size={14} />,
      title: `Savings Rate is ${summary.savingsRate}%`,
      description: `Aim for 20% savings. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. You need to save ${formatCurrency(summary.monthlyIncome * 0.2 - (summary.monthlyIncome - summary.monthlyExpenses))} more.`,
      variant: summary.savingsRate >= 10 ? 'neutral' : 'negative',
    })
  }

  const gridColor = isDark ? '#1e293b' : '#f1f5f9'
  const axisColor = isDark ? '#475569' : '#94a3b8'

  return (
    <div className="space-y-6">

      {/* ── Row 1: Health score + Insights ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Financial Health Score card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4 card-hover">
          <div>
            <h3 className="section-heading">Financial Health Score</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Based on savings rate & spending trends
            </p>
          </div>
          <HealthScoreRing score={healthScore} />
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
            Score is computed from your savings rate, expense trends, and budget adherence.
          </p>
        </div>

        {/* Auto-generated insights */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Lightbulb size={13} className="text-amber-500" />
            </div>
            <h3 className="section-heading">Smart Insights</h3>
          </div>
          <div className="space-y-2.5">
            {insights.map((ins, i) => (
              <InsightCard key={i} {...ins} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Monthly comparison bar chart ──────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 card-hover">
        <div className="mb-5">
          <h3 className="section-heading">Monthly Income vs Expenses</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Side-by-side comparison for the last 6 months
          </p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyTrend} barCategoryGap="30%" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: axisColor, fontFamily: 'Plus Jakarta Sans' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: axisColor, fontFamily: 'DM Mono' }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
              width={48}
            />
            <Tooltip content={<CompTooltip />} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Row 3: Top spending categories this month ─────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 card-hover">
        <div className="mb-5">
          <h3 className="section-heading">Top Spending Categories</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ranked by amount spent this month</p>
        </div>

        {breakdown.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No expenses recorded this month</p>
        ) : (
          <div className="space-y-3">
            {breakdown.slice(0, 6).map((item, index) => {
              const totalSpent = breakdown.reduce((s, i) => s + i.value, 0)
              const pct = totalSpent > 0 ? Math.round((item.value / totalSpent) * 100) : 0
              return (
                <div key={item.name} className="flex items-center gap-3">
                  {/* Rank */}
                  <span className="font-num text-xs font-bold text-slate-400 dark:text-slate-500 w-4 text-center">
                    {index + 1}
                  </span>
                  {/* Bar + label */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                      <span className="font-num text-xs font-bold text-slate-600 dark:text-slate-400">
                        {formatCurrency(item.value)} <span className="text-slate-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
