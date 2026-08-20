import { useState } from 'react'
import { OFFICES } from '../data/offices.js'
import { buildMailtoUrl, buildWithdrawalInquiryBody } from '../lib/email.js'

function OfficeContactCard({ office, withdrawalDate }) {
  const [reasonIndex, setReasonIndex] = useState(0)
  const reason = office.reasons[reasonIndex]
  const mailtoUrl = buildMailtoUrl({
    to: office.email,
    subject: reason.subject,
    body: buildWithdrawalInquiryBody(reason.label, withdrawalDate),
  })
  const selectId = `contact-reason-${office.email}`

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60">
      <div>
        <p className="text-base font-bold text-stone-950">{office.name}</p>
        <p className="text-sm text-stone-500">{office.email}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Reason for contacting
        </label>
        <select
          id={selectId}
          value={reasonIndex}
          onChange={(event) => setReasonIndex(Number(event.target.value))}
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
        >
          {office.reasons.map((option, index) => (
            <option key={option.subject} value={index}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <a
        href={mailtoUrl}
        className="inline-flex items-center justify-center rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-900 focus:outline-none focus:ring-4 focus:ring-teal-100"
      >
        Send Email
      </a>
    </div>
  )
}

function ContactOffices({ withdrawalDate, livesInHousing, isInternational }) {
  const offices = [
    OFFICES.registrar,
    ...(isInternational ? [OFFICES.international] : []),
    ...(livesInHousing ? [OFFICES.housing] : []),
  ]

  return (
    <div className="space-y-3 border-t border-stone-200 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
        Contact the Right Office
      </h3>
      <div className="flex flex-col gap-3">
        {offices.map((office) => (
          <OfficeContactCard key={office.email} office={office} withdrawalDate={withdrawalDate} />
        ))}
      </div>
    </div>
  )
}

export default ContactOffices
