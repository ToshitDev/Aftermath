// Pure helpers for building mailto links. No DOM/UI access, no I/O.

/**
 * Formats a 'YYYY-MM-DD' string as a human-readable date (e.g. "October 14,
 * 2026"), parsed as UTC so it matches the calendar day the student picked
 * regardless of local timezone.
 */
export function formatWithdrawalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date)
}

function capitalizeFirst(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// "my name is X" / "My G-Number is Y" — lowercase "my" only on the clause
// right after "Hello,"; any clause after that starts a new sentence.
function buildIdentityClause(studentName, gNumber) {
  const clauses = []
  if (studentName) clauses.push(`my name is ${studentName}`)
  if (gNumber) clauses.push(`my G-Number is ${gNumber}`)

  return clauses.map((clause, index) => (index === 0 ? clause : capitalizeFirst(clause))).join('. ') + '.'
}

/**
 * Builds the polite, pre-filled inquiry body shared by every office's
 * "Send Email" action. `studentName`/`gNumber` are optional — omitting both
 * falls back to the original, unpersonalized greeting.
 */
export function buildWithdrawalInquiryBody(reasonLabel, withdrawalDate, { studentName, gNumber } = {}) {
  const greeting =
    studentName || gNumber
      ? `Hello, ${buildIdentityClause(studentName, gNumber)} I am withdrawing from the Fall 2026 semester`
      : 'Hello, I am a George Mason University student withdrawing from the Fall 2026 semester'

  return (
    `${greeting} and need assistance with the following: ${reasonLabel}. My withdrawal date is ` +
    `${formatWithdrawalDate(withdrawalDate)}. Please let me know the next steps. Thank you.`
  )
}

/** Builds a mailto: URL with an encoded subject and body. */
export function buildMailtoUrl({ to, subject, body }) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
