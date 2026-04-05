import { Sun, Moon, Shield, Eye, Menu, Wallet } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Role } from '../../types'

// Human-readable page titles
const PAGE_TITLES: Record<string, string> = {
  dashboard:    'Dashboard Overview',
  transactions: 'Transactions',
  insights:     'Insights & Analytics',
}

export function Header() {
  const { theme, toggleTheme, role, setRole, activePage, setActivePage } = useStore()

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role)
  }

  return (
    <header className="
      h-16 shrink-0
      flex items-center justify-between
      px-4 md:px-6
      bg-white dark:bg-slate-900
      border-b border-slate-200 dark:border-slate-800
    ">
      {/* ── Left: mobile logo + page title ─────── */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger / logo (visible only on small screens) */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
            <Wallet size={14} className="text-white" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
            Fin<span className="text-emerald-500">Lens</span>
          </span>
        </div>

        {/* Page title — desktop */}
        <div className="hidden md:block">
          <h1 className="text-base font-bold text-slate-900 dark:text-white">
            {PAGE_TITLES[activePage]}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* ── Right: controls ─────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Role switcher dropdown */}
        <div className="relative flex items-center">
          {/* Icon overlay */}
          <span className="pointer-events-none absolute left-2.5 text-slate-400 dark:text-slate-500">
            {role === 'admin'
              ? <Shield size={13} className="text-emerald-500" />
              : <Eye size={13} className="text-blue-500" />
            }
          </span>
          <select
            value={role}
            onChange={handleRoleChange}
            className="
              pl-7 pr-3 py-1.5
              text-xs font-semibold
              rounded-lg border
              border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-800
              text-slate-700 dark:text-slate-300
              focus:outline-none focus:ring-2 focus:ring-emerald-500/40
              cursor-pointer
              transition-colors
            "
            title="Switch role for demonstration"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="
            w-8 h-8 rounded-lg
            flex items-center justify-center
            bg-slate-100 dark:bg-slate-800
            text-slate-600 dark:text-slate-300
            hover:bg-slate-200 dark:hover:bg-slate-700
            transition-all duration-150
            active:scale-90
          "
          title="Toggle dark / light mode"
        >
          {theme === 'dark'
            ? <Sun size={15} className="text-amber-400" />
            : <Moon size={15} className="text-slate-600" />
          }
        </button>
      </div>

      {/* ── Mobile bottom nav (rendered here for simplicity) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 gap-1">
        {[
          { label: 'Dashboard', page: 'dashboard' as const, icon: '⊞' },
          { label: 'Transactions', page: 'transactions' as const, icon: '⇄' },
          { label: 'Insights', page: 'insights' as const, icon: '↑' },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className={`
              flex-1 flex flex-col items-center gap-0.5 py-1 rounded-lg text-xs font-semibold transition-colors
              ${activePage === item.page
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                : 'text-slate-500 dark:text-slate-400'
              }
            `}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </header>
  )
}
