import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type StaticPathname, type Locale } from "@/i18n/routing";
import { business } from "@/config/business";

type Href =
  | StaticPathname
  | { pathname: "/blog/[slug]"; params: { slug: string } };

/**
 * Construye metadatos con canonical, hreflang alternates y x-default
 * para una ruta localizada.
 */
export function buildAlternates(locale: Locale, href: Href) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = business.url + getPathname({ locale: l, href });
  }
  languages["x-default"] =
    business.url + getPathname({ locale: routing.defaultLocale, href });

  return {
    canonical: business.url + getPathname({ locale, href }),
    languages,
  };
}

export function pageMetadata({
  locale,
  href,
  title,
  description,
  noIndex = false,
}: {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
  noIndex?: boolean;
}): Metadata {
  const alternates = buildAlternates(locale, href);
  return {
    title,
    description,
    alternates,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: business.name,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
