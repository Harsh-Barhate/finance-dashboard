import { LayoutDashboard, ArrowLeftRight, TrendingUp, ChevronRight, Wallet } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Page } from '../../types'

// Each nav item: icon, label, page key
const NAV_ITEMS: { icon: typeof LayoutDashboard; label: string; page: Page }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',     page: 'dashboard'     },
  { icon: ArrowLeftRight,  label: 'Transactions',  page: 'transactions'  },
  { icon: TrendingUp,      label: 'Insights',      page: 'insights'      },
]

export function Sidebar() {
  const { activePage, setActivePage, role } = useStore()

  return (
    <aside className="
      hidden md:flex flex-col
      w-60 shrink-0
      bg-white dark:bg-slate-900
      border-r border-slate-200 dark:border-slate-800
      h-screen
    ">
      {/* ── Logo ─────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="
          w-8 h-8 rounded-lg
          bg-emerald-500
          flex items-center justify-center
          shadow-lg shadow-emerald-500/30
        ">
          <Wallet size={16} className="text-white" />
        </div>
        <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
          Fin<span className="text-emerald-500">Lens</span>
        </span>
      </div>

      {/* ── Navigation ───────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Menu
        </p>

        {NAV_ITEMS.map(({ icon: Icon, label, page }) => {
          const isActive = activePage === page
          return (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-150
                ${isActive
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              {/* Left: icon */}
              <span className={`
                w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                ${isActive
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }
              `}>
                <Icon size={14} />
              </span>

              {/* Label */}
              <span className="flex-1 text-left">{label}</span>

              {/* Active chevron */}
              {isActive && (
                <ChevronRight size={14} className="text-emerald-500" />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Role badge at bottom ──────────────────── */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
          {/* Avatar */}
          <div className="
            w-8 h-8 rounded-full
            bg-gradient-to-br from-emerald-400 to-blue-500
            flex items-center justify-center
            text-white text-xs font-bold shrink-0
          ">
            {role === 'admin' ? 'AD' : 'VW'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              Harsh Barhate
            </p>
            <p className={`text-[10px] font-semibold capitalize ${
              role === 'admin' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              {role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
