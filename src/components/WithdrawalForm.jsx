import { useState } from 'react'

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

function YesNoToggle({ legend, name, value, onChange }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-medium text-ink">{legend}</legend>
      <div className="grid grid-cols-2 gap-1 rounded-full bg-cream p-1">
        {[true, false].map((option) => {
          const label = option ? 'Yes' : 'No'
          const id = `${name}-${label.toLowerCase()}`

          return (
            <label
              key={id}
              htmlFor={id}
              className={`cursor-pointer rounded-full border-2 border-transparent px-4 py-2.5 text-center text-sm font-semibold transition-colors duration-200 ease-out has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream ${
                value === option ? 'bg-teal text-white shadow-sm' : 'text-ink/70 hover:bg-surface'
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
  studentName: 'Maya Rodriguez',
  gNumber: 'G01234567',
  receivesScholarship: false,
}

function WithdrawalForm({ onSubmit }) {
  const [withdrawalDate, setWithdrawalDate] = useState(getToday)
  const [receivesFederalAid, setReceivesFederalAid] = useState(false)
  const [federalAidAmount, setFederalAidAmount] = useState('')
  const [livesInHousing, setLivesInHousing] = useState(false)
  const [isInternational, setIsInternational] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [gNumber, setGNumber] = useState('')
  const [receivesScholarship, setReceivesScholarship] = useState(false)

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
      studentName: studentName.trim(),
      gNumber: gNumber.trim(),
      receivesScholarship,
    })
  }

  function handleExampleClick() {
    setWithdrawalDate(EXAMPLE_VALUES.withdrawalDate)
    setReceivesFederalAid(EXAMPLE_VALUES.receivesFederalAid)
    setFederalAidAmount(String(EXAMPLE_VALUES.federalAidAmount))
    setLivesInHousing(EXAMPLE_VALUES.livesInHousing)
    setIsInternational(EXAMPLE_VALUES.isInternational)
    setStudentName(EXAMPLE_VALUES.studentName)
    setGNumber(EXAMPLE_VALUES.gNumber)
    setReceivesScholarship(EXAMPLE_VALUES.receivesScholarship)
    onSubmit(EXAMPLE_VALUES, { isExample: true })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-8 rounded-2xl border border-black/5 bg-surface p-6 shadow-soft sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal">Withdrawal planning</p>
        <h1 className="font-heading text-3xl font-semibold text-ink sm:text-5xl">Aftermath</h1>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink/70">
          Answer a few questions and we&apos;ll map out what happens next — clearly, and at your own pace.
        </p>
      </div>

      <button
        type="button"
        onClick={handleExampleClick}
        className="inline-flex w-full items-center justify-center rounded-lg border-2 border-teal px-4 py-2.5 text-sm font-semibold text-teal transition-colors duration-200 ease-out hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:w-auto"
      >
        Try an example scenario
      </button>

      <div className="space-y-2">
        <label htmlFor="withdrawal-date" className="block text-base font-medium text-ink">
          Withdrawal date
        </label>
        <input
          id="withdrawal-date"
          type="date"
          value={withdrawalDate}
          onChange={(event) => setWithdrawalDate(event.target.value)}
          className="w-full rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-base text-ink shadow-sm outline-none transition-colors duration-200 ease-out focus:border-teal focus:ring-2 focus:ring-teal/40"
          required
        />
      </div>

      <div className="space-y-3 rounded-2xl bg-cream p-4">
        <p className="text-sm text-ink/60">
          So we can personalize your emails to GMU offices (optional).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="student-name" className="block text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="student-name"
              type="text"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-base text-ink shadow-sm outline-none transition-colors duration-200 ease-out focus:border-teal focus:ring-2 focus:ring-teal/40"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="student-g-number" className="block text-sm font-medium text-ink">
              G-Number
            </label>
            <input
              id="student-g-number"
              type="text"
              value={gNumber}
              onChange={(event) => setGNumber(event.target.value)}
              placeholder="G01234567"
              className="w-full rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-base text-ink shadow-sm outline-none transition-colors duration-200 ease-out focus:border-teal focus:ring-2 focus:ring-teal/40"
            />
          </div>
        </div>
      </div>

      <YesNoToggle
        legend="Do you receive federal financial aid this semester?"
        name="receives-federal-aid"
        value={receivesFederalAid}
        onChange={handleAidChange}
      />

      {receivesFederalAid && (
        <div className="animate-fade-slide-in space-y-2 rounded-2xl bg-cream p-4">
          <label htmlFor="federal-aid-amount" className="block text-base font-medium text-ink">
            Estimated federal aid received
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/50">$</span>
            <input
              id="federal-aid-amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={federalAidAmount}
              onChange={(event) => setFederalAidAmount(event.target.value)}
              className="w-full rounded-lg border border-black/10 bg-surface py-2.5 pl-9 pr-4 text-base text-ink shadow-sm outline-none transition-colors duration-200 ease-out focus:border-teal focus:ring-2 focus:ring-teal/40"
              placeholder="0.00"
              required={receivesFederalAid}
            />
          </div>
        </div>
      )}

      <YesNoToggle
        legend="Do you receive an institutional or merit scholarship?"
        name="receives-scholarship"
        value={receivesScholarship}
        onChange={setReceivesScholarship}
      />

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
        className="w-full rounded-lg bg-teal px-5 py-3 text-base font-semibold text-white shadow-soft transition-colors duration-200 ease-out hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Show me what happens
      </button>
    </form>
  )
}

export default WithdrawalForm
