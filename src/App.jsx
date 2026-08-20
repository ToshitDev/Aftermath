import { useState } from 'react'
import WithdrawalForm from './components/WithdrawalForm.jsx'
import ResultCards from './components/ResultCards.jsx'

function App() {
  const [withdrawalValues, setWithdrawalValues] = useState(null)

  function handleWithdrawalSubmit(values) {
    setWithdrawalValues(values)
  }

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8 text-stone-950 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-8">
        <WithdrawalForm onSubmit={handleWithdrawalSubmit} />
        {withdrawalValues && <ResultCards {...withdrawalValues} />}
      </main>
    </div>
  )
}

export default App
