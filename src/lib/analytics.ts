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
  }
}

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
}
