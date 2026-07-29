import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section, SectionTitle } from "@/components/ui/Section";
import { ctaPrimaryCls } from "@/components/ui/TrackedLink";

export default function NotFoundPage() {
  const t = useTranslations("notFound");
  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <p aria-hidden="true" className="font-display text-7xl text-stone">
          404
        </p>
        <SectionTitle title={t("title")} align="center" />
        <p className="mt-4 text-char-soft">{t("text")}</p>
        <Link href="/" className={`mt-8 ${ctaPrimaryCls}`}>
          {t("cta")}
        </Link>
      </div>
    </Section>
  );
}
