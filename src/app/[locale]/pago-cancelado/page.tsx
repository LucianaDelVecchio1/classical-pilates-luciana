import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/ui/Section";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaPrimaryCls, ctaSecondaryCls } from "@/components/ui/TrackedLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "payment" });
  return pageMetadata({
    locale,
    href: "/pago-cancelado",
    title: t("cancelMetaTitle"),
    description: t("cancelMetaTitle"),
    noIndex: true,
  });
}

export default async function PaymentCancelledPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("payment");

  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <SectionTitle title={t("cancelTitle")} align="center" />
        <p className="mt-6 text-char-soft">{t("cancelText")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/clase-de-prueba" className={ctaPrimaryCls}>
            {t("cancelCta")}
          </Link>
          <WhatsAppLink origin="trial" className={ctaSecondaryCls}>
            {t("cancelCtaSecondary")}
          </WhatsAppLink>
        </div>
      </div>
    </Section>
  );
}
