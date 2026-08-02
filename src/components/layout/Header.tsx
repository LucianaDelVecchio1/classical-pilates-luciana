"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { Wordmark } from "@/components/brand/Wordmark";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { track } from "@/lib/analytics";

const NAV_ITEMS: { href: StaticPathname; key: string }[] = [
  { href: "/", key: "home" },
  { href: "/luciana", key: "luciana" },
  { href: "/metodo", key: "method" },
  { href: "/estudio", key: "studio" },
  { href: "/clase-de-prueba", key: "trial" },
  { href: "/blog", key: "blog" },
  { href: "/contacto", key: "contact" },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone/60 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" aria-label={t("homeAria")} onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <nav aria-label={t("mainNavAria")} className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`whitespace-nowrap text-[0.8rem] uppercase tracking-[0.1em] hover:text-sea-deep ${
                    pathname === item.href ? "text-sea-deep" : "text-char"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/clase-de-prueba"
            onClick={() => track("click_trial_cta", { origin: "header" })}
            className="hidden md:inline-block rounded-sm bg-sea-deep px-4 py-2.5 text-sm text-ivory-soft hover:bg-sea whitespace-nowrap"
          >
            {t("trialCta")}
          </Link>
          <button
            type="button"
            className="lg:hidden p-2"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-movil"
          aria-label={t("mainNavAria")}
          className="lg:hidden border-t border-stone/60 bg-ivory-soft"
        >
          <ul className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block py-2.5 text-base uppercase tracking-[0.1em] hover:text-sea-deep"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/clase-de-prueba"
                onClick={() => {
                  setOpen(false);
                  track("click_trial_cta", { origin: "mobile-menu" });
                }}
                className="block rounded-sm bg-sea-deep px-4 py-3 text-center text-ivory-soft"
              >
                {t("trialCta")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
