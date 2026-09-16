import Link from "next/link";

export function BrandLogo({ href = "/browse", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="Movie Explorer home">
      <span className="relative grid h-8 w-7 place-items-center overflow-hidden rounded-[5px] bg-vanta-red shadow-[0_0_24px_rgba(229,9,20,.24)]">
        <span className="absolute h-7 w-[5px] -rotate-[17deg] bg-white/95 shadow-[0_0_12px_rgba(255,255,255,.55)]" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-extrabold tracking-[0.24em] text-white transition-colors group-hover:text-vanta-red sm:text-2xl">
          MOVIES
        </span>
      )}
    </Link>
  );
}
