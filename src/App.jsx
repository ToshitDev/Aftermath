import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import WithdrawalForm from './components/WithdrawalForm.jsx'
import ResultCards from './components/ResultCards.jsx'
import NextStepsChecklist from './components/NextStepsChecklist.jsx'
import AlternativesComparison from './components/AlternativesComparison.jsx'
import SupportBanner from './components/SupportBanner.jsx'
import { FALL_2026_POLICY } from './lib/withdrawalRules.js'

function AboutEstimateDisclosure() {
  return (
    <details className="group max-w-[65ch] text-sm leading-relaxed text-ink/60 print:hidden">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg font-semibold text-teal transition-colors duration-200 ease-out hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true">ⓘ</span>
        <span>About this estimate</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-3 space-y-3 rounded-lg border border-black/5 bg-surface/60 p-4">
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-x-4">
          <dt className="font-semibold text-ink/50">Policy set</dt>
          <dd>{FALL_2026_POLICY.institution} · {FALL_2026_POLICY.term}</dd>
          <dt className="font-semibold text-ink/50">Course schedule</dt>
          <dd>{FALL_2026_POLICY.courseSchedule}</dd>
          <dt className="font-semibold text-ink/50">Policy checked</dt>
          <dd>{FALL_2026_POLICY.policyChecked}</dd>
        </dl>
        <p>These results are planning estimates. The university office listed for each result makes the final determination.</p>
        <p>
          Short-session, 7.5-week, half-semester, and modular courses can have different refund and withdrawal
          deadlines. Check your course schedule before relying on these dates.
        </p>
      </div>
    </details>
  )
}

function App() {
  const [withdrawalValues, setWithdrawalValues] = useState(null)
  const [isExampleResult, setIsExampleResult] = useState(false)

  function handleWithdrawalSubmit(values, { isExample = false } = {}) {
    setWithdrawalValues(values)
    setIsExampleResult(isExample)
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8 pb-24 text-ink sm:px-6 sm:pb-20 lg:px-8 print:pb-8">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center gap-8">
        <div className="w-full print:hidden">
          <WithdrawalForm onSubmit={handleWithdrawalSubmit} />
        </div>

        <AlternativesComparison />

        {withdrawalValues && (
          <div className="w-full max-w-5xl space-y-4">
            {isExampleResult && (
              <p className="inline-flex rounded-full border border-teal/20 bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark print:hidden">
                Example: Maya, a GMU student withdrawing mid-semester
              </p>
            )}
            <p className="max-w-[65ch] text-sm leading-relaxed text-ink/60">
              This is an estimate to help you plan. Your financial aid office has the final say, and you can
              change your answers anytime and resubmit to see updated results.
            </p>
            <AboutEstimateDisclosure />
            <ResultCards {...withdrawalValues} />
            <NextStepsChecklist {...withdrawalValues} />
          </div>
        )}
      </main>
      <SupportBanner />
    </div>
  )
}

export default App
