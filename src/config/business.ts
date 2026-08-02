/**
 * ÚNICA fuente de verdad de la identidad del negocio.
 * Cambiar el nombre, teléfono, email o redes aquí actualiza toda la web.
 */

export const business = {
  /** Nombre definitivo — rebrand confirmado por el cliente el 2026-08-02. */
  name: "Ser Classical Pilates",
  /** Nombre corto para contextos reducidos (barra móvil, footer). */
  shortName: "Ser",
  /** Descriptor SEO en español; las traducciones viven en messages/. */
  seoDescriptor: "Estudio de Pilates Clásico en Palma de Mallorca",
  legalName: "", // TODO: razón social / nombre fiscal para facturación y aviso legal

  founder: "Luciana",

  // Dominio definitivo registrado en DonDominio el 2026-07-29 (titular: Luciana).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://classicalpilatesluciana.com",

  // TODO: teléfono definitivo de WhatsApp Business (provisional).
  whatsappNumber: "+34637037637",
  whatsappDisplay: "+34 637 037 637",

  // Email definitivo (buzón en DonDominio; TODO: crear el buzón en el panel).
  email: "hello@classicalpilatesluciana.com",

  instagram: {
    url: "https://www.instagram.com/pilatesclasicaluciana/",
    handle: "@pilatesclasicaluciana",
    screenName: "Classical Pilates",
  },

  address: {
    // TODO: dirección exacta del estudio pendiente de confirmación.
    // No publicar dirección ni coordenadas hasta tenerlas confirmadas.
    locality: "Palma de Mallorca",
    region: "Illes Balears",
    country: "ES",
    street: null as string | null,
    postalCode: null as string | null,
    geo: null as { lat: number; lng: number } | null,
  },

  /** Precio público único. El resto de precios NUNCA se renderiza en la web. */
  trialClass: {
    priceEur: 30,
    currency: "EUR",
  },

  /**
   * Duración de sesión SIN CONFIRMAR: la minuta dice 50 min, Luciana dice 60.
   * Mientras sea null, la web usa texto neutral ("se confirma al reservar").
   * TODO: fijar 50 o 60 cuando Luciana confirme.
   */
  sessionDurationMinutes: null as number | null,

  /**
   * Equipamiento confirmado que puede mencionarse públicamente.
   * TODO: ampliar cuando Luciana confirme la lista exacta de aparatos.
   */
  confirmedEquipment: ["Reformer", "Barrel"],

  /** Frecuencia editorial del blog. Semanal por defecto hasta confirmar (minuta: cada 3 días). */
  blogPublishCron: process.env.BLOG_PUBLISH_CRON ?? "0 8 * * 1", // lunes 08:00 UTC
} as const;

/*
 * Los precios de sesiones y bonos NO viven en este repositorio: se
 * comunican solo de forma privada por WhatsApp. El único precio público
 * es el de la clase de prueba (trialClass, arriba).
 */

/** Orígenes de conversación de WhatsApp; generan mensajes prellenados distintos. */
export type WhatsAppOrigin =
  | "trial"
  | "trial-purchased"
  | "pricing"
  | "private"
  | "duo"
  | "general"
  | "blog";

export function whatsappLink(origin: WhatsAppOrigin, message: string): string {
  const text = encodeURIComponent(message);
  // El identificador de origen viaja dentro del texto (sin datos personales).
  return `https://wa.me/${business.whatsappNumber.replace("+", "")}?text=${text}`;
}
