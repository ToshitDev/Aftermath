import { CalendarClock, ListMinus, LogOut } from 'lucide-react'

const OPTIONS = [
  {
    title: 'Full Withdrawal',
    icon: LogOut,
    description:
      "Leaves the university this term. Requires a readmission application if you're away more than 2 years.",
  },
  {
    title: 'Leave of Absence',
    icon: CalendarClock,
    description:
      'Filed with the Registrar, up to 2 years. Preserves your catalog year and return rights without a full readmission application.',
  },
  {
    title: 'Selective Withdrawal',
    icon: ListMinus,
    tag: 'Undergrads only',
    description:
      "Withdraw from a limited number of classes without Dean's approval. Max 3 uses across your entire time at Mason.",
  },
]

function AlternativesComparison() {
  return (
    <section aria-label="Before you decide" className="w-full space-y-4 print:hidden">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">Before You Decide</h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink/70">
          Withdrawing isn&apos;t the only option. Here&apos;s how it compares to a couple of alternatives worth
          considering.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <div
            key={option.title}
            className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-surface p-6 shadow-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                <option.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              {option.tag && (
                <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-ink/70">
                  {option.tag}
                </span>
              )}
            </div>
            <h3 className="font-heading text-xl font-semibold text-ink">{option.title}</h3>
            <p className="text-sm leading-relaxed text-ink/70">{option.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AlternativesComparison
