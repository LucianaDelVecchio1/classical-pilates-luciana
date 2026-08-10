import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";
import { localBusinessSchema, personSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionTitle } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { HeroVideo } from "@/components/ui/HeroVideo";
import { FaqList } from "@/components/ui/FaqList";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import {
  TrackedLink,
  ctaPrimaryCls,
  ctaSecondaryCls,
  ctaOnDarkCls,
  ctaOutlineOnDarkCls,
} from "@/components/ui/TrackedLink";
import { getVisiblePosts } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    href: "/",
    title: `${business.name} — ${t("descriptor")}`,
    description: t("description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tFaq = await getTranslations("faq");
  const tMeta = await getTranslations("meta");

  const faqItems = (
    tFaq.raw("items") as { question: string; answer: string }[]
  ).slice(0, 5);
  const posts = getVisiblePosts(locale).slice(0, 3);
  const valueItems = t.raw("value.items") as { title: string; text: string }[];
  const benefits = t.raw("benefits.items") as string[];

  return (
    <>
      <JsonLd data={[localBusinessSchema(tMeta("descriptor")), personSchema()]} />

      {/* Hero: el vídeo del estudio como gran protagonista */}
      <section className="relative flex min-h-[88svh] items-end">
        <HeroVideo />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 md:px-6 md:pb-24 fade-in-up">
          <h1 className="max-w-3xl font-display text-4xl leading-tight text-ivory-soft md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-prose text-lg text-ivory/90">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <TrackedLink
              href="/clase-de-prueba"
              event="click_trial_cta"
              origin="home-hero"
              className={ctaOnDarkCls}
            >
              {t("hero.ctaPrimary")}
            </TrackedLink>
            <WhatsAppLink origin="general" className={ctaOutlineOnDarkCls}>
              {t("hero.ctaSecondary")}
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* Propuesta de valor */}
      <Section tone="sand">
        <SectionTitle eyebrow={t("value.eyebrow")} title={t("value.title")} />
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {valueItems.map((item) => (
            <li key={item.title}>
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-char-soft">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Sobre Luciana */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ImagePlaceholder name="luciana-portrait" alt={t("about.imageAlt")} ratio="portrait" />
          <div>
            <SectionTitle
              eyebrow={t("about.eyebrow")}
              title={t("about.title")}
              intro={t("about.text")}
            />
            <Link href="/luciana" className={`mt-6 ${ctaSecondaryCls}`}>
              {t("about.cta")}
            </Link>
          </div>
        </div>
      </Section>

      {/* El Método */}
      <Section tone="sand">
        <SectionTitle
          eyebrow={t("method.eyebrow")}
          title={t("method.title")}
          intro={t("method.text")}
        />
        <Link href="/metodo" className={`mt-6 ${ctaSecondaryCls}`}>
          {t("method.cta")}
        </Link>
      </Section>

      {/* El estudio */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="md:order-2">
            <ImagePlaceholder name="studio-sea-view" alt={t("studio.imageAlt")} />
          </div>
          <div className="md:order-1">
            <SectionTitle
              eyebrow={t("studio.eyebrow")}
              title={t("studio.title")}
              intro={t("studio.text")}
            />
            <Link href="/estudio" className={`mt-6 ${ctaSecondaryCls}`}>
              {t("studio.cta")}
            </Link>
          </div>
        </div>
      </Section>

      {/* Sesiones */}
      <Section tone="sand">
        <SectionTitle
          eyebrow={t("sessions.eyebrow")}
          title={t("sessions.title")}
          intro={t("sessions.text")}
        />
        <WhatsAppLink origin="pricing" className={`mt-6 ${ctaSecondaryCls}`}>
          {t("sessions.cta")}
        </WhatsAppLink>
      </Section>

      {/* Beneficios */}
      <Section>
        <SectionTitle eyebrow={t("benefits.eyebrow")} title={t("benefits.title")} />
        <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-6 shrink-0 bg-sea-deep" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Clase de prueba */}
      <Section tone="sea">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-sand">{t("trial.eyebrow")}</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">{t("trial.title")}</h2>
          <p className="mt-3 leading-relaxed text-ivory/90">{t("trial.text")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <TrackedLink
              href="/clase-de-prueba"
              event="click_trial_cta"
              origin="home-trial-block"
              className={ctaOnDarkCls}
            >
              {t("trial.cta")}
            </TrackedLink>
            <WhatsAppLink origin="trial" className={ctaOutlineOnDarkCls}>
              {t("trial.ctaSecondary")}
            </WhatsAppLink>
          </div>
        </div>
      </Section>

      {/*
        Testimonios: componente pendiente de reseñas auténticas y autorización.
        No se renderiza nada hasta entonces (no inventar testimonios).
        Cuando existan, crear src/components/ui/Testimonials.tsx y añadirlo aquí.
      */}

      {/* FAQ resumida — schema FAQPage solo en la página completa de FAQ */}
      <Section>
        <SectionTitle eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        <div className="mt-8 max-w-3xl">
          <FaqList items={faqItems} />
          <Link href="/faq" className="mt-6 inline-block text-sea-deep underline underline-offset-4">
            {t("faq.cta")}
          </Link>
        </div>
      </Section>

      {/* Blog */}
      {posts.length > 0 && (
        <Section tone="sand">
          <SectionTitle eyebrow={t("blog.eyebrow")} title={t("blog.title")} />
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Link href="/blog" className="mt-8 inline-block text-sea-deep underline underline-offset-4">
            {t("blog.cta")}
          </Link>
        </Section>
      )}

      {/* Cierre */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl italic leading-relaxed text-sea-deep md:text-3xl">
            «{t("closing.quote")}»
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <TrackedLink
              href="/clase-de-prueba"
              event="click_trial_cta"
              origin="home-closing"
              className={ctaPrimaryCls}
            >
              {t("closing.cta")}
            </TrackedLink>
            <WhatsAppLink origin="general" className={ctaSecondaryCls}>
              {t("closing.ctaSecondary")}
            </WhatsAppLink>
          </div>
        </div>
      </Section>
    </>
  );
}
