import { useState } from 'react'
import WithdrawalForm from './components/WithdrawalForm.jsx'
import ResultCards from './components/ResultCards.jsx'
import NextStepsChecklist from './components/NextStepsChecklist.jsx'
import AlternativesComparison from './components/AlternativesComparison.jsx'
import SupportBanner from './components/SupportBanner.jsx'

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
              This is an estimate to help you plan — your financial aid office has the final say. You can
              change your answers anytime and resubmit to see updated results.
            </p>
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
