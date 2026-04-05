import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CategorySpend } from '../../types'
import { formatCurrency } from '../../utils/calculations'

interface SpendingBreakdownChartProps {
  data: CategorySpend[]
  totalExpenses: number
}

// Custom label in the centre of the donut
function CentreLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="Plus Jakarta Sans">
        Total Spent
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="currentColor" fontSize={14} fontWeight={700} fontFamily="DM Mono">
        {formatCurrency(total)}
      </text>
    </g>
  )
}

// Custom tooltip
function CustomTooltip({ active, payload }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: CategorySpend }>
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl px-3 py-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
      </div>
      <p className="font-num text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.value)}</p>
    </div>
  )
}

export function SpendingBreakdownChart({ data, totalExpenses }: SpendingBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 card-hover flex flex-col items-center justify-center min-h-[280px]">
        <p className="text-4xl mb-2">🎉</p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No expenses this month!</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 card-hover">
      {/* Header */}
      <div className="mb-4">
        <h3 className="section-heading">Spending Breakdown</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Expenses by category — this month
        </p>
      </div>

      {/* Chart + Legend side by side */}
      <div className="flex flex-col sm:flex-row items-center gap-4">

        {/* Donut */}
        <div className="shrink-0 w-44 h-44 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
                {/* Centre label — positioned manually */}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Total</span>
            <span className="font-num text-sm font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>

        {/* Legend list */}
        <ul className="flex-1 space-y-2 min-w-0 w-full">
          {data.slice(0, 7).map((item) => {
            const pct = totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0
            return (
              <li key={item.name} className="flex items-center gap-2">
                {/* Colour dot */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {/* Label + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mr-2">
                      {item.name}
                    </span>
                    <span className="font-num text-xs text-slate-500 dark:text-slate-400 shrink-0">
                      {pct}%
                    </span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full progress-bar"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
