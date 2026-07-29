"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { track } from "@/lib/analytics";

const LABELS: Record<string, string> = {
  es: "Español",
  en: "English",
  sv: "Svenska",
  de: "Deutsch",
};

/**
 * Selector de idioma accesible (select nativo, sin banderas).
 * Conserva la ruta equivalente al cambiar de idioma.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  return (
    <label className="inline-flex items-center gap-1.5 text-sm">
      <span className="sr-only">{t("languageLabel")}</span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value;
          track("select_language", { language: next });
          router.replace(
            // @ts-expect-error los params dinámicos (slug) coinciden con la ruta actual
            { pathname, params },
            { locale: next as (typeof routing.locales)[number] },
          );
        }}
        className="rounded-sm border border-stone bg-ivory-soft px-2 py-1.5 text-sm uppercase"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
