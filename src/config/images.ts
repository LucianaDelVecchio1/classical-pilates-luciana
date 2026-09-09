/**
 * Mapa de fotografías reales disponibles en /public/images.
 * ImagePlaceholder usa esta tabla automáticamente: al añadir aquí una
 * entrada, todos los usos de ese nombre pasan del placeholder a la foto,
 * sin tocar ninguna página.
 *
 * Reserva sin uso actual: chair-pedal-detail.jpg (detalle del pedal de la
 * Wunda Chair). luciana-practice-{1,2,3}.jpg son las portadas de los 3
 * artículos del blog (ver content/blog/es/*.mdx).
 */
export const REAL_IMAGES: Record<string, string> = {
  "luciana-hero": "/images/luciana-hero.jpg",
  "luciana-portrait": "/images/luciana-portrait.jpg",
  "studio-sea-view": "/images/studio-sea-view.jpg",
  "studio-reformer": "/images/studio-reformer.jpg",
  "studio-barrel": "/images/studio-barrel.jpg",
  "studio-atmosphere": "/images/studio-atmosphere.jpg",
  "classical-pilates-session": "/images/classical-pilates-session.jpg",
  "movement-detail": "/images/movement-detail.jpg",
  "luciana-practice-1": "/images/luciana-practice-1.jpg",
  "luciana-practice-2": "/images/luciana-practice-2.jpg",
  "luciana-practice-3": "/images/luciana-practice-3.jpg",
};
