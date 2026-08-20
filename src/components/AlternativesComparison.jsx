const OPTIONS = [
  {
    title: 'Full Withdrawal',
    description:
      "Leaves the university this term. Requires a readmission application if you're away more than 2 years.",
  },
  {
    title: 'Leave of Absence',
    description:
      'Filed with the Registrar, up to 2 years. Preserves your catalog year and return rights without a full readmission application.',
  },
  {
    title: 'Selective Withdrawal',
    tag: 'Undergrads only',
    description:
      "Withdraw from a limited number of classes without Dean's approval. Max 3 uses across your entire time at Mason.",
  },
]

function AlternativesComparison() {
  return (
    <section aria-label="Before you decide" className="w-full max-w-5xl space-y-4 print:hidden">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-600">Before You Decide</h2>
        <p className="text-sm leading-6 text-stone-600">
          Withdrawing isn&apos;t the only option — here&apos;s how it compares to a couple of alternatives worth
          considering.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <div
            key={option.title}
            className="flex flex-col gap-2 rounded-3xl border border-stone-200 bg-white p-5 shadow-lg shadow-stone-300/30"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-stone-950">{option.title}</h3>
              {option.tag && (
                <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
                  {option.tag}
                </span>
              )}
            </div>
            <p className="text-sm leading-6 text-stone-700">{option.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AlternativesComparison
