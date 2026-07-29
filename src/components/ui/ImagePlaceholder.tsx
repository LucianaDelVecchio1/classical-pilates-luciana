import Image from "next/image";
import { REAL_IMAGES } from "@/config/images";

/**
 * Fotografía real si existe, placeholder elegante si no.
 *
 * CÓMO AÑADIR UNA FOTO (sin tocar el diseño ni las páginas):
 * 1. Guardar la foto en /public/images/<name>.jpg (o .avif/.webp).
 * 2. Añadir la entrada en src/config/images.ts (REAL_IMAGES).
 * Los nombres esperados: luciana-hero, luciana-portrait, studio-sea-view,
 * studio-reformer, studio-barrel, classical-pilates-session, movement-detail,
 * studio-atmosphere.
 */
const RATIOS = {
  hero: "aspect-[16/10] md:aspect-[21/9]",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
} as const;

export function ImagePlaceholder({
  name,
  alt,
  ratio = "landscape",
  src,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  /** Nombre descriptivo del asset (p. ej. "studio-sea-view"). */
  name: string;
  alt: string;
  ratio?: keyof typeof RATIOS;
  /** Ruta explícita de la imagen; si se omite, se resuelve desde REAL_IMAGES. */
  src?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const resolvedSrc = src ?? REAL_IMAGES[name];

  if (resolvedSrc) {
    return (
      <div className={`relative overflow-hidden ${RATIOS[ratio]} ${className ?? ""}`}>
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex items-end overflow-hidden bg-gradient-to-b from-sand via-stone/70 to-sea/40 ${RATIOS[ratio]} ${className ?? ""}`}
    >
      {/* Línea de horizonte del placeholder */}
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-ivory-soft/70" />
      <span className="relative m-4 rounded-sm bg-ivory-soft/85 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-char-soft">
        {name}
      </span>
    </div>
  );
}
