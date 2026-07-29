import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
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
  const t = await getTranslations({ locale, namespace: "luciana" });
  return pageMetadata({
    locale,
    href: "/luciana",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function LucianaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("luciana");
  const tn = await getTranslations("nav");
  const body = t.raw("body") as string[];

  return (
    <>
      <JsonLd
        data={[
          personSchema(),
          breadcrumbSchema(locale, [
            { name: tn("home"), href: "/" },
            { name: tn("luciana"), href: "/luciana" },
          ]),
        ]}
      />
      <Section>
        <div className="grid gap-12 md:grid-cols-[2fr_3fr] md:items-start">
          <div className="md:sticky md:top-24">
            <ImagePlaceholder name="luciana-portrait" alt={t("imageAlt")} ratio="portrait" priority />
          </div>
          <div>
            <SectionTitle title={t("title")} intro={t("intro")} />
            <div className="mt-8 max-w-prose space-y-5 leading-relaxed">
              {body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <TrackedLink
                href="/clase-de-prueba"
                event="click_trial_cta"
                origin="luciana-page"
                className={ctaPrimaryCls}
              >
                {t("cta")}
              </TrackedLink>
              <WhatsAppLink origin="general" className={ctaSecondaryCls}>
                {t("ctaSecondary")}
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </Section>
      <Section tone="sand">
        <ImagePlaceholder
          name="classical-pilates-session"
          alt={t("sessionImageAlt")}
          ratio="hero"
          sizes="100vw"
        />
      </Section>
    </>
  );
}
