/**
 * Mapa de fotografías reales disponibles en /public/images.
 * ImagePlaceholder usa esta tabla automáticamente: al añadir aquí una
 * entrada, todos los usos de ese nombre pasan del placeholder a la foto,
 * sin tocar ninguna página.
 *
 * Reserva sin uso actual: chair-pedal-detail.jpg (detalle del pedal de la
 * Wunda Chair) y luciana-practice-{1,2,3}.jpg (prácticas para blog/IG).
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
};
