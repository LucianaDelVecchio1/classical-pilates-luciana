import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/ui/Section";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaPrimaryCls } from "@/components/ui/TrackedLink";
import { PurchaseTracker } from "@/components/trial/PurchaseTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "payment" });
  return pageMetadata({
    locale,
    href: "/pago-confirmado",
    title: t("successMetaTitle"),
    description: t("successMetaTitle"),
    noIndex: true,
  });
}

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { ref } = await searchParams;
  const t = await getTranslations("payment");
  // La referencia solo se muestra si tiene el formato esperado (sin datos sensibles).
  const reference = ref && /^[A-Z0-9-]{6,32}$/.test(ref) ? ref : null;

  return (
    <Section>
      <PurchaseTracker />
      <div className="mx-auto max-w-xl text-center">
        <SectionTitle title={t("successTitle")} align="center" />
        <p className="mt-6 text-char-soft">
          {reference ? t("successText") : t("successNoRef")}
        </p>
        {reference && (
          <p className="mt-3 rounded-sm border border-stone/60 bg-sand/40 px-4 py-3 font-mono text-lg tracking-wider">
            {reference}
          </p>
        )}
        <p className="mt-6 text-char-soft">{t("successNext")}</p>
        <WhatsAppLink
          origin="trial-purchased"
          reference={reference ?? undefined}
          className={`mt-8 ${ctaPrimaryCls}`}
        >
          {t("successCta")}
        </WhatsAppLink>
      </div>
    </Section>
  );
}
