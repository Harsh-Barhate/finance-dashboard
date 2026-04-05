import { InsightsSection } from '../components/Insights/InsightsSection'
import { BudgetGoals } from '../components/Insights/BudgetGoals'

export function InsightsPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6 page-enter">

      {/* ── Budget goals at top (actionable) ──────────────── */}
      <BudgetGoals />

      {/* ── Charts + auto insights ────────────────────────── */}
      <InsightsSection />
    </div>
  )
}
