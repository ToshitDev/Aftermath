// Small, calm crisis-support footer. It stays in the normal document flow so it
// remains accessible without covering form fields, results, or print controls.
function SupportBanner() {
  return (
    <footer
      role="contentinfo"
      className="mx-auto mt-8 w-full max-w-7xl border-t border-black/5 px-4 py-5 text-center text-xs leading-relaxed text-ink/70 sm:px-6 sm:text-sm lg:px-8 print:hidden"
    >
      <p className="mx-auto max-w-5xl">
        Going through a hard time? GMU CAPS:{' '}
        <a href="tel:+17039932380" className="font-semibold text-teal underline decoration-teal/40 underline-offset-2 hover:text-teal-dark">
          703-993-2380
        </a>{' '}
        (after hours, press 1 for a crisis counselor) · Emotional Support Line:{' '}
        <a href="tel:+17032151898" className="font-semibold text-teal underline decoration-teal/40 underline-offset-2 hover:text-teal-dark">
          703-215-1898
        </a>{' '}
        (8:30am–8:30pm daily) · Crisis Text Line: text HOME to 741741 ·{' '}
        <a href="tel:988" className="font-semibold text-teal underline decoration-teal/40 underline-offset-2 hover:text-teal-dark">
          988 Suicide &amp; Crisis Lifeline
        </a>
      </p>
    </footer>
  )
}

export default SupportBanner
