// George Mason University — Fall 2026 withdrawal policy calculations.
// Pure functions only: no DOM/UI access, no I/O. Dates may be passed as
// `Date` objects or 'YYYY-MM-DD' strings; both are normalized internally.

const MS_PER_DAY = 24 * 60 * 60 * 1000

export const POLICY_CHECKED_DATE = '2026-08-21'
export const POLICY_CHECKED_DISPLAY = 'August 21, 2026'
export const POLICY_CHECKED_SHORT = 'Aug 21, 2026'
export const FALL_2026_TERM_START = '2026-08-24'
export const FALL_2026_TERM_END = '2026-12-16'

export const FALL_2026_R2T4_EXCLUDED_BREAKS = [
  { start: '2026-11-25', end: '2026-11-29', label: 'Thanksgiving recess' },
]

// The date the "no GPA impact" withdrawal window closes for Fall 2026.
// From this date through the end of the withdrawal period, GMU treats the
// action as a full-semester withdrawal rather than a per-course one.
const FULL_WITHDRAWAL_CUTOFF = '2026-11-13'
const FULL_WITHDRAWAL_DEADLINE = '2026-12-11'

export const POLICY_SOURCES = {
  tuitionRefund: {
    label: 'GMU Registrar - Fall 2026 Academic Calendar',
    href: 'https://registrar.gmu.edu/calendars-2/fall_2026/',
    checked: true,
  },
  financialAid: {
    label: 'GMU Catalog - Financial Aid',
    href: 'https://catalog.gmu.edu/tuition-fees/financial-aid/',
    checked: true,
  },
  federalR2T4: {
    label: 'Federal Student Aid Handbook - Return of Title IV Aid',
    href: 'https://fsapartners.ed.gov/knowledge-center/fsa-handbook/2026-2027/vol5/ch2-steps-return-title-iv-aid-calculation-part-1',
    checked: true,
  },
  transcriptImpact: {
    label: 'GMU Catalog - AP.1 Registration and Attendance',
    href: 'https://catalog.gmu.edu/policies/academic/registration-attendance/',
    checked: true,
  },
}

/**
 * Normalizes a Date or 'YYYY-MM-DD' string into a UTC-midnight Date so that
 * calendar-day comparisons are stable regardless of the caller's local
 * timezone (a Date object's local Y/M/D is what's treated as "the day").
 */
function toUTCDate(input) {
  if (input instanceof Date) {
    return new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()))
  }
  const [year, month, day] = input.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function daysBetweenInclusive(start, end) {
  return Math.round((toUTCDate(end).getTime() - toUTCDate(start).getTime()) / MS_PER_DAY) + 1
}

function addDays(dateString, days) {
  const date = new Date(toUTCDate(dateString).getTime() + days * MS_PER_DAY)
  return date.toISOString().slice(0, 10)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function isWithinDateRange(date, start, end) {
  const time = toUTCDate(date).getTime()
  return time >= toUTCDate(start).getTime() && time <= toUTCDate(end).getTime()
}

function getEffectiveR2T4WithdrawalDate(withdrawalDate, breaks) {
  const breakDuringWithdrawal = breaks.find((scheduledBreak) =>
    isWithinDateRange(withdrawalDate, scheduledBreak.start, scheduledBreak.end),
  )

  return breakDuringWithdrawal ? addDays(breakDuringWithdrawal.start, -1) : withdrawalDate
}

function countR2T4CalendarDays(start, end, breaks = []) {
  if (toUTCDate(end).getTime() < toUTCDate(start).getTime()) {
    return 0
  }

  let count = 0
  let cursor = toUTCDate(start)
  const endTime = toUTCDate(end).getTime()

  while (cursor.getTime() <= endTime) {
    const dateString = cursor.toISOString().slice(0, 10)
    const isExcludedBreakDay = breaks.some((scheduledBreak) => {
      const breakLength = daysBetweenInclusive(scheduledBreak.start, scheduledBreak.end)

      return breakLength >= 5 && isWithinDateRange(dateString, scheduledBreak.start, scheduledBreak.end)
    })

    if (!isExcludedBreakDay) {
      count += 1
    }
    cursor = new Date(cursor.getTime() + MS_PER_DAY)
  }

  return count
}

// Tuition refund schedule as a date-range lookup table, so future semesters
// can be added by appending another block of rows (or swapping this table
// out via a term identifier) without touching the lookup logic itself.
// `start`/`end` of `null` mean "unbounded in that direction".
export const TUITION_REFUND_SCHEDULE_FALL_2026 = [
  { start: null, end: '2026-09-08', refundPct: 100, owedPct: 0 },
  { start: '2026-09-09', end: '2026-09-15', refundPct: 50, owedPct: 50 },
  { start: '2026-09-16', end: null, refundPct: 0, owedPct: 100 },
]

export const FALL_2026_POLICY = {
  institution: 'George Mason University',
  term: 'Fall 2026',
  courseSchedule: 'Full-semester courses',
  termStart: FALL_2026_TERM_START,
  termEnd: FALL_2026_TERM_END,
  r2t4ExcludedBreaks: FALL_2026_R2T4_EXCLUDED_BREAKS,
  r2t4CountableDays: countR2T4CalendarDays(
    FALL_2026_TERM_START,
    FALL_2026_TERM_END,
    FALL_2026_R2T4_EXCLUDED_BREAKS,
  ),
  tuitionRefundSchedule: TUITION_REFUND_SCHEDULE_FALL_2026,
  policyChecked: POLICY_CHECKED_DISPLAY,
}

/**
 * 1. Tuition refund/owed percentage based on withdrawal date.
 * @param {Date|string} withdrawalDate
 * @param {{start: string|null, end: string|null, refundPct: number, owedPct: number}[]} [schedule]
 * @returns {{ refundPct: number, owedPct: number }}
 */
export function calculateTuitionRefund(withdrawalDate, schedule = TUITION_REFUND_SCHEDULE_FALL_2026) {
  const wd = toUTCDate(withdrawalDate).getTime()

  for (const row of schedule) {
    const startTime = row.start ? toUTCDate(row.start).getTime() : -Infinity
    const endTime = row.end ? toUTCDate(row.end).getTime() : Infinity
    if (wd >= startTime && wd <= endTime) {
      return { refundPct: row.refundPct, owedPct: row.owedPct }
    }
  }

  throw new Error(`No tuition refund rule covers withdrawal date ${withdrawalDate}`)
}

/**
 * 2. Estimated unearned Title IV aid for R2T4 planning.
 * @param {Date|string} withdrawalDate
 * @param {Date|string} termStartDate
 * @param {number} totalAidDisbursed
 * @param {boolean} livesInHousing
 * @returns {{
 *   daysElapsed: number,
 *   totalCountableDays: number,
 *   pctCompleted: number,
 *   earnedPct: number,
 *   unearnedPct: number,
 *   unearnedTitleIVAid: number,
 *   // Backward-compatible alias for unearnedTitleIVAid; do not label as student liability in UI.
 *   owed: number,
 *   housingAidMayBeBilled?: true
 * }}
 */
export function calculateAidRepayment(withdrawalDate, termStartDate, totalAidDisbursed, livesInHousing) {
  const effectiveWithdrawalDate = getEffectiveR2T4WithdrawalDate(
    withdrawalDate,
    FALL_2026_POLICY.r2t4ExcludedBreaks,
  )
  const totalCountableDays = FALL_2026_POLICY.r2t4CountableDays
  const daysElapsed = clamp(
    countR2T4CalendarDays(termStartDate, effectiveWithdrawalDate, FALL_2026_POLICY.r2t4ExcludedBreaks),
    0,
    totalCountableDays,
  )
  const pctCompleted = daysElapsed / totalCountableDays
  const aidDisbursed = Math.max(Number(totalAidDisbursed) || 0, 0)
  const unearnedTitleIVAid = Math.min(aidDisbursed, (1 - pctCompleted) * aidDisbursed)

  const result =
    pctCompleted > 0.6
      ? {
          daysElapsed,
          totalCountableDays,
          pctCompleted,
          earnedPct: 100,
          unearnedPct: 0,
          unearnedTitleIVAid: 0,
          owed: 0,
        }
      : {
          daysElapsed,
          totalCountableDays,
          pctCompleted,
          earnedPct: pctCompleted * 100,
          unearnedPct: (1 - pctCompleted) * 100,
          unearnedTitleIVAid,
          owed: unearnedTitleIVAid,
        }

  if (livesInHousing) {
    result.housingAidMayBeBilled = true
  }

  return result
}

/**
 * 3. Transcript impact of a withdrawal.
 * @param {Date|string} withdrawalDate
 * @param {Date|string} termStartDate
 * @returns {string}
 */
export function calculateTranscriptImpact(withdrawalDate, termStartDate) {
  const wd = toUTCDate(withdrawalDate).getTime()
  const start = toUTCDate(termStartDate).getTime()
  const fullWithdrawalCutoff = toUTCDate(FULL_WITHDRAWAL_CUTOFF).getTime()
  const fullWithdrawalDeadline = toUTCDate(FULL_WITHDRAWAL_DEADLINE).getTime()

  if (wd < start) {
    return 'No record on transcript'
  }
  if (wd < fullWithdrawalCutoff) {
    return 'W notation, no GPA impact'
  }
  if (wd <= fullWithdrawalDeadline) {
    return 'Full semester withdrawal, W notation'
  }

  // Past GMU's published Fall 2026 withdrawal deadline — no policy above covers this.
  return 'Outside the published withdrawal window. Contact the Registrar\'s Office'
}

/**
 * 4. Offices a withdrawing student needs to route their paperwork through.
 * @param {boolean} isInternational
 * @param {boolean} livesInHousing
 * @returns {string[]}
 */
export function getReviewRoute(isInternational, livesInHousing) {
  const route = ['Your School/Major Department', "Registrar's Office"]

  if (isInternational) {
    route.push('International Center')
  }
  if (livesInHousing) {
    route.push('Housing & Residence Life (contact separately — aid may be billed for remaining term)')
  }

  return route
}

// --- Manual sanity check: Maya's scenario -----------------------------
// Run directly with `node src/lib/withdrawalRules.js`. Not executed on import.
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const maya = {
    withdrawalDate: '2026-10-14',
    termStartDate: '2026-08-24',
    totalAidDisbursed: 8000,
    livesInHousing: true,
    isInternational: false,
  }

  console.log('--- Maya scenario ---')
  console.log('Inputs:', maya)
  console.log('Tuition refund:', calculateTuitionRefund(maya.withdrawalDate))
  console.log(
    'Estimated unearned Title IV aid:',
    calculateAidRepayment(maya.withdrawalDate, maya.termStartDate, maya.totalAidDisbursed, maya.livesInHousing),
  )
  console.log('Transcript impact:', calculateTranscriptImpact(maya.withdrawalDate, maya.termStartDate))
  console.log('Review route:', getReviewRoute(maya.isInternational, maya.livesInHousing))
}
