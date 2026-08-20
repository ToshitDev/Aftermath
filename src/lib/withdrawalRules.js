// George Mason University — Fall 2026 withdrawal policy calculations.
// Pure functions only: no DOM/UI access, no I/O. Dates may be passed as
// `Date` objects or 'YYYY-MM-DD' strings; both are normalized internally.

const MS_PER_DAY = 24 * 60 * 60 * 1000

// GMU's fall semester instructional period length, used as the denominator
// for the Return of Title IV Funds (R2T4) "percentage completed" calculation.
const FALL_SEMESTER_LENGTH_DAYS = 79

// The date the "no GPA impact" withdrawal window closes for Fall 2026.
// From this date through the end of the withdrawal period, GMU treats the
// action as a full-semester withdrawal rather than a per-course one.
const FULL_WITHDRAWAL_CUTOFF = '2026-11-13'
const FULL_WITHDRAWAL_DEADLINE = '2026-12-11'

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

// Tuition refund schedule as a date-range lookup table, so future semesters
// can be added by appending another block of rows (or swapping this table
// out via a term identifier) without touching the lookup logic itself.
// `start`/`end` of `null` mean "unbounded in that direction".
const TUITION_REFUND_SCHEDULE_FALL_2026 = [
  { start: null, end: '2026-09-08', refundPct: 100, owedPct: 0 },
  { start: '2026-09-09', end: '2026-09-14', refundPct: 50, owedPct: 50 },
  { start: '2026-09-15', end: null, refundPct: 0, owedPct: 100 },
]

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
 * 2. Title IV financial aid repayment, per GMU's Fall 2026 79-day term.
 * @param {Date|string} withdrawalDate
 * @param {Date|string} termStartDate
 * @param {number} totalAidDisbursed
 * @param {boolean} livesInHousing
 * @returns {{
 *   daysElapsed: number,
 *   pctCompleted: number,
 *   earnedPct: number,
 *   unearnedPct: number,
 *   owed: number,
 *   housingAidMayBeBilled?: true
 * }}
 */
export function calculateAidRepayment(withdrawalDate, termStartDate, totalAidDisbursed, livesInHousing) {
  const daysElapsed = daysBetweenInclusive(termStartDate, withdrawalDate)
  const pctCompleted = daysElapsed / FALL_SEMESTER_LENGTH_DAYS

  const result =
    pctCompleted >= 0.6
      ? { daysElapsed, pctCompleted, earnedPct: 100, unearnedPct: 0, owed: 0 }
      : {
          daysElapsed,
          pctCompleted,
          earnedPct: pctCompleted * 100,
          unearnedPct: (1 - pctCompleted) * 100,
          owed: (1 - pctCompleted) * totalAidDisbursed,
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
  return 'Outside the published withdrawal window — contact the Registrar\'s Office'
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
if (import.meta.url === `file://${process.argv[1]}`) {
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
    'Aid repayment:',
    calculateAidRepayment(maya.withdrawalDate, maya.termStartDate, maya.totalAidDisbursed, maya.livesInHousing),
  )
  console.log('Transcript impact:', calculateTranscriptImpact(maya.withdrawalDate, maya.termStartDate))
  console.log('Review route:', getReviewRoute(maya.isInternational, maya.livesInHousing))
}
