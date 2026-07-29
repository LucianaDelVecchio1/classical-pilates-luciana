import { business } from "@/config/business";

/**
 * Wordmark tipográfico "Horizonte" (dirección A, aprobada 2026-07-29).
 * Provisional y reemplazable: cuando exista un logotipo definitivo,
 * sustituir este componente sin tocar el resto de la web.
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
      <span
        className={`font-display tracking-[0.3em] text-lg uppercase ${className ?? ""}`}
      >
        Classical Pilates
      </span>
    );
  }
  return (
    <span className={`inline-flex flex-col items-center ${className ?? ""}`}>
      <span className="font-display text-xl uppercase tracking-[0.3em] leading-none pl-[0.3em] whitespace-nowrap">
        {business.instagram.screenName}
      </span>
      <span
        aria-hidden="true"
        className="my-1.5 block h-px w-full max-w-[13rem] bg-sea-deep"
      />
      <span className="text-[0.65rem] uppercase tracking-[0.5em] text-char-soft pl-[0.5em]">
        Luciana
      </span>
    </span>
  );
}

/**
 * Sello "L" (dirección C) — uso secundario: favicon, avatar, marca de agua.
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
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="42"
        fill="currentColor"
      >
        L
      </text>
      <line x1="28" y1="70" x2="72" y2="70" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
