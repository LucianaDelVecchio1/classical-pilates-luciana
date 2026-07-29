import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionTitle } from "@/components/ui/Section";
import { PostCard } from "@/components/blog/PostCard";
import { getVisiblePosts } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata({
    locale,
    href: "/blog",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tn = await getTranslations("nav");
  const posts = getVisiblePosts(locale);
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: tn("home"), href: "/" },
          { name: tn("blog"), href: "/blog" },
        ])}
      />
      <Section>
        <SectionTitle title={t("title")} intro={t("intro")} />
        {categories.length > 1 && (
          <p className="mt-6 text-sm text-char-soft">
            <span className="uppercase tracking-[0.15em] text-xs">{t("categoriesTitle")}: </span>
            {categories.join(" · ")}
          </p>
        )}
        {posts.length === 0 ? (
          <p className="mt-10 text-char-soft">{t("emptyState")}</p>
        ) : (
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
