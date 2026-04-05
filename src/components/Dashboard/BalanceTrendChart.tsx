import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { MonthlyData } from '../../types'
import { formatCurrency } from '../../utils/calculations'
import { useStore } from '../../store/useStore'

interface BalanceTrendChartProps {
  data: MonthlyData[]
}

// Custom tooltip that shows all three values on hover
function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      rounded-xl shadow-xl p-3 min-w-[160px]
    ">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{item.name}</span>
          </div>
          <span className="font-num text-xs font-bold text-slate-900 dark:text-white">
            {formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function BalanceTrendChart({ data }: BalanceTrendChartProps) {
  const { theme } = useStore()
  const isDark = theme === 'dark'

  const gridColor = isDark ? '#1e293b' : '#f1f5f9'
  const axisColor = isDark ? '#475569' : '#94a3b8'

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 card-hover">
      {/* Header */}
      <div className="mb-5">
        <h3 className="section-heading">Balance Trend</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Income vs Expenses over the last 6 months
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: axisColor, fontFamily: 'Plus Jakarta Sans' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 10, fill: axisColor, fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
            }
            width={48}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: '11px',
              fontFamily: 'Plus Jakarta Sans',
              paddingTop: '12px',
            }}
          />

          {/* Income line */}
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          />

          {/* Expenses line */}
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
          />

          {/* Net balance line */}
          <Line
            type="monotone"
            dataKey="balance"
            name="Net Balance"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
