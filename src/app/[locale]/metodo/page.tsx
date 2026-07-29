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
  const t = await getTranslations({ locale, namespace: "method" });
  return pageMetadata({
    locale,
    href: "/metodo",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function MethodPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("method");
  const tn = await getTranslations("nav");
  const sections = t.raw("sections") as { title: string; text: string }[];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: tn("home"), href: "/" },
          { name: tn("method"), href: "/metodo" },
        ])}
      />
      <Section>
        <SectionTitle title={t("title")} intro={t("intro")} />
        <div className="mt-8">
          <ImagePlaceholder
            name="movement-detail"
            alt={t("imageAlt")}
            ratio="hero"
            priority
            sizes="100vw"
          />
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {sections.map((s) => (
            <div key={s.title} className="max-w-prose">
              <h2 className="font-display text-2xl">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-char-soft">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <TrackedLink
            href="/clase-de-prueba"
            event="click_trial_cta"
            origin="method-page"
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
