"use client";

/**
 * Capa fina de analítica: empuja eventos a dataLayer (GTM) solo si existe.
 * GTM únicamente se carga tras el consentimiento (ver AnalyticsScripts),
 * por lo que sin consentimiento estos eventos no salen del navegador.
 * Nunca incluir datos personales identificables en los parámetros.
 */

export type AnalyticsEvent =
  | "view_trial_offer"
  | "click_trial_cta"
  | "begin_checkout"
  | "purchase"
  | "click_whatsapp"
  | "submit_lead_form"
  | "view_contact"
  | "select_language"
  | "read_blog_article";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Acciones de conversión de Google Ads. Cada evento aquí dispara, además del
 * push a dataLayer, una conversión gtag hacia AW-XXX/ETIQUETA. Las etiquetas
 * llegan por variable de entorno; si faltan, no se dispara nada (dormido).
 * Métrica objetivo: CPA (coste por conversión).
 */
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADS_CONVERSION_LABELS: Partial<Record<AnalyticsEvent, string | undefined>> = {
  // Clic en "Enviar mensaje" del formulario (se cuenta al enviarse correctamente).
  submit_lead_form: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD,
  // Clic en cualquier botón de contacto por WhatsApp.
  click_whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP,
};

export function track(
  event: AnalyticsEvent,
  params: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({
    event,
    page_path: window.location.pathname,
    site_language: document.documentElement.lang,
    ...params,
  });

  // Conversión de Google Ads (gtag). Consent Mode v2 gobierna la privacidad:
  // sin consentimiento de marketing, Google modela la conversión sin cookies.
  const label = ADS_CONVERSION_LABELS[event];
  if (GOOGLE_ADS_ID && label && typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}` });
  }
}
