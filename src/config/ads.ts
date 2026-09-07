/**
 * Identificadores de conversión de Google Ads.
 * Cuenta "Ser Pilates Classical" (CID 175-953-5794), creados el 2026-09-07.
 *
 * Son IDs PÚBLICOS de cliente: aparecen igualmente en el HTML/JS servido al
 * navegador, no son secretos. Se dejan como valor por defecto para que el
 * seguimiento funcione sin depender de variables de entorno; aun así, si se
 * define la variable NEXT_PUBLIC_* en Vercel, esa tiene prioridad.
 */

/** ID de conversión de la cuenta (etiqueta de Google). */
export const googleAdsId =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-18411389679";

/** Etiqueta de conversión: envío correcto del formulario ("Enviar mensaje"). */
export const googleAdsLabelLead =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD ?? "FaKyCIz-r_AcEO-FnstE";

/** Etiqueta de conversión: clic en cualquier botón de contacto por WhatsApp. */
export const googleAdsLabelWhatsapp =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP ?? "3xpUCI_-r_AcEO-FnstE";
