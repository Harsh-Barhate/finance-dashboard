import { TrendingUp, TrendingDown, Minus, DollarSign, ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react'
import { Summary } from '../../types'
import { formatCurrency } from '../../utils/calculations'

interface SummaryCardsProps {
  summary: Summary
}

interface CardData {
  title: string
  value: string
  changeLabel: string
  changePositive: boolean | null  // null = neutral
  icon: React.ReactNode
  styleClass: string
  iconBg: string
  iconColor: string
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  // Month-over-month changes
  const incomeChange = summary.prevMonthIncome > 0
    ? Math.round(((summary.monthlyIncome - summary.prevMonthIncome) / summary.prevMonthIncome) * 100)
    : 0

  const expenseChange = summary.prevMonthExpenses > 0
    ? Math.round(((summary.monthlyExpenses - summary.prevMonthExpenses) / summary.prevMonthExpenses) * 100)
    : 0

  const cards: CardData[] = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.totalBalance),
      changeLabel: 'All time net worth',
      changePositive: summary.totalBalance >= 0 ? true : false,
      icon: <DollarSign size={18} />,
      styleClass: 'stat-card-balance',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(summary.monthlyIncome),
      changeLabel: `${incomeChange >= 0 ? '+' : ''}${incomeChange}% vs last month`,
      changePositive: incomeChange >= 0,
      icon: <ArrowDownLeft size={18} />,
      styleClass: 'stat-card-income',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summary.monthlyExpenses),
      changeLabel: `${expenseChange >= 0 ? '+' : ''}${expenseChange}% vs last month`,
      // For expenses: going UP is bad, going DOWN is good
      changePositive: expenseChange <= 0,
      icon: <ArrowUpRight size={18} />,
      styleClass: 'stat-card-expense',
      iconBg: 'bg-red-500',
      iconColor: 'text-white',
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      changeLabel:
        summary.savingsRate >= 20
          ? 'Great! Above 20% target 🎯'
          : 'Below 20% target — keep going!',
      changePositive: summary.savingsRate >= 20,
      icon: <PiggyBank size={18} />,
      styleClass: 'stat-card-savings',
      iconBg: 'bg-violet-500',
      iconColor: 'text-white',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`
            ${card.styleClass}
            rounded-2xl p-5
            border border-slate-200 dark:border-slate-800
            card-hover cursor-default
            animate-slide-up
          `}
        >
          {/* Top row: title + icon */}
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <div className={`w-8 h-8 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shadow-sm`}>
              {card.icon}
            </div>
          </div>

          {/* Big number */}
          <p className="font-num text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            {card.value}
          </p>

          {/* Change indicator */}
          <div className="flex items-center gap-1">
            {card.changePositive === true && (
              <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            {card.changePositive === false && (
              <TrendingDown size={12} className="text-red-600 dark:text-red-400 shrink-0" />
            )}
            {card.changePositive === null && (
              <Minus size={12} className="text-slate-400 shrink-0" />
            )}
            <p className={`text-xs font-semibold ${
              card.changePositive === true
                ? 'text-emerald-600 dark:text-emerald-400'
                : card.changePositive === false
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {card.changeLabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
