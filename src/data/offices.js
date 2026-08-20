// GMU office contacts and reason templates for the "Contact the Right
// Office" section. Each reason carries its own email subject so the
// mailto link stays specific to what the student picked.

export const OFFICES = {
  registrar: {
    name: "Registrar's Office",
    email: 'registrar@gmu.edu',
    reasons: [
      {
        label: 'I have questions about my withdrawal date and refund',
        subject: 'Withdrawal Inquiry: Withdrawal Date and Refund',
      },
      {
        label: 'I need help understanding the withdrawal process',
        subject: 'Withdrawal Inquiry: Understanding the Withdrawal Process',
      },
      {
        label: 'I need to confirm my transcript notation',
        subject: 'Withdrawal Inquiry: Transcript Notation',
      },
    ],
  },
  international: {
    name: 'International Programs & Services (OIPS)',
    email: 'oips@gmu.edu',
    reasons: [
      {
        label: "I'm withdrawing and need to understand my visa status impact",
        subject: 'Withdrawal Inquiry: Visa Status Impact',
      },
      {
        label: 'I need guidance on maintaining status during a leave of absence',
        subject: 'Withdrawal Inquiry: Maintaining Status During a Leave of Absence',
      },
      {
        label: 'I have general questions about withdrawing as an international student',
        subject: 'Withdrawal Inquiry: International Student Questions',
      },
    ],
  },
  housing: {
    name: 'Housing & Residence Life',
    email: 'housing@gmu.edu',
    reasons: [
      {
        label: "I'm withdrawing and need to cancel my housing contract",
        subject: 'Withdrawal Inquiry: Housing Contract Cancellation',
      },
      {
        label: 'I need to know my housing refund amount',
        subject: 'Withdrawal Inquiry: Housing Refund Amount',
      },
      {
        label: 'I need to arrange move-out logistics',
        subject: 'Withdrawal Inquiry: Move-Out Logistics',
      },
    ],
  },
}
