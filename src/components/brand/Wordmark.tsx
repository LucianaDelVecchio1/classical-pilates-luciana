import Image from "next/image";
import { business } from "@/config/business";

/**
 * Logo oficial "Ser Classical Pilates" (arte dorado, descriptor "PILATES CLASSICAL").
 * /public/images/logo-ser.png — transparente, extraído del arte oro-sobre-negro
 *   conservando el degradado dorado. Proporción 733×380 (2026-08-26).
 * /public/images/logo-ser-gold-{dark,light}.jpg — versiones con fondo para
 *   redes e impresión.
 */
const RATIO = 733 / 380;

export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const height = compact ? 44 : 56;
  return (
    <Image
      src="/images/logo-ser.png"
      alt={business.name}
      width={Math.round(height * RATIO)}
      height={height}
      priority
      className={className}
    />
  );
}

/** Versión reducida del logo para el footer y usos secundarios. */
export function Seal({ className, size = 48 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/images/logo-ser.png"
      alt={business.name}
      width={Math.round(size * RATIO)}
      height={size}
      className={className}
    />
  );
}
