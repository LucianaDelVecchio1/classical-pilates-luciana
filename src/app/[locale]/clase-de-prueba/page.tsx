import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, trialServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionTitle } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaSecondaryCls } from "@/components/ui/TrackedLink";
import { CheckoutButton } from "@/components/trial/CheckoutButton";
import { TrialOfferTracker } from "@/components/trial/TrialOfferTracker";
import { BookingCalendarSlot } from "@/components/trial/BookingCalendarSlot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trial" });
  return pageMetadata({
    locale,
    href: "/clase-de-prueba",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function TrialPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trial");
  const tn = await getTranslations("nav");
  const includes = t.raw("includes") as string[];
  const forWho = t.raw("forWho") as string[];

  return (
    <>
      <JsonLd
        data={[
          trialServiceSchema(t("metaTitle"), t("metaDescription")),
          breadcrumbSchema(locale, [
            { name: tn("home"), href: "/" },
            { name: tn("trial"), href: "/clase-de-prueba" },
          ]),
        ]}
      />
      <TrialOfferTracker origin="trial-page" />

      <Section>
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <SectionTitle title={t("title")} intro={t("intro")} />
            <p className="mt-6 font-display text-6xl text-sea-deep">{t("price")}</p>
            <p className="mt-2 text-sm text-char-soft">{t("durationNote")}</p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <CheckoutButton origin="trial-page" />
              <WhatsAppLink origin="trial" className={ctaSecondaryCls}>
                {t("ctaSecondary")}
              </WhatsAppLink>
            </div>
          </div>
          <ImagePlaceholder
            name="classical-pilates-session"
            alt={t("imageAlt")}
            ratio="portrait"
            priority
          />
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">{t("includesTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-3 h-px w-6 shrink-0 bg-sea-deep" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl">{t("forWhoTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {forWho.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-3 h-px w-6 shrink-0 bg-olive" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-prose">
          <h2 className="font-display text-2xl">{t("paymentTitle")}</h2>
          <p className="mt-3 leading-relaxed text-char-soft">{t("paymentText")}</p>
        </div>
        <BookingCalendarSlot />
      </Section>
    </>
  );
}
