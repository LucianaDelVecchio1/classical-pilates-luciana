import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionTitle } from "@/components/ui/Section";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaPrimaryCls } from "@/components/ui/TrackedLink";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactViewTracker } from "@/components/contact/ContactViewTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    locale,
    href: "/contacto",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tn = await getTranslations("nav");
  const tMeta = await getTranslations("meta");

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema(tMeta("descriptor")),
          breadcrumbSchema(locale, [
            { name: tn("home"), href: "/" },
            { name: tn("contact"), href: "/contacto" },
          ]),
        ]}
      />
      <ContactViewTracker />
      <Section>
        <SectionTitle title={t("title")} intro={t("intro")} />
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <div>
            <div className="rounded-sm border border-stone/60 bg-sand/30 p-8">
              <h2 className="font-display text-2xl">{t("whatsappTitle")}</h2>
              <p className="mt-2 text-char-soft">{t("whatsappText")}</p>
              <WhatsAppLink origin="general" className={`mt-5 ${ctaPrimaryCls}`}>
                {t("whatsappCta")}
              </WhatsAppLink>
              <ul className="mt-6 space-y-1.5 text-sm text-char-soft">
                <li>{business.whatsappDisplay}</li>
                <li className="break-all">{business.email}</li>
                <li>Instagram {business.instagram.handle}</li>
                <li>{business.address.locality}</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="sr-only">{t("form.title")}</h2>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
