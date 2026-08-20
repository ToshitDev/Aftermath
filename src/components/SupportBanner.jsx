// Small, calm, always-visible crisis-support bar. Rendered once in App.jsx,
// outside the form/results flow, so it's present on every view.
function SupportBanner() {
  return (
    <footer
      role="contentinfo"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-100 bg-teal-50/95 px-4 py-2.5 text-center text-xs leading-5 text-teal-950 shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:text-sm print:hidden"
    >
      <p className="mx-auto max-w-5xl">
        Going through a hard time? GMU CAPS:{' '}
        <a href="tel:+17039932380" className="font-semibold underline decoration-teal-400 underline-offset-2">
          703-993-2380
        </a>{' '}
        (after hours, press 1 for a crisis counselor) · Emotional Support Line:{' '}
        <a href="tel:+17032151898" className="font-semibold underline decoration-teal-400 underline-offset-2">
          703-215-1898
        </a>{' '}
        (8:30am–8:30pm daily) · Crisis Text Line: text HOME to 741741 ·{' '}
        <a href="tel:988" className="font-semibold underline decoration-teal-400 underline-offset-2">
          988 Suicide &amp; Crisis Lifeline
        </a>
      </p>
    </footer>
  )
}

export default SupportBanner
