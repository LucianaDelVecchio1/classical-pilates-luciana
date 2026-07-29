import type { MetadataRoute } from "next";
import { routing, type StaticPathname } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { business } from "@/config/business";
import { getPostsForLocale } from "@/lib/blog";

/** Rutas indexables (se excluyen legales, pago y landing de Ads). */
const INDEXABLE: StaticPathname[] = [
  "/",
  "/luciana",
  "/metodo",
  "/estudio",
  "/sesiones",
  "/clase-de-prueba",
  "/faq",
  "/blog",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const href of INDEXABLE) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = business.url + getPathname({ locale, href });
    }
    languages["x-default"] =
      business.url + getPathname({ locale: routing.defaultLocale, href });

    entries.push({
      url: languages[routing.defaultLocale],
      changeFrequency: href === "/blog" ? "weekly" : "monthly",
      priority: href === "/" ? 1 : href === "/clase-de-prueba" ? 0.9 : 0.7,
      alternates: { languages },
    });
  }

  for (const locale of routing.locales) {
    for (const post of getPostsForLocale(locale)) {
      entries.push({
        url:
          business.url +
          getPathname({
            locale,
            href: { pathname: "/blog/[slug]", params: { slug: post.slug } },
          }),
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
