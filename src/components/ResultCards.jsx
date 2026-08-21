import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  calculateAidRepayment,
  calculateTranscriptImpact,
  calculateTuitionRefund,
  getReviewRoute,
} from '../lib/withdrawalRules.js'
import ContactOffices from './ContactOffices.jsx'

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

// Presentation-only mappings from rules-engine output to plain-language
// copy. None of this touches withdrawalRules.js — it just phrases the
// numbers it already returns.
function getTuitionRefundPresentation(refundPct) {
  if (refundPct === 100) {
    return {
      tone: 'success',
      badgeLabel: 'Good news',
      meaning: "You're still within the full-refund window, so no tuition will be owed for this withdrawal.",
    }
  }
  if (refundPct === 0) {
    return {
      tone: 'severe',
      badgeLabel: 'No refund',
      meaning:
        "This date falls after the refund window, so tuition isn't refundable. Student Accounts can help you understand your balance.",
    }
  }
  return {
    tone: 'caution',
    badgeLabel: 'Partial refund',
    meaning: `You'll get ${refundPct}% of your tuition back — the rest is considered non-refundable at this point.`,
  }
}

function getAidRiskPresentation(aidOwed) {
  if (aidOwed > 0) {
    return {
      tone: 'caution',
      badgeLabel: 'Heads up',
      meaning:
        "Because you're withdrawing before completing 60% of the term, some of your federal aid may need to be returned.",
    }
  }
  return {
    tone: 'success',
    badgeLabel: 'Good news',
    meaning: "You've completed enough of the term for your aid to be considered fully earned — no repayment is expected.",
  }
}

const TRANSCRIPT_MEANING = {
  'No record on transcript': 'Because this is before the term even starts, nothing will show up on your transcript.',
  'W notation, no GPA impact': "You'll see a W on your transcript for this term — it won't affect your GPA.",
  'Full semester withdrawal, W notation':
    "This falls in the full-withdrawal window, so you'll see a W for the whole semester — it won't lower your GPA, but it will appear on your record.",
}

function getTranscriptMeaning(transcriptImpact) {
  return (
    TRANSCRIPT_MEANING[transcriptImpact] ??
    "This date is outside the standard withdrawal window — the Registrar's Office can confirm exactly how it will appear."
  )
}

const TONE_STYLES = {
  success: 'bg-positive/10 text-positive',
  caution: 'bg-caution/10 text-caution',
  severe: 'bg-severe/10 text-severe',
  neutral: 'bg-ink/5 text-ink/70',
}

function ToneBadge({ tone, children }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_STYLES[tone]}`}>
      {children}
    </span>
  )
}

// Collapsible detail with a smooth, reversible expand (CSS grid-rows trick,
// no measured heights) and a consistent rotating chevron. The Level-1
// summary that triggers it always stays visible — this only ever holds
// supplementary detail, never the primary number/answer.
function Accordion({ children }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-teal transition-colors duration-200 ease-out hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {expanded ? 'Hide details' : 'See details'}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ease-out ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${expanded ? 'mt-2 grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-ink/70">{children}</p>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ title, children, delay = 0 }) {
  return (
    <section
      className="animate-fade-slide-in rounded-2xl border border-black/5 bg-surface p-6 shadow-soft sm:p-8"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">{title}</h2>
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
  studentName,
  gNumber,
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
  const pctCompleted = Math.round(aidRepayment.pctCompleted * 100)

  const refundPresentation = getTuitionRefundPresentation(tuitionRefund.refundPct)
  const aidPresentation = getAidRiskPresentation(aidOwed)

  return (
    <section
      aria-label="Withdrawal results"
      className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 print:hidden"
    >
      <ResultCard title="Tuition Refund" delay={0}>
        <ToneBadge tone={refundPresentation.tone}>{refundPresentation.badgeLabel}</ToneBadge>
        <p className="font-heading text-5xl font-semibold text-ink">{tuitionRefund.refundPct}%</p>
        <p className="text-base leading-relaxed text-ink/70">{refundPresentation.meaning}</p>
        {daysUntilRefundDrop && (
          <p className="rounded-lg bg-caution/10 px-4 py-3 text-sm font-semibold text-caution">
            Refund drops to the next tier in {daysUntilRefundDrop}{' '}
            {daysUntilRefundDrop === 1 ? 'day' : 'days'}.
          </p>
        )}
        <Accordion>
          GMU refunds 100% of tuition through Sept 8, 50% from Sept 9–14, and 0% from Sept 15 onward for Fall
          2026. This is based on the withdrawal date you entered.
        </Accordion>
      </ResultCard>

      {receivesFederalAid && (
        <ResultCard title="Financial Aid Risk" delay={40}>
          <ToneBadge tone={aidPresentation.tone}>{aidPresentation.badgeLabel}</ToneBadge>
          <p className="font-heading text-5xl font-semibold text-ink">{currencyFormatter.format(aidOwed)}</p>
          <p className="text-base leading-relaxed text-ink/70">{aidPresentation.meaning}</p>
          <Accordion>
            You&apos;ve completed about {pctCompleted}% of the 79-day term. Federal rules consider aid fully
            earned once you pass the 60% mark — before that, the unearned share may need to be returned.
            {livesInHousing &&
              ' Since you live in campus housing, Housing & Residence Life may also review any aid tied to your housing charges.'}
          </Accordion>
        </ResultCard>
      )}

      {receivesFederalAid && (
        <ResultCard title="Future Aid Eligibility" delay={80}>
          <ToneBadge tone="caution">Worth a look</ToneBadge>
          <p className="text-base leading-relaxed text-ink/70">
            Withdrawing can affect financial aid eligibility going forward — worth a quick check with Financial
            Aid.
          </p>
          <Accordion>
            Heads up: W grades count as attempted hours toward Satisfactory Academic Progress (SAP). If this
            affects your GPA or completion rate, you may need to file a SAP appeal to keep future aid
            eligibility. Confirm with Financial Aid.
          </Accordion>
        </ResultCard>
      )}

      <ResultCard title="Transcript Impact" delay={120}>
        <p className="font-heading text-xl font-semibold leading-snug text-ink">{transcriptImpact}</p>
        <p className="text-base leading-relaxed text-ink/70">{getTranscriptMeaning(transcriptImpact)}</p>
        <Accordion>
          A &ldquo;W&rdquo; means withdrawal — it shows you were enrolled but didn&apos;t complete the course,
          without factoring into your GPA calculation.
        </Accordion>
      </ResultCard>

      <ResultCard title="Health Insurance Impact" delay={160}>
        <ToneBadge tone="neutral">Worth checking</ToneBadge>
        <p className="text-base leading-relaxed text-ink/70">
          If you&apos;re on the Aetna Student Health Plan, your withdrawal timing affects your coverage.
        </p>
        <Accordion>
          If you&apos;re on GMU&apos;s Aetna Student Health Plan: withdrawing within the first 31 days of the
          semester makes you ineligible for coverage. Withdrawing after 31 days under an approved leave keeps
          your coverage through the period already paid for, with no refund. If you&apos;re an international
          student, insurance is mandatory under GMU policy — confirm your status with OIPS.
        </Accordion>
      </ResultCard>

      <ResultCard title="Coming Back Later" delay={200}>
        <ToneBadge tone="success">Good to know</ToneBadge>
        <p className="text-base leading-relaxed text-ink/70">
          Withdrawing doesn&apos;t close the door — coming back later is usually straightforward.
        </p>
        <Accordion>
          The door isn&apos;t closed. If you&apos;re away 2 years or fewer (without a Leave of Absence on
          file), you can return through the Registrar&apos;s Undergraduate Application for Re-enrollment. Away
          longer than that, or studied elsewhere without permission? You&apos;ll reapply through Admissions.
        </Accordion>
      </ResultCard>

      <ResultCard title="Who Reviews This" delay={240}>
        <p className="text-base leading-relaxed text-ink/70">
          These offices are involved in reviewing your withdrawal — reach out anytime using the contacts below.
        </p>
        <div className="flex flex-wrap gap-2">
          {primaryReviewOffices.map((office) => (
            <span
              key={office}
              className="rounded-full border border-teal/20 bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark"
            >
              {office}
            </span>
          ))}
        </div>
        {housingNote && (
          <p className="rounded-lg bg-cream px-4 py-3 text-sm leading-relaxed text-ink/70">
            Housing has its own process: contact Housing &amp; Residence Life separately.
          </p>
        )}
        <ContactOffices
          withdrawalDate={withdrawalDate}
          livesInHousing={livesInHousing}
          isInternational={isInternational}
          studentName={studentName}
          gNumber={gNumber}
        />
      </ResultCard>
    </section>
  )
}

export default ResultCards
