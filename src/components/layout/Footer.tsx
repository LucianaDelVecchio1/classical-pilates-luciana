"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { business } from "@/config/business";
import { Seal } from "@/components/brand/Wordmark";

const LEGAL_LINKS: { href: StaticPathname; key: string }[] = [
  { href: "/privacidad", key: "privacy" },
  { href: "/cookies", key: "cookies" },
  { href: "/aviso-legal", key: "legalNotice" },
  { href: "/terminos", key: "terms" },
];

const SITE_LINKS: { href: StaticPathname; key: string }[] = [
  { href: "/luciana", key: "luciana" },
  { href: "/metodo", key: "method" },
  { href: "/estudio", key: "studio" },
  { href: "/sesiones", key: "sessions" },
  { href: "/clase-de-prueba", key: "trial" },
  { href: "/faq", key: "faq" },
  { href: "/blog", key: "blog" },
  { href: "/contacto", key: "contact" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="mt-20 border-t border-stone/60 bg-sand/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <Seal size={56} className="text-char" />
          <p className="mt-4 font-display text-xl">{business.name}</p>
          <p className="mt-1 text-sm text-char-soft max-w-[36ch]">{t("descriptor")}</p>
          <p className="mt-4 text-sm italic text-sea-deep max-w-[40ch]">{t("closingQuote")}</p>
        </div>

        <nav aria-label={t("siteNavAria")}>
          <h2 className="text-xs uppercase tracking-[0.2em] text-char-soft">{t("explore")}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {SITE_LINKS.map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="text-sm hover:text-sea-deep">
                  {tn(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-char-soft">{t("contact")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`https://wa.me/${business.whatsappNumber.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sea-deep"
              >
                WhatsApp {business.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:text-sea-deep break-all">
                {business.email}
              </a>
            </li>
            <li>
              <a
                href={business.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sea-deep"
              >
                Instagram {business.instagram.handle}
              </a>
            </li>
            <li className="text-char-soft">{business.address.locality}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4 text-xs text-char-soft md:px-6">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          {LEGAL_LINKS.map((l) => (
            <Link key={l.key} href={l.href} className="hover:text-sea-deep">
              {t(l.key)}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("cpl-open-consent"))}
            className="hover:text-sea-deep underline-offset-2"
          >
            {t("cookieSettings")}
          </button>
        </div>
      </div>
    </footer>
  );
}
