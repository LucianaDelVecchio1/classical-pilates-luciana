import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "sv", "de"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/luciana": {
      es: "/sobre-luciana",
      en: "/about-luciana",
      sv: "/om-luciana",
      de: "/ueber-luciana",
    },
    "/metodo": {
      es: "/metodo-pilates-clasico",
      en: "/classical-pilates-method",
      sv: "/klassisk-pilates-metoden",
      de: "/klassische-pilates-methode",
    },
    "/estudio": {
      es: "/el-estudio",
      en: "/the-studio",
      sv: "/studion",
      de: "/das-studio",
    },
    "/sesiones": {
      es: "/sesiones",
      en: "/sessions",
      sv: "/sessioner",
      de: "/sitzungen",
    },
    "/clase-de-prueba": {
      es: "/clase-de-prueba",
      en: "/trial-class",
      sv: "/provlektion",
      de: "/probestunde",
    },
    "/faq": {
      es: "/preguntas-frecuentes",
      en: "/faq",
      sv: "/vanliga-fragor",
      de: "/haeufige-fragen",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contacto": {
      es: "/contacto",
      en: "/contact",
      sv: "/kontakt",
      de: "/kontakt",
    },
    "/pago-confirmado": {
      es: "/pago-confirmado",
      en: "/payment-confirmed",
      sv: "/betalning-bekraftad",
      de: "/zahlung-bestaetigt",
    },
    "/pago-cancelado": {
      es: "/pago-cancelado",
      en: "/payment-cancelled",
      sv: "/betalning-avbruten",
      de: "/zahlung-abgebrochen",
    },
    "/privacidad": {
      es: "/politica-de-privacidad",
      en: "/privacy-policy",
      sv: "/integritetspolicy",
      de: "/datenschutz",
    },
    "/cookies": {
      es: "/politica-de-cookies",
      en: "/cookie-policy",
      sv: "/cookiepolicy",
      de: "/cookie-richtlinie",
    },
    "/aviso-legal": {
      es: "/aviso-legal",
      en: "/legal-notice",
      sv: "/juridisk-information",
      de: "/impressum",
    },
    "/terminos": {
      es: "/terminos-de-contratacion",
      en: "/terms",
      sv: "/villkor",
      de: "/agb",
    },
    "/ads/clase-de-prueba": {
      es: "/pilates-clasico-palma-clase-de-prueba",
      en: "/classical-pilates-palma-trial-class",
      sv: "/klassisk-pilates-palma-provlektion",
      de: "/klassisches-pilates-palma-probestunde",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
/** Rutas sin segmentos dinámicos, usables como href directo. */
export type StaticPathname = Exclude<AppPathname, "/blog/[slug]">;
export type Locale = (typeof routing.locales)[number];
