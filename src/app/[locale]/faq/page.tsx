import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionTitle } from "@/components/ui/Section";
import { FaqList } from "@/components/ui/FaqList";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { TrackedLink, ctaPrimaryCls, ctaSecondaryCls } from "@/components/ui/TrackedLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return pageMetadata({
    locale,
    href: "/faq",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const tn = await getTranslations("nav");
  const th = await getTranslations("home.trial");
  const items = t.raw("items") as { question: string; answer: string }[];

  return (
    <>
      {/* FAQPage schema: válido aquí porque las Q&A son visibles en esta página */}
      <JsonLd
        data={[
          faqSchema(items),
          breadcrumbSchema(locale, [
            { name: tn("home"), href: "/" },
            { name: tn("faq"), href: "/faq" },
          ]),
        ]}
      />
      <Section>
        <SectionTitle title={t("title")} intro={t("intro")} />
        <div className="mt-10 max-w-3xl">
          <FaqList items={items} />
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <TrackedLink
            href="/clase-de-prueba"
            event="click_trial_cta"
            origin="faq-page"
            className={ctaPrimaryCls}
          >
            {th("cta")}
          </TrackedLink>
          <WhatsAppLink origin="general" className={ctaSecondaryCls}>
            {th("ctaSecondary")}
          </WhatsAppLink>
        </div>
      </Section>
    </>
  );
}
