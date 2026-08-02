import { business } from "@/config/business";

/**
 * Wordmark "Ser Classical Pilates" (rebrand 2026-08-02):
 * «Ser» en caligrafía terracota + descriptor CLASSICAL PILATES espaciado.
 * El arte original del logo está en /public/images/logo-ser.jpg (para
 * redes, GBP y material impreso).
 */
export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <span className={`font-script text-3xl text-clay leading-none ${className ?? ""}`}>
        Ser
      </span>
    );
  }
  return (
    <span className={`inline-flex flex-col items-center ${className ?? ""}`}>
      <span className="font-script text-4xl leading-[0.9] text-clay">Ser</span>
      <span className="mt-1 text-[0.6rem] uppercase tracking-[0.45em] text-char-soft pl-[0.45em] whitespace-nowrap">
        {business.instagram.screenName}
      </span>
    </span>
  );
}

/**
 * Sello circular «S» — uso secundario: favicon, avatar, marca de agua.
 */
export function Seal({ className, size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={business.name}
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontFamily="var(--font-script)"
        fontSize="52"
        fill="currentColor"
      >
        S
      </text>
    </svg>
  );
}
