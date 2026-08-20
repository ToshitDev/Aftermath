import {
  calculateAidRepayment,
  calculateTranscriptImpact,
  calculateTuitionRefund,
  getReviewRoute,
} from '../lib/withdrawalRules.js'

const FALL_2026_TERM_START = '2026-08-24'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function addDays(dateString, days) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + days))

  return date.toISOString().slice(0, 10)
}

function getDaysUntilRefundDrop(withdrawalDate, currentRefundPct) {
  if (currentRefundPct <= 0) {
    return null
  }

  for (let daysAhead = 1; daysAhead <= 180; daysAhead += 1) {
    const nextRefund = calculateTuitionRefund(addDays(withdrawalDate, daysAhead))

    if (nextRefund.refundPct < currentRefundPct) {
      return daysAhead
    }
  }

  return null
}

function ResultCard({ title, children, tone = 'neutral' }) {
  const tones = {
    neutral: 'border-stone-200 bg-white text-stone-900 shadow-stone-300/30',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950 shadow-emerald-200/50',
    warning: 'border-amber-200 bg-amber-50 text-stone-950 shadow-amber-200/50',
  }

  return (
    <section className={`rounded-3xl border p-5 shadow-lg ${tones[tone]}`}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-600">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  )
}

function ResultCards({
  withdrawalDate,
  receivesFederalAid,
  federalAidAmount,
  livesInHousing,
  isInternational,
}) {
  const tuitionRefund = calculateTuitionRefund(withdrawalDate)
  const aidRepayment = calculateAidRepayment(
    withdrawalDate,
    FALL_2026_TERM_START,
    federalAidAmount,
    livesInHousing,
  )
  const transcriptImpact = calculateTranscriptImpact(withdrawalDate, FALL_2026_TERM_START)
  const reviewRoute = getReviewRoute(isInternational, livesInHousing)
  const daysUntilRefundDrop = getDaysUntilRefundDrop(withdrawalDate, tuitionRefund.refundPct)
  const primaryReviewOffices = reviewRoute.filter((office) => !office.startsWith('Housing & Residence Life'))
  const housingNote = reviewRoute.find((office) => office.startsWith('Housing & Residence Life'))
  const aidOwed = Math.round(aidRepayment.owed)

  return (
    <section
      aria-label="Withdrawal results"
      className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2"
    >
      <ResultCard title="Tuition Refund">
        <p className="text-3xl font-bold">{tuitionRefund.refundPct}%</p>
        <p className="text-base leading-7 text-stone-700">
          You&apos;ll get back {tuitionRefund.refundPct}% of your tuition.
        </p>
        {daysUntilRefundDrop && (
          <p className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950">
            Refund drops to the next tier in {daysUntilRefundDrop}{' '}
            {daysUntilRefundDrop === 1 ? 'day' : 'days'}.
          </p>
        )}
      </ResultCard>

      {receivesFederalAid && (
        <ResultCard title="Financial Aid Risk" tone={aidOwed > 0 ? 'warning' : 'success'}>
          <p className="text-3xl font-bold">{currencyFormatter.format(aidOwed)}</p>
          {aidOwed > 0 ? (
            <p className="text-base leading-7 text-stone-700">
              Because the withdrawal is before the 60% mark, some unearned federal aid may need
              to be returned.
            </p>
          ) : (
            <p className="text-base leading-7 text-emerald-800">
              You are past the 60% mark, so no federal aid repayment is estimated.
            </p>
          )}
        </ResultCard>
      )}

      <ResultCard title="Transcript Impact">
        <p className="text-xl font-bold leading-8">{transcriptImpact}</p>
      </ResultCard>

      <ResultCard title="Who Reviews This">
        <div className="flex flex-wrap gap-2">
          {primaryReviewOffices.map((office) => (
            <span
              key={office}
              className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-900"
            >
              {office}
            </span>
          ))}
        </div>
        {housingNote && (
          <p className="rounded-2xl bg-stone-100 px-4 py-3 text-sm leading-6 text-stone-700">
            Housing has its own process: contact Housing &amp; Residence Life separately.
          </p>
        )}
      </ResultCard>
    </section>
  )
}

export default ResultCards
