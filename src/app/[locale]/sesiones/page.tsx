import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionTitle } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { TrackedLink, ctaPrimaryCls, ctaSecondaryCls } from "@/components/ui/TrackedLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sessions" });
  return pageMetadata({
    locale,
    href: "/sesiones",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sessions");
  const tn = await getTranslations("nav");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: tn("home"), href: "/" },
          { name: tn("sessions"), href: "/sesiones" },
        ])}
      />
      <Section>
        <SectionTitle title={t("title")} intro={t("intro")} />
        <div className="mt-8">
          <ImagePlaceholder
            name="classical-pilates-session"
            alt={t("imageAlt")}
            ratio="hero"
            priority
            sizes="100vw"
          />
        </div>

        {/* Sin precios públicos: solo el de la clase de prueba puede aparecer en la web */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-sm border border-stone/60 bg-ivory-soft p-8">
            <h2 className="font-display text-2xl">{t("private.title")}</h2>
            <p className="mt-3 leading-relaxed text-char-soft">{t("private.text")}</p>
            <WhatsAppLink origin="private" className={`mt-6 ${ctaSecondaryCls}`}>
              {t("ctaPrivate")}
            </WhatsAppLink>
          </div>
          <div className="rounded-sm border border-stone/60 bg-ivory-soft p-8">
            <h2 className="font-display text-2xl">{t("duo.title")}</h2>
            <p className="mt-3 leading-relaxed text-char-soft">{t("duo.text")}</p>
            <WhatsAppLink origin="duo" className={`mt-6 ${ctaSecondaryCls}`}>
              {t("ctaDuo")}
            </WhatsAppLink>
          </div>
        </div>

        <p className="mt-8 max-w-prose text-sm text-char-soft">{t("durationNote")}</p>
        <p className="mt-2 max-w-prose text-char-soft">{t("pricingNote")}</p>
        <WhatsAppLink origin="pricing" className={`mt-6 ${ctaPrimaryCls}`}>
          {t("ctaPricing")}
        </WhatsAppLink>
      </Section>

      <Section tone="sea">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl">{t("trialTitle")}</h2>
          <p className="mt-3 text-ivory/90">{t("trialText")}</p>
          <TrackedLink
            href="/clase-de-prueba"
            event="click_trial_cta"
            origin="sessions-page"
            className="mt-6 inline-block rounded-sm bg-ivory-soft px-6 py-3.5 text-char hover:bg-sand"
          >
            {t("trialCta")}
          </TrackedLink>
        </div>
      </Section>
    </>
  );
}
