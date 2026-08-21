import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { OFFICES } from '../data/offices.js'
import { buildMailtoUrl, buildWithdrawalInquiryBody } from '../lib/email.js'

const OTHER_VALUE = 'other'
const OTHER_SUBJECT = 'Withdrawal Inquiry: My Situation'
const OTHER_FALLBACK_REASON =
  'I need assistance with my withdrawal and would like to discuss my specific situation'

function OfficeContactCard({ office, withdrawalDate, studentName, gNumber }) {
  const [selection, setSelection] = useState('0')
  const [otherText, setOtherText] = useState('')
  const isOther = selection === OTHER_VALUE
  const selectedReason = isOther ? null : office.reasons[Number(selection)]

  const subject = isOther ? OTHER_SUBJECT : selectedReason.subject
  const reasonLabel = isOther ? otherText.trim() || OTHER_FALLBACK_REASON : selectedReason.label
  const mailtoUrl = buildMailtoUrl({
    to: office.email,
    subject,
    body: buildWithdrawalInquiryBody(reasonLabel, withdrawalDate, { studentName, gNumber }),
  })
  const selectId = `contact-reason-${office.email}`
  const otherTextId = `contact-other-${office.email}`

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-surface p-4 shadow-soft">
      <div>
        <p className="text-base font-semibold text-ink">{office.name}</p>
        <p className="text-sm text-ink/60">{office.email}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          Reason for contacting
        </label>
        <select
          id={selectId}
          value={selection}
          onChange={(event) => setSelection(event.target.value)}
          className="w-full rounded-lg border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors duration-200 ease-out focus:border-teal focus:ring-2 focus:ring-teal/40"
        >
          {office.reasons.map((option, index) => (
            <option key={option.subject} value={String(index)}>
              {option.label}
            </option>
          ))}
          <option value={OTHER_VALUE}>Other (describe your situation)</option>
        </select>
      </div>

      {isOther && (
        <div className="animate-fade-slide-in space-y-1.5">
          <label htmlFor={otherTextId} className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Tell us more (optional)
          </label>
          <textarea
            id={otherTextId}
            value={otherText}
            onChange={(event) => setOtherText(event.target.value)}
            placeholder="Briefly describe what you need help with (optional)"
            rows={3}
            className="w-full resize-none rounded-lg border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors duration-200 ease-out focus:border-teal focus:ring-2 focus:ring-teal/40"
          />
        </div>
      )}

      <a
        href={mailtoUrl}
        className="inline-flex items-center justify-center rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-out hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Send Email
      </a>

      {office.phone && (
        <a
          href={`tel:${office.phone}`}
          className="text-sm font-semibold text-teal underline decoration-teal/30 underline-offset-2 transition-colors duration-200 ease-out hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Call to schedule: {office.phoneDisplay}
        </a>
      )}

      {office.links?.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-teal px-4 py-2.5 text-sm font-semibold text-teal transition-colors duration-200 ease-out hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {link.label}
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      ))}

      {office.note && <p className="text-xs leading-relaxed text-ink/50">{office.note}</p>}
    </div>
  )
}

function ContactOffices({ withdrawalDate, livesInHousing, isInternational, studentName, gNumber }) {
  const offices = [
    OFFICES.registrar,
    ...(isInternational ? [OFFICES.international] : []),
    ...(livesInHousing ? [OFFICES.housing] : []),
  ]

  return (
    <div className="space-y-3 border-t border-black/5 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">Contact the Right Office</h3>
      <div className="flex flex-col gap-3">
        {offices.map((office) => (
          <OfficeContactCard
            key={office.email}
            office={office}
            withdrawalDate={withdrawalDate}
            studentName={studentName}
            gNumber={gNumber}
          />
        ))}
      </div>
    </div>
  )
}

export default ContactOffices
