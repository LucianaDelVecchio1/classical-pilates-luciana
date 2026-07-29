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
  const t = await getTranslations({ locale, namespace: "studio" });
  return pageMetadata({
    locale,
    href: "/estudio",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("studio");
  const tn = await getTranslations("nav");
  const body = t.raw("body") as string[];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: tn("home"), href: "/" },
          { name: tn("studio"), href: "/estudio" },
        ])}
      />
      <Section>
        <SectionTitle title={t("title")} intro={t("intro")} />
        <div className="mt-8">
          <ImagePlaceholder
            name="studio-sea-view"
            alt={t("imageAlt")}
            ratio="hero"
            priority
            sizes="100vw"
          />
        </div>
        <div className="mt-10 max-w-prose space-y-5 leading-relaxed">
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <ImagePlaceholder name="studio-reformer" alt={t("reformerAlt")} ratio="square" />
          <ImagePlaceholder name="studio-barrel" alt={t("barrelAlt")} ratio="square" />
          <ImagePlaceholder name="studio-atmosphere" alt={t("atmosphereAlt")} ratio="square" />
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <TrackedLink
            href="/clase-de-prueba"
            event="click_trial_cta"
            origin="studio-page"
            className={ctaPrimaryCls}
          >
            {t("cta")}
          </TrackedLink>
          <WhatsAppLink origin="general" className={ctaSecondaryCls}>
            {t("ctaSecondary")}
          </WhatsAppLink>
        </div>
      </Section>
    </>
  );
}
