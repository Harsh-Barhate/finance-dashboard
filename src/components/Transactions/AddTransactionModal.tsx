import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES, TransactionType } from '../../types'

interface AddTransactionModalProps {
  editingTx: Transaction | null
  onClose: () => void
}

const DEFAULT_FORM = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: '',
  type: 'expense' as TransactionType,
  category: 'Food & Dining' as Transaction['category'],
  note: '',
}

export function AddTransactionModal({ editingTx, onClose }: AddTransactionModalProps) {
  const { addTransaction, updateTransaction } = useStore()
  const [form, setForm] = useState({ ...DEFAULT_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTx) {
      setForm({
        date: editingTx.date,
        description: editingTx.description,
        amount: editingTx.amount.toString(),
        type: editingTx.type,
        category: editingTx.category,
        note: editingTx.note ?? '',
      })
    }
  }, [editingTx])

  // When type changes, reset category to a sensible default
  const handleTypeChange = (type: TransactionType) => {
    setForm((f) => ({
      ...f,
      type,
      category: type === 'expense' ? 'Food & Dining' : 'Salary',
    }))
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const payload = {
      date: form.date,
      description: form.description.trim(),
      amount: Math.round(Number(form.amount)),
      type: form.type,
      category: form.category,
      note: form.note.trim() || undefined,
    }

    if (editingTx) {
      updateTransaction(editingTx.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdrop}
    >
      <div className="
        w-full max-w-md
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-700
        rounded-2xl shadow-2xl
        animate-slide-up
      ">
        {/* ── Header ─────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editingTx ? '✏️ Edit Transaction' : '➕ Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Form body ───────────────────────────── */}
        <div className="px-6 py-5 space-y-4">

          {/* Type toggle */}
          <div>
            <label className="label-base">Transaction Type</label>
            <div className="flex gap-2">
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`
                    flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all
                    ${form.type === t
                      ? t === 'income'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-red-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  {t === 'income' ? '↑' : '↓'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label-base">Description *</label>
            <input
              type="text"
              placeholder="e.g. Monthly groceries"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`input-base ${errors.description ? 'border-red-400 focus:ring-red-400/30' : ''}`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Amount (₹) *</label>
              <input
                type="number"
                min="1"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className={`input-base font-mono ${errors.amount ? 'border-red-400 focus:ring-red-400/30' : ''}`}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
              )}
            </div>
            <div>
              <label className="label-base">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`input-base font-mono ${errors.date ? 'border-red-400 focus:ring-red-400/30' : ''}`}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label-base">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Transaction['category'] }))}
              className="input-base"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Note (optional) */}
          <div>
            <label className="label-base">Note <span className="text-slate-400 normal-case">(optional)</span></label>
            <input
              type="text"
              placeholder="Any additional detail…"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="input-base"
            />
          </div>
        </div>

        {/* ── Footer ─────────────────────────────── */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            {editingTx ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
