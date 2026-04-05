import { useState } from 'react'
import { Target, Pencil, Check, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { formatCurrency, spentThisMonth } from '../../utils/calculations'
import { ExpenseCategory } from '../../types'

// Colours per budget status
function barColor(pct: number) {
  if (pct >= 100) return 'bg-red-500'
  if (pct >= 80)  return 'bg-amber-500'
  return 'bg-emerald-500'
}

function statusLabel(pct: number) {
  if (pct >= 100) return { text: 'Over budget!', cls: 'text-red-500' }
  if (pct >= 80)  return { text: 'Almost there', cls: 'text-amber-500' }
  return { text: `${100 - Math.round(pct)}% remaining`, cls: 'text-emerald-600 dark:text-emerald-400' }
}

export function BudgetGoals() {
  const { budgetGoals, transactions, updateBudgetGoal, role } = useStore()
  // Track which goal is being edited
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category)
    setEditValue(currentLimit.toString())
  }

  const saveEdit = (category: ExpenseCategory) => {
    const val = Number(editValue)
    if (val > 0) {
      updateBudgetGoal(category, val)
    }
    setEditingCategory(null)
  }

  const cancelEdit = () => setEditingCategory(null)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <Target size={14} className="text-violet-500" />
        </div>
        <div>
          <h3 className="section-heading">Monthly Budget Goals</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track spending against your limits{role === 'admin' ? ' — click ✏️ to edit' : ''}
          </p>
        </div>
      </div>

      {/* Goals list */}
      <div className="space-y-4">
        {budgetGoals.map((goal) => {
          const spent = spentThisMonth(transactions, goal.category)
          const pct = goal.monthlyLimit > 0 ? (spent / goal.monthlyLimit) * 100 : 0
          const clampedPct = Math.min(pct, 100)
          const status = statusLabel(pct)
          const isEditing = editingCategory === goal.category

          return (
            <div key={goal.category}>
              {/* Top row: category + amount info */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {goal.category}
                  </span>
                  {/* Admin: edit limit */}
                  {role === 'admin' && !isEditing && (
                    <button
                      onClick={() => startEdit(goal.category, goal.monthlyLimit)}
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
                      title="Edit limit"
                    >
                      <Pencil size={11} />
                    </button>
                  )}
                </div>

                {/* Limit editing inline */}
                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">₹</span>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24 px-2 py-1 text-xs rounded-lg border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(goal.category as ExpenseCategory)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                    />
                    <button
                      onClick={() => saveEdit(goal.category as ExpenseCategory)}
                      className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white"
                    >
                      <Check size={11} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="font-num text-xs font-bold text-slate-700 dark:text-slate-300">
                      {formatCurrency(spent)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {' '}/ {formatCurrency(goal.monthlyLimit)}
                    </span>
                    {role === 'admin' && (
                      <button
                        onClick={() => startEdit(goal.category, goal.monthlyLimit)}
                        className="ml-1.5 inline-flex items-center text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title="Edit budget limit"
                      >
                        <Pencil size={10} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full progress-bar ${barColor(pct)}`}
                  style={{ width: `${clampedPct}%` }}
                />
              </div>

              {/* Status label */}
              <p className={`text-[10px] font-semibold mt-0.5 ${status.cls}`}>
                {status.text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
