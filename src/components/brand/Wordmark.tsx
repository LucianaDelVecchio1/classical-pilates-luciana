import Image from "next/image";
import { business } from "@/config/business";

/**
 * Logo oficial "Ser Classical Pilates" (vectorial, texto en curvas).
 * Archivos: /public/images/logo-ser.svg (transparente, uso web)
 * y /public/images/logo-ser-beige.svg (con fondo, para redes/impresión).
 * Proporción del arte: 630×225 (~2,8:1).
 */
export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const height = compact ? 40 : 52;
  const width = Math.round((height * 630) / 225);
  return (
    <Image
      src="/images/logo-ser.svg"
      alt={business.name}
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}

/**
 * Versión reducida del logo para el footer y usos secundarios.
 * (El favicon vive aparte en src/app/icon.svg.)
 */
export function Seal({ className, size = 48 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/images/logo-ser.svg"
      alt={business.name}
      width={Math.round((size * 630) / 225)}
      height={size}
      className={className}
    />
  );
}
