// AMAR | ЯAMA — the name is a palindrome, the seam is the mirror axis.
// Colours come from the site palette: heading-dark text, burgundy (primary) seam.
//
// The right half is the left half reflected, so its first letter is a mirrored R
// (Я). It's a CSS-flipped Latin R rather than a typed Cyrillic "Я": the site font
// (Plus Jakarta Sans) has no basic Cyrillic glyphs, so a real Я would fall back
// to a different font and weight. Letter-spacing leaves a trailing gap after each
// word's last letter (and after the flipped R, on the wrong side), so those are
// cancelled to keep both gaps around the seam equal.
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.55em] font-display font-bold uppercase tracking-[0.12em] text-neutral-900 ${className}`}
      aria-label="Amar Rama"
    >
      <span aria-hidden className="-mr-[0.12em]">AMAR</span>
      <span
        aria-hidden
        className="h-[1.15em] w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent shadow-[0_0_10px_2px_rgba(200,95,108,0.8)]"
      />
      <span aria-hidden className="-mr-[0.12em]">
        <span className="mr-[0.12em] inline-block scale-x-[-1] tracking-normal">R</span>AMA
      </span>
    </span>
  );
}
