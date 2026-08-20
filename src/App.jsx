import { useState } from 'react'
import WithdrawalForm from './components/WithdrawalForm.jsx'
import ResultCards from './components/ResultCards.jsx'

function App() {
  const [withdrawalValues, setWithdrawalValues] = useState(null)
  const [isExampleResult, setIsExampleResult] = useState(false)

  function handleWithdrawalSubmit(values, { isExample = false } = {}) {
    setWithdrawalValues(values)
    setIsExampleResult(isExample)
  }

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8 text-stone-950 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-8">
        <WithdrawalForm onSubmit={handleWithdrawalSubmit} />
        {withdrawalValues && (
          <div className="w-full max-w-5xl space-y-3">
            {isExampleResult && (
              <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-900">
                Example: Maya, a GMU student withdrawing mid-semester
              </p>
            )}
            <ResultCards {...withdrawalValues} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
