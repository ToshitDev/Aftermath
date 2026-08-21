import { useState } from 'react'
import { BookOpen, Building2, ChevronDown, CircleDollarSign, ClipboardList, GraduationCap } from 'lucide-react'
import WithdrawalForm from './components/WithdrawalForm.jsx'
import ResultCards from './components/ResultCards.jsx'
import NextStepsChecklist from './components/NextStepsChecklist.jsx'
import AlternativesComparison from './components/AlternativesComparison.jsx'
import SupportBanner from './components/SupportBanner.jsx'
import { FALL_2026_POLICY } from './lib/withdrawalRules.js'

const PREVIEW_ITEMS = [
  {
    title: 'Tuition & refund timing',
    description: 'Estimate the refund tier for the withdrawal date you choose.',
    icon: CircleDollarSign,
  },
  {
    title: 'Financial aid impact',
    description: 'Surface possible Return of Title IV and future aid review points.',
    icon: GraduationCap,
  },
  {
    title: 'Academic record',
    description: 'Show how the withdrawal may appear on your transcript.',
    icon: BookOpen,
  },
  {
    title: 'Offices & next steps',
    description: 'Route you to the right offices, sources, and follow-up actions.',
    icon: Building2,
  },
]

function AboutEstimateDisclosure() {
  return (
    <details className="group max-w-[65ch] text-sm leading-relaxed text-ink/60 print:hidden">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg font-semibold text-teal transition-colors duration-200 ease-out hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true">ⓘ</span>
        <span>About this estimate</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-3 space-y-3 rounded-lg border border-black/5 bg-surface/60 p-4">
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-x-4">
          <dt className="font-semibold text-ink/50">Policy set</dt>
          <dd>{FALL_2026_POLICY.institution} · {FALL_2026_POLICY.term}</dd>
          <dt className="font-semibold text-ink/50">Course schedule</dt>
          <dd>{FALL_2026_POLICY.courseSchedule}</dd>
          <dt className="font-semibold text-ink/50">Policy checked</dt>
          <dd>{FALL_2026_POLICY.policyChecked}</dd>
        </dl>
        <p>These results are planning estimates. The university office listed for each result makes the final determination.</p>
        <p>
          Short-session, 7.5-week, half-semester, and modular courses can have different refund and withdrawal
          deadlines. Check your course schedule before relying on these dates.
        </p>
      </div>
    </details>
  )
}

function Intro() {
  return (
    <header className="w-full space-y-5 print:hidden">
      <div className="max-w-3xl space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal">Withdrawal planning</p>
        <h1 className="font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">Aftermath</h1>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink/70 sm:text-lg">
          See the financial, academic, and administrative impact of withdrawing before you make the decision.
        </p>
      </div>
      <ol className="flex flex-col gap-2 text-sm font-semibold text-ink/55 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        {['Your situation', 'Your impact', 'Your next steps'].map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-teal/20 bg-surface text-xs text-teal-dark">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </header>
  )
}

function EmptyResultsPreview() {
  return (
    <section
      aria-label="Withdrawal map preview"
      className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft sm:p-8"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
          <ClipboardList className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h3 className="font-heading text-xl font-semibold text-ink">Answer the questions on the left.</h3>
          <p className="text-base leading-relaxed text-ink/70">
            We&apos;ll map the consequences here with plain-language estimates, official sources, and next
            actions.
          </p>
        </div>
      </div>

      <ul className="mt-6 divide-y divide-black/5">
        {PREVIEW_ITEMS.map((item) => (
          <li key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-teal-dark">
              <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="text-sm leading-relaxed text-ink/60">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function App() {
  const [withdrawalValues, setWithdrawalValues] = useState(null)
  const [isExampleResult, setIsExampleResult] = useState(false)

  function handleWithdrawalSubmit(values, { isExample = false } = {}) {
    setWithdrawalValues(values)
    setIsExampleResult(isExample)
  }

  return (
    <div className="min-h-screen bg-cream px-3 py-6 text-ink sm:px-6 sm:py-8 lg:px-8 print:py-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 lg:gap-8">
        <Intro />

        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] xl:items-start xl:gap-8">
          <section className="min-w-0 space-y-3 print:hidden xl:sticky xl:top-6">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-semibold text-ink">Your situation</h2>
              <p className="text-sm leading-relaxed text-ink/60">
                Start with the details that change the withdrawal impact.
              </p>
            </div>
            <WithdrawalForm onSubmit={handleWithdrawalSubmit} />
          </section>

          <section className="min-w-0 space-y-4">
            <div className="space-y-1 print:hidden">
              <h2 className="font-heading text-2xl font-semibold text-ink">Your withdrawal map</h2>
              <p className="text-sm leading-relaxed text-ink/60">
                Personalized consequences, contacts, and next steps appear here.
              </p>
            </div>

            {!withdrawalValues && <EmptyResultsPreview />}

            {withdrawalValues && (
              <div className="space-y-4">
                {isExampleResult && (
                  <p className="inline-flex rounded-full border border-teal/20 bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark print:hidden">
                    Example: Maya, a GMU student withdrawing mid-semester
                  </p>
                )}
                <p className="max-w-[65ch] text-sm leading-relaxed text-ink/60">
                  This is an estimate to help you plan. Your financial aid office has the final say, and you can
                  change your answers anytime and resubmit to see updated results.
                </p>
                <AboutEstimateDisclosure />
                <ResultCards {...withdrawalValues} />
                <NextStepsChecklist {...withdrawalValues} />
              </div>
            )}
          </section>
        </div>

        <AlternativesComparison />
      </main>
      <SupportBanner />
    </div>
  )
}

export default App
