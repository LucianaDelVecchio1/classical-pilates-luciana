import Image from "next/image";
import { business } from "@/config/business";

/**
 * Logo oficial "Ser Classical Pilates" (arte original, dorado #B4914F).
 * /public/images/logo-ser.png — transparente, generado del arte original
 *   (logo-ser-gold-light.jpg) recortado y con máscara alfa. Proporción 889×455.
 * /public/images/logo-ser-gold-{light,dark}.jpg — versiones con fondo para
 *   redes e impresión. (logo-ser.svg es un trazado aproximado; NO usar.)
 */
const RATIO = 889 / 455;

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
