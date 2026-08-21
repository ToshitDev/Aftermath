import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const STATS = [
  '8 real consequences checked',
  'Real GMU policy data',
  'Direct contact, one tap away',
  'Free, no login required',
]

// Same smooth expand/collapse pattern as the result cards' "See details"
// accordions (CSS grid-rows trick, no measured heights, rotating chevron),
// just scaled up into a full clickable header row.
function AboutSection() {
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="w-full rounded-2xl border border-black/5 bg-surface shadow-soft print:hidden">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-4 rounded-2xl p-6 text-left transition-colors duration-200 ease-out hover:bg-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:p-8"
      >
        <h2 className="font-heading text-xl font-semibold text-ink sm:text-2xl">What is Aftermath?</h2>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-teal transition-transform duration-200 ease-out ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
            <p className="max-w-[65ch] text-base leading-relaxed text-ink/70">
              Withdrawing from college mid-semester is one of the hardest decisions a student can face, and the
              consequences are scattered across five different offices: tuition refunds, financial aid,
              transcripts, health insurance, and more. Aftermath brings all of it together in one place.
              Answer a few questions about your situation, and see exactly what happens, using George Mason
              University&apos;s own published Fall 2026 policies. No guessing, no runaround, just a clear
              picture before you decide.
            </p>
            <div className="flex flex-wrap gap-2">
              {STATS.map((stat) => (
                <span key={stat} className="rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-teal-dark">
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
