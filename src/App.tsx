import { useEffect } from 'react'
import { useStore } from './store/useStore'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { InsightsPage } from './pages/InsightsPage'

function App() {
  const { theme, activePage } = useStore()

  // Sync the Tailwind "dark" class with the stored theme value
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="
      min-h-screen
      bg-slate-50 dark:bg-slate-950
      text-slate-900 dark:text-slate-100
      theme-transition
    ">
      <div className="flex h-screen overflow-hidden">

        {/* ── Sidebar ── (hidden on mobile, full on desktop) */}
        <Sidebar />

        {/* ── Main content area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
            {activePage === 'dashboard'    && <DashboardPage />}
            {activePage === 'transactions' && <TransactionsPage />}
            {activePage === 'insights'     && <InsightsPage />}
          </main>
        </div>

      </div>
    </div>
  )
}

export default App
