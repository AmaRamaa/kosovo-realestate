import { cn } from '@/lib/utils';

// AMAR | RAMA — the name mirrored around its shared "R", with a thin glowing
// seam where the two R's meet. Letter-spacing leaves a trailing gap after the
// last letter of each word, so both words pull it back with a negative margin
// to keep the seam centred between the R's.
export default function AmarRamaWordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="AMAR RAMA"
      className={cn('inline-flex select-none items-center gap-3 font-display font-extrabold leading-none tracking-[0.22em] text-neutral-800', className)}
    >
      <span aria-hidden className="-mr-[0.22em]">AMAR</span>
      <span aria-hidden className="relative flex h-[1.7em] w-px items-center justify-center">
        {/* soft bloom around the seam */}
        <span className="absolute h-[2.4em] w-[1.6em] rounded-full bg-primary-400/40 blur-md motion-safe:animate-pulse" />
        {/* the seam itself */}
        <span className="relative h-full w-px bg-gradient-to-b from-primary-300/0 via-primary-500 to-primary-300/0 shadow-[0_0_6px_1px_rgba(200,95,108,0.7)]" />
      </span>
      <span aria-hidden className="-mr-[0.22em]">RAMA</span>
    </span>
  );
}
