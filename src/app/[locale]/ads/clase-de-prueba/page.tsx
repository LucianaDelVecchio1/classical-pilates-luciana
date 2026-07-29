import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { trialServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { FaqList } from "@/components/ui/FaqList";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaSecondaryCls } from "@/components/ui/TrackedLink";
import { CheckoutButton } from "@/components/trial/CheckoutButton";
import { TrialOfferTracker } from "@/components/trial/TrialOfferTracker";

/**
 * Landing reutilizable para Google Ads: navegación reducida (sin header),
 * propuesta clara, confianza, FAQ y CTA siempre visible.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ads" });
  return pageMetadata({
    locale,
    href: "/ads/clase-de-prueba",
    title: t("metaTitle"),
    description: t("metaDescription"),
    noIndex: true,
  });
}

export default async function AdsLandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ads");
  const tTrial = await getTranslations("trial");
  const tFaq = await getTranslations("faq");
  const bullets = t.raw("bullets") as string[];
  const faqItems = (
    tFaq.raw("items") as { question: string; answer: string }[]
  ).filter((_, i) => [1, 2, 6, 9].includes(i));

  return (
    <>
      <JsonLd data={trialServiceSchema(t("metaTitle"), t("metaDescription"))} />
      <TrialOfferTracker origin="ads-landing" />

      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl leading-tight md:text-5xl">{t("title")}</h1>
            <p className="mt-4 max-w-prose text-lg text-char-soft">{t("subtitle")}</p>
            <ul className="mt-6 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-3 h-px w-6 shrink-0 bg-sea-deep" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-4">
              <CheckoutButton origin="ads-landing" />
              <WhatsAppLink origin="trial" className={ctaSecondaryCls}>
                {t("ctaSecondary")}
              </WhatsAppLink>
            </div>
          </div>
          <ImagePlaceholder
            name="studio-sea-view"
            alt={tTrial("imageAlt")}
            ratio="portrait"
            priority
          />
        </div>
      </Section>

      <Section tone="sand">
        <div className="max-w-prose">
          <h2 className="font-display text-2xl">{t("trustTitle")}</h2>
          <p className="mt-2 text-char-soft">{t("trustText")}</p>
          <p className="mt-4 text-char-soft">{tTrial("paymentText")}</p>
        </div>
      </Section>

      {/* FAQPage schema no se emite aquí para evitar duplicidad con /faq */}
      <Section>
        <h2 className="font-display text-3xl">{tFaq("title")}</h2>
        <div className="mt-6 max-w-3xl">
          <FaqList items={faqItems} />
        </div>
        <div className="mt-10">
          <CheckoutButton origin="ads-landing-bottom" />
        </div>
      </Section>
    </>
  );
}
