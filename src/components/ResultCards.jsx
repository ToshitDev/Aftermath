import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import {
  calculateAidRepayment,
  calculateTranscriptImpact,
  calculateTuitionRefund,
  FALL_2026_POLICY,
  FALL_2026_TERM_START,
  POLICY_CHECKED_SHORT,
  POLICY_SOURCES,
  TUITION_REFUND_SCHEDULE_FALL_2026,
  getReviewRoute,
} from '../lib/withdrawalRules.js'
import ContactOffices from './ContactOffices.jsx'

const preciseCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const percentageFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function addDays(dateString, days) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + days))

  return date.toISOString().slice(0, 10)
}

function getDateTime(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

function formatPolicyDate(dateString) {
  return dateFormatter.format(new Date(getDateTime(dateString)))
}

function getDayDifference(fromDate, toDate) {
  return Math.round((getDateTime(toDate) - getDateTime(fromDate)) / (24 * 60 * 60 * 1000))
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

function getRefundDeadline(refundPct) {
  return TUITION_REFUND_SCHEDULE_FALL_2026.find((row) => row.refundPct === refundPct)?.end ?? null
}

function getRefundTimeline(withdrawalDate) {
  const fullRefundDeadline = getRefundDeadline(100)
  const partialRefundDeadline = getRefundDeadline(50)
  const milestones = [
    { id: 'term-start', label: 'Term begins', date: FALL_2026_POLICY.termStart },
    { id: 'full-refund', label: 'Full refund deadline', date: fullRefundDeadline },
    { id: 'partial-refund', label: 'Partial refund deadline', date: partialRefundDeadline },
    { id: 'withdrawal-date', label: 'Your withdrawal date', date: withdrawalDate, isStudentDate: true },
  ].filter((milestone) => milestone.date)

  return milestones.sort((first, second) => getDateTime(first.date) - getDateTime(second.date))
}

function getRefundTimelineContext(withdrawalDate, refundPct, daysUntilRefundDrop) {
  if (refundPct === 100 && daysUntilRefundDrop) {
    return `The next refund tier begins in ${daysUntilRefundDrop} ${daysUntilRefundDrop === 1 ? 'day' : 'days'}.`
  }

  const fullRefundDeadline = getRefundDeadline(100)
  if (refundPct === 50 && fullRefundDeadline) {
    const daysPast = getDayDifference(fullRefundDeadline, withdrawalDate)

    if (daysPast > 0) {
      return `You are ${daysPast} ${daysPast === 1 ? 'day' : 'days'} past the full-refund deadline.`
    }
  }

  const partialRefundDeadline = getRefundDeadline(50)
  if (refundPct === 0 && partialRefundDeadline) {
    const daysPast = getDayDifference(partialRefundDeadline, withdrawalDate)

    if (daysPast > 0) {
      return `You are ${daysPast} ${daysPast === 1 ? 'day' : 'days'} past the partial-refund deadline.`
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
    meaning: `You'll get ${refundPct}% of your tuition back. The rest is considered non-refundable at this point.`,
  }
}

function getAidRiskPresentation(unearnedTitleIVAid) {
  if (unearnedTitleIVAid > 0) {
    return {
      tone: 'caution',
      badgeLabel: 'Review required',
      meaning:
        'This is not necessarily the amount you will personally owe. GMU Financial Aid calculates the school and student portions.',
    }
  }
  return {
    tone: 'neutral',
    badgeLabel: 'Review required',
    meaning:
      'Based on this date, no unearned Title IV aid is estimated. GMU Financial Aid still makes the final determination.',
  }
}

const TRANSCRIPT_MEANING = {
  'No record on transcript': 'Because this is before the term even starts, nothing will show up on your transcript.',
  'W notation, no GPA impact': "You'll see a W on your transcript for this term. It won't affect your GPA.",
  'Full semester withdrawal, W notation':
    "This falls in the full-withdrawal window, so you'll see a W for the whole semester. It won't lower your GPA, but it will appear on your record.",
}

function getTranscriptMeaning(transcriptImpact) {
  return (
    TRANSCRIPT_MEANING[transcriptImpact] ??
    "This date is outside the standard withdrawal window. The Registrar's Office can confirm exactly how it will appear."
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

function SourceRow({ source }) {
  return (
    <div className="border-t border-black/5 pt-3 text-xs leading-relaxed text-ink/55">
      <p className="font-semibold uppercase tracking-wide text-ink/45">Source</p>
      <a
        href={source.href}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex max-w-full flex-wrap items-center gap-1 break-words font-semibold text-teal underline decoration-teal/25 underline-offset-2 transition-colors duration-200 ease-out hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {source.label}
        <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </a>
      {source.checked && <p className="mt-1 text-ink/45">Policy checked: {POLICY_CHECKED_SHORT}</p>}
    </div>
  )
}

function DetailList({ items }) {
  return (
    <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-[minmax(0,1fr)_auto]">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-ink/60">{item.label}</dt>
          <dd className="font-semibold text-ink sm:text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function RefundTimeline({ milestones }) {
  return (
    <ol className="space-y-2 border-l border-teal/20 pl-3 text-sm">
      {milestones.map((milestone) => (
        <li key={`${milestone.id}-${milestone.date}`} className="relative">
          <span
            className={`absolute -left-[17px] top-2 h-2 w-2 rounded-full ${
              milestone.isStudentDate ? 'bg-teal ring-4 ring-teal/10' : 'bg-ink/25'
            }`}
            aria-hidden="true"
          />
          <div className={milestone.isStudentDate ? 'font-semibold text-teal-dark' : 'text-ink/70'}>
            <span>{milestone.label}</span>
            <span className="mx-1.5 text-ink/30">-</span>
            <time dateTime={milestone.date}>{formatPolicyDate(milestone.date)}</time>
          </div>
        </li>
      ))}
    </ol>
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
        See details
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ease-out ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${expanded ? 'mt-2 grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 rounded-lg bg-cream/60 p-4 text-sm leading-relaxed text-ink/70">{children}</div>
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
  receivesScholarship,
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
  const refundTimeline = getRefundTimeline(withdrawalDate)
  const refundTimelineContext = getRefundTimelineContext(
    withdrawalDate,
    tuitionRefund.refundPct,
    daysUntilRefundDrop,
  )
  const primaryReviewOffices = reviewRoute.filter((office) => !office.startsWith('Housing & Residence Life'))
  const housingNote = reviewRoute.find((office) => office.startsWith('Housing & Residence Life'))
  const estimatedUnearnedTitleIVAid = aidRepayment.unearnedTitleIVAid
  const pctCompleted = percentageFormatter.format(aidRepayment.pctCompleted * 100)
  const federalAidReceived = Math.max(Number(federalAidAmount) || 0, 0)

  const refundPresentation = getTuitionRefundPresentation(tuitionRefund.refundPct)
  const aidPresentation = getAidRiskPresentation(estimatedUnearnedTitleIVAid)
  const showScholarshipCard = isInternational || receivesScholarship

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
        {tuitionRefund.refundPct < 100 && (
          <div className="space-y-3 rounded-lg bg-cream px-4 py-3">
            <p className="text-sm leading-relaxed text-ink/70">
              Heads up: GMU does not offer tuition refund appeals for missed deadlines. This was replaced by
              optional GradGuard Tuition Insurance, purchased at the time of billing. If you opted into
              GradGuard when you paid tuition, contact them directly to file a claim. If you didn&apos;t, this
              refund amount is final.
            </p>
            <div className="flex flex-col items-start gap-2">
              <a
                href="tel:8884275045"
                className="text-sm font-semibold text-teal underline decoration-teal/30 underline-offset-2 transition-colors duration-200 ease-out hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Call GradGuard to start a claim: 888-427-5045
              </a>
              <a
                href="https://gradguard.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-teal px-4 py-2.5 text-sm font-semibold text-teal transition-colors duration-200 ease-out hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Visit GradGuard Support
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
        <Accordion>
          <p>
            GMU refunds 100% of tuition through Sept 8, 50% from Sept 9-15, and 0% from Sept 16 onward for
            Fall 2026 full-semester courses.
          </p>
          {refundTimelineContext && <p className="font-semibold text-ink/75">{refundTimelineContext}</p>}
          <RefundTimeline milestones={refundTimeline} />
          <SourceRow source={POLICY_SOURCES.tuitionRefund} />
        </Accordion>
      </ResultCard>

      {receivesFederalAid && (
        <ResultCard title="Financial Aid Risk" delay={40}>
          <ToneBadge tone={aidPresentation.tone}>{aidPresentation.badgeLabel}</ToneBadge>
          <p className="text-sm font-semibold text-ink/60">Estimated unearned Title IV aid</p>
          <p className="font-heading text-5xl font-semibold text-ink">
            {preciseCurrencyFormatter.format(estimatedUnearnedTitleIVAid)}
          </p>
          <p className="text-base leading-relaxed text-ink/70">{aidPresentation.meaning}</p>
          <Accordion>
            <div className="space-y-2">
              <p className="font-semibold text-ink">How this estimate was calculated</p>
              <DetailList
                items={[
                  {
                    label: 'Federal aid received',
                    value: preciseCurrencyFormatter.format(federalAidReceived),
                  },
                  {
                    label: 'Approx. percentage of payment period completed',
                    value: `${pctCompleted}%`,
                  },
                  {
                    label: 'Estimated unearned Title IV aid',
                    value: preciseCurrencyFormatter.format(estimatedUnearnedTitleIVAid),
                  },
                ]}
              />
            </div>
            <p>
              This estimate uses {aidRepayment.daysElapsed} countable calendar days completed out of{' '}
              {aidRepayment.totalCountableDays}, excluding the scheduled Thanksgiving recess. It does not
              determine the final student balance because R2T4 separately calculates the school return
              responsibility, student responsibility, and grant protections.
            </p>
            <p>GMU Financial Aid makes the final Return of Title IV determination.</p>
            {livesInHousing && (
              <p>
                Campus housing is not included in this Title IV aid estimate. Housing &amp; Residence
                Life may review housing charges separately.
              </p>
            )}
            <SourceRow source={POLICY_SOURCES.financialAid} />
            <SourceRow source={POLICY_SOURCES.federalR2T4} />
          </Accordion>
        </ResultCard>
      )}

      <ResultCard title="Transcript Impact" delay={80}>
        <p className="font-heading text-xl font-semibold leading-snug text-ink">{transcriptImpact}</p>
        <p className="text-base leading-relaxed text-ink/70">{getTranscriptMeaning(transcriptImpact)}</p>
        <Accordion>
          <p>
            A &ldquo;W&rdquo; means withdrawal. It shows you were enrolled but didn&apos;t complete the course,
            without factoring into your GPA calculation.
          </p>
          <SourceRow source={POLICY_SOURCES.transcriptImpact} />
        </Accordion>
      </ResultCard>

      {receivesFederalAid && (
        <ResultCard title="Future Aid Eligibility" delay={120}>
          <ToneBadge tone="caution">Worth a look</ToneBadge>
          <p className="text-base leading-relaxed text-ink/70">
            Withdrawing can affect financial aid eligibility going forward. It&apos;s worth a quick check with
            Financial Aid.
          </p>
          <Accordion>
            <p>
              Heads up: W grades count as attempted hours toward Satisfactory Academic Progress (SAP). If this
              affects your GPA or completion rate, you may need to file a SAP appeal to keep future aid
              eligibility. Confirm with Financial Aid.
            </p>
          </Accordion>
        </ResultCard>
      )}

      {showScholarshipCard && (
        <ResultCard title="Scholarship Impact" delay={160}>
          <ToneBadge tone="caution">Worth a look</ToneBadge>
          <p className="text-base leading-relaxed text-ink/70">
            If you receive a scholarship, withdrawing may affect it. Every award&apos;s terms are different, so
            this is one to confirm directly.
          </p>
          <Accordion>
            <p>
              Scholarships often require continuous full-time enrollment. Withdrawing mid-semester may: prorate
              your scholarship based on your last day of attendance, count this semester against your total
              years of funding even if unused, or affect future eligibility. If your withdrawal is medically
              documented, some scholarship terms treat this differently and may preserve your eligibility.
              Since every scholarship&apos;s terms are different, confirm directly with the office or
              organization that awarded it. This isn&apos;t something we can calculate for you.
            </p>
            {isInternational && (
              <p>
                If you receive an international/tuition-waiver scholarship, this may be directly tied to your
                F-1/J-1 full-time enrollment status. Confirm with OIPS before withdrawing, since dropping
                below full-time generally requires their prior authorization regardless of your scholarship
                terms.
              </p>
            )}
          </Accordion>
        </ResultCard>
      )}

      <ResultCard title="Health Insurance Impact" delay={200}>
        <ToneBadge tone="neutral">Worth checking</ToneBadge>
        <p className="text-base leading-relaxed text-ink/70">
          If you&apos;re on the Aetna Student Health Plan, your withdrawal timing affects your coverage.
        </p>
        <Accordion>
          <p>
            If you&apos;re on GMU&apos;s Aetna Student Health Plan: withdrawing within the first 31 days of the
            semester makes you ineligible for coverage. Withdrawing after 31 days under an approved leave keeps
            your coverage through the period already paid for, with no refund. If you&apos;re an international
            student, insurance is mandatory under GMU policy. Confirm your status with OIPS.
          </p>
        </Accordion>
      </ResultCard>

      <ResultCard title="Coming Back Later" delay={240}>
        <ToneBadge tone="success">Good to know</ToneBadge>
        <p className="text-base leading-relaxed text-ink/70">
          Withdrawing doesn&apos;t close the door. Coming back later is usually straightforward.
        </p>
        <Accordion>
          <p>
            The door isn&apos;t closed. If you&apos;re away 2 years or fewer (without a Leave of Absence on
            file), you can return through the Registrar&apos;s Undergraduate Application for Re-enrollment. Away
            longer than that, or studied elsewhere without permission? You&apos;ll reapply through Admissions.
          </p>
        </Accordion>
      </ResultCard>

      <ResultCard title="Who Reviews This" delay={280}>
        <p className="text-base leading-relaxed text-ink/70">
          These offices are involved in reviewing your withdrawal. Reach out anytime using the contacts below.
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
