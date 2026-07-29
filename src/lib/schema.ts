import { business } from "@/config/business";
import { getPathname } from "@/i18n/navigation";
import type { StaticPathname, Locale } from "@/i18n/routing";

/**
 * Builders de datos estructurados (JSON-LD).
 * Dirección y coordenadas solo se emiten cuando estén confirmadas
 * en business.address (ahora null → se omiten).
 */

export function localBusinessSchema(descriptor: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    "@id": `${business.url}/#business`,
    name: business.name,
    description: descriptor,
    url: business.url,
    email: business.email,
    telephone: business.whatsappNumber,
    sameAs: [business.instagram.url],
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
      ...(business.address.street ? { streetAddress: business.address.street } : {}),
      ...(business.address.postalCode
        ? { postalCode: business.address.postalCode }
        : {}),
    },
    ...(business.address.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: business.address.geo.lat,
            longitude: business.address.geo.lng,
          },
        }
      : {}),
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${business.url}/#luciana`,
    name: business.founder,
    jobTitle: "Classical Pilates Instructor",
    worksFor: { "@id": `${business.url}/#business` },
    sameAs: [business.instagram.url],
  };
}

export function trialServiceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@id": `${business.url}/#business` },
    areaServed: "Palma de Mallorca",
    offers: {
      "@type": "Offer",
      price: String(business.trialClass.priceEur),
      priceCurrency: business.trialClass.currency,
      availability: "https://schema.org/InStock",
    },
  };
}

/** SOLO usar en páginas donde las preguntas y respuestas sean visibles. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function breadcrumbSchema(
  locale: Locale,
  items: { name: string; href: StaticPathname }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: business.url + getPathname({ locale, href: item.href }),
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: post.url,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${business.url}/#business` },
    ...(post.image ? { image: post.image } : {}),
  };
}
