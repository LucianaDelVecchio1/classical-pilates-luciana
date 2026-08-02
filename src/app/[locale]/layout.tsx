import type { Metadata } from "next";
import { Cormorant_Garamond, Karla, Great_Vibes } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { business } from "@/config/business";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { AnalyticsScripts } from "@/components/consent/AnalyticsScripts";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-karla",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(business.url),
    title: {
      default: `${business.name} — ${t("descriptor")}`,
      template: `%s — ${business.name}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "a11y" });

  return (
    <html lang={locale} className={`${cormorant.variable} ${karla.variable} ${greatVibes.variable}`}>
      <body className="min-h-dvh flex flex-col pb-16 md:pb-0">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory-soft focus:px-4 focus:py-2 focus:text-char"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <Header />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileBar />
          <ConsentBanner />
          <AnalyticsScripts />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
