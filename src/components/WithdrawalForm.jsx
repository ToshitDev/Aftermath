import { useState } from 'react'

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

function YesNoToggle({ legend, name, value, onChange }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-stone-900">{legend}</legend>
      <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/70 p-1.5 shadow-inner shadow-stone-200/80">
        {[true, false].map((option) => {
          const label = option ? 'Yes' : 'No'
          const id = `${name}-${label.toLowerCase()}`

          return (
            <label
              key={id}
              htmlFor={id}
              className={`cursor-pointer rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                value === option
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <input
                id={id}
                className="sr-only"
                type="radio"
                name={name}
                checked={value === option}
                onChange={() => onChange(option)}
              />
              {label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

const EXAMPLE_VALUES = {
  withdrawalDate: '2026-10-14',
  receivesFederalAid: true,
  federalAidAmount: 8000,
  livesInHousing: true,
  isInternational: false,
}

function WithdrawalForm({ onSubmit }) {
  const [withdrawalDate, setWithdrawalDate] = useState(getToday)
  const [receivesFederalAid, setReceivesFederalAid] = useState(false)
  const [federalAidAmount, setFederalAidAmount] = useState('')
  const [livesInHousing, setLivesInHousing] = useState(false)
  const [isInternational, setIsInternational] = useState(false)

  function handleAidChange(value) {
    setReceivesFederalAid(value)
    if (!value) {
      setFederalAidAmount('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      withdrawalDate,
      receivesFederalAid,
      federalAidAmount: receivesFederalAid ? Number(federalAidAmount || 0) : 0,
      livesInHousing,
      isInternational,
    })
  }

  function handleExampleClick() {
    setWithdrawalDate(EXAMPLE_VALUES.withdrawalDate)
    setReceivesFederalAid(EXAMPLE_VALUES.receivesFederalAid)
    setFederalAidAmount(String(EXAMPLE_VALUES.federalAidAmount))
    setLivesInHousing(EXAMPLE_VALUES.livesInHousing)
    setIsInternational(EXAMPLE_VALUES.isInternational)
    onSubmit(EXAMPLE_VALUES, { isExample: true })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-7 rounded-[2rem] border border-stone-200 bg-amber-50/90 p-5 shadow-2xl shadow-stone-300/40 sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">
          Withdrawal planning
        </p>
        <h1 className="text-3xl font-bold text-stone-950 sm:text-4xl">Aftermath</h1>
        <p className="max-w-xl text-base leading-7 text-stone-700">
          Answer a few questions and we will map the next steps clearly.
        </p>
      </div>

      <button
        type="button"
        onClick={handleExampleClick}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-teal-300 bg-white/60 px-4 py-3 text-sm font-bold text-teal-900 shadow-sm transition hover:border-teal-500 hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-100 sm:w-auto"
      >
        Try an example scenario
      </button>

      <div className="space-y-3">
        <label htmlFor="withdrawal-date" className="block text-base font-semibold text-stone-900">
          Withdrawal date
        </label>
        <input
          id="withdrawal-date"
          type="date"
          value={withdrawalDate}
          onChange={(event) => setWithdrawalDate(event.target.value)}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 shadow-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
          required
        />
      </div>

      <YesNoToggle
        legend="Do you receive federal financial aid this semester?"
        name="receives-federal-aid"
        value={receivesFederalAid}
        onChange={handleAidChange}
      />

      {receivesFederalAid && (
        <div className="space-y-3 rounded-3xl bg-white/70 p-4 shadow-sm shadow-stone-200/80">
          <label htmlFor="federal-aid-amount" className="block text-base font-semibold text-stone-900">
            Estimated federal aid received
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
              $
            </span>
            <input
              id="federal-aid-amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={federalAidAmount}
              onChange={(event) => setFederalAidAmount(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-white py-3 pl-9 pr-4 text-base text-stone-900 shadow-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              placeholder="0.00"
              required={receivesFederalAid}
            />
          </div>
        </div>
      )}

      <YesNoToggle
        legend="Do you live in campus housing?"
        name="lives-in-housing"
        value={livesInHousing}
        onChange={setLivesInHousing}
      />

      <YesNoToggle
        legend="Are you an international student?"
        name="is-international"
        value={isInternational}
        onChange={setIsInternational}
      />

      <button
        type="submit"
        className="w-full rounded-2xl bg-stone-950 px-5 py-4 text-base font-bold text-white shadow-lg shadow-stone-400/30 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200"
      >
        Show me what happens
      </button>
    </form>
  )
}

export default WithdrawalForm
