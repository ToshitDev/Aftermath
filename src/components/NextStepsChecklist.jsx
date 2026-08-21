import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

const ALWAYS_ITEMS = [
  {
    id: 'submit-application',
    label:
      'Submit your official withdrawal application through StudentAccess before 5pm on the last day of instruction',
    href: 'https://patriotweb.gmu.edu/',
    linkLabel: 'Go to PatriotWeb',
  },
  {
    id: 'return-items',
    label: 'Return any library books or university equipment to avoid a hold on your account',
  },
  {
    id: 'backup-files',
    label:
      'Back up your files from Office 365/OneDrive and set up email forwarding before you lose Patriot Web access',
  },
  {
    id: 'parking-permit',
    label:
      'If you have a parking permit, submit a Permit Exchange/Deactivation Request. Returns within 48 hours may incur a $15 fee',
    href: 'https://parking.gmu.edu/',
    linkLabel: 'Go to Parking Services',
  },
]

function buildChecklistItems({ livesInHousing, receivesFederalAid, isInternational }) {
  const items = [...ALWAYS_ITEMS]

  if (livesInHousing) {
    items.push({
      id: 'housing-contract',
      label: 'Contact Housing & Residence Life to cancel your contract and arrange move-out',
      href: 'https://gmu.starrezhousing.com/StarRezPortal',
      linkLabel: 'Go to Housing Portal (StarRez)',
    })
  }
  if (receivesFederalAid) {
    items.push({
      id: 'sap-check',
      label:
        'Confirm with Financial Aid how this affects your Satisfactory Academic Progress (SAP) and future aid eligibility',
    })
  }
  if (isInternational) {
    items.push({
      id: 'oips-meeting',
      label: 'Meet with an OIPS advisor before submitting your withdrawal to understand your visa status options',
    })
  }

  return items
}

function NextStepsChecklist({ livesInHousing, receivesFederalAid, isInternational }) {
  const items = buildChecklistItems({ livesInHousing, receivesFederalAid, isInternational })
  const [checked, setChecked] = useState({})

  function toggle(id) {
    setChecked((previous) => ({ ...previous, [id]: !previous[id] }))
  }

  return (
    <section
      aria-label="Your next steps"
      className="w-full max-w-5xl rounded-2xl border border-black/5 bg-surface p-6 shadow-soft sm:p-8 print:border-none print:p-0 print:shadow-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-ink">Your Next Steps</h2>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center rounded-lg border-2 border-black/10 bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:border-teal hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface print:hidden"
        >
          Print / Save as PDF
        </button>
      </div>

      <ul className="mt-4 space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg p-2 transition-colors duration-200 ease-out hover:bg-cream print:p-0 print:hover:bg-transparent"
          >
            <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-ink print:cursor-default">
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggle(item.id)}
                className="mt-1.5 h-5 w-5 shrink-0 rounded border-black/20 text-teal focus:ring-2 focus:ring-teal/40 focus:ring-offset-2 focus:ring-offset-surface"
              />
              <span className={checked[item.id] ? 'text-ink/40 line-through' : ''}>{item.label}</span>
            </label>
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-8 mt-1 inline-flex items-center gap-1 text-sm font-semibold text-teal underline decoration-teal/30 underline-offset-2 transition-colors duration-200 ease-out hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {item.linkLabel}
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default NextStepsChecklist
