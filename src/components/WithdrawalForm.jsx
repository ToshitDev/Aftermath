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

const LOCAL_STUDENT_EXAMPLE = {
  withdrawalDate: '2026-10-14',
  receivesFederalAid: true,
  federalAidAmount: 8000,
  livesInHousing: true,
  isInternational: false,
  studentName: 'Maya Rodriguez',
  gNumber: 'G01234567',
  receivesScholarship: false,
}
const LOCAL_STUDENT_EXAMPLE_LABEL = 'Maya, a GMU student withdrawing mid-semester'

const INTERNATIONAL_STUDENT_EXAMPLE = {
  withdrawalDate: '2026-09-10',
  receivesFederalAid: false,
  federalAidAmount: 0,
  livesInHousing: true,
  isInternational: true,
  studentName: 'Priya Sharma',
  gNumber: 'G05678912',
  receivesScholarship: true,
}
const INTERNATIONAL_STUDENT_EXAMPLE_LABEL = 'Priya, an international student withdrawing mid-semester'

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

  function applyExample(example) {
    setWithdrawalDate(example.withdrawalDate)
    setReceivesFederalAid(example.receivesFederalAid)
    setFederalAidAmount(String(example.federalAidAmount))
    setLivesInHousing(example.livesInHousing)
    setIsInternational(example.isInternational)
    setStudentName(example.studentName)
    setGNumber(example.gNumber)
    setReceivesScholarship(example.receivesScholarship)
  }

  function handleLocalExampleClick() {
    applyExample(LOCAL_STUDENT_EXAMPLE)
    onSubmit(LOCAL_STUDENT_EXAMPLE, { isExample: true, exampleLabel: LOCAL_STUDENT_EXAMPLE_LABEL })
  }

  function handleInternationalExampleClick() {
    applyExample(INTERNATIONAL_STUDENT_EXAMPLE)
    onSubmit(INTERNATIONAL_STUDENT_EXAMPLE, { isExample: true, exampleLabel: INTERNATIONAL_STUDENT_EXAMPLE_LABEL })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-w-0 space-y-5 rounded-2xl border border-black/5 bg-surface p-4 shadow-soft sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleLocalExampleClick}
          className="inline-flex flex-1 items-center justify-center rounded-lg border-2 border-teal px-4 py-2.5 text-center text-sm font-semibold text-teal transition-colors duration-200 ease-out hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Try a local student scenario
        </button>
        <button
          type="button"
          onClick={handleInternationalExampleClick}
          className="inline-flex flex-1 items-center justify-center rounded-lg border-2 border-teal px-4 py-2.5 text-center text-sm font-semibold text-teal transition-colors duration-200 ease-out hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Try an international student scenario
        </button>
      </div>

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
