import WithdrawalForm from './components/WithdrawalForm.jsx'

function App() {
  function handleWithdrawalSubmit(values) {
    console.log('Withdrawal form values:', values)
  }

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8 text-stone-950 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <WithdrawalForm onSubmit={handleWithdrawalSubmit} />
      </main>
    </div>
  )
}

export default App
