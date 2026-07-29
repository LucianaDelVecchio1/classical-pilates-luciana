import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { business } from "@/config/business";
import { buildAlternates } from "@/lib/seo";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ReadTracker } from "@/components/blog/ReadTracker";
import { getAllSlugs, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};
  const href = { pathname: "/blog/[slug]" as const, params: { slug } };
  const alternates = buildAlternates(locale, href);
  const title = post.metaTitle ?? post.title;
  return {
    title,
    description: post.metaDescription,
    alternates,
    openGraph: {
      title,
      description: post.metaDescription,
      url: alternates.canonical,
      siteName: business.name,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
    },
    twitter: { card: "summary_large_image", title, description: post.metaDescription },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const tn = await getTranslations("nav");
  const format = await getFormatter();
  const url =
    business.url +
    getPathname({ locale, href: { pathname: "/blog/[slug]", params: { slug } } });

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema({
            title: post.title,
            description: post.metaDescription,
            url,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            author: post.author,
            image: post.image ? business.url + post.image : undefined,
          }),
          breadcrumbSchema(locale, [
            { name: tn("home"), href: "/" },
            { name: tn("blog"), href: "/blog" },
          ]),
        ]}
      />
      <ReadTracker slug={post.slug} category={post.category} />

      <Section>
        <article className="mx-auto max-w-3xl">
          <header>
            <p className="text-xs uppercase tracking-[0.2em] text-sea-deep">{post.category}</p>
            <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-char-soft">
              {t("byAuthor", { author: post.author })}
              {" · "}
              {t("publishedOn", {
                date: format.dateTime(new Date(post.date), {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              })}
              {post.updated && (
                <>
                  {" · "}
                  {t("updatedOn", {
                    date: format.dateTime(new Date(post.updated), {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                  })}
                </>
              )}
              {" · "}
              {t("readingTime", { minutes: post.readingMinutes })}
            </p>
          </header>

          <div className="mt-8">
            <ImagePlaceholder
              name={post.image ? post.image.replace(/^\/images\//, "").replace(/\.\w+$/, "") : `blog-${post.slug}`}
              src={post.image}
              alt={post.imageAlt}
              ratio="landscape"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          {post.headings.length >= 3 && (
            <nav
              aria-label={t("tocTitle")}
              className="mt-8 rounded-sm border border-stone/60 bg-sand/30 p-5"
            >
              <h2 className="text-xs uppercase tracking-[0.2em] text-char-soft">
                {t("tocTitle")}
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                {post.headings.map((h) => (
                  <li key={h.id} className={h.depth === 3 ? "pl-4" : ""}>
                    <a href={`#${h.id}`} className="hover:text-sea-deep">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="prose-custom mt-10">
            <MDXRemote
              source={post.content}
              components={{
                h2: (props) => (
                  <h2
                    id={slugifyHeading(String(props.children))}
                    className="mt-10 font-display text-2xl md:text-3xl"
                    {...props}
                  />
                ),
                h3: (props) => (
                  <h3
                    id={slugifyHeading(String(props.children))}
                    className="mt-8 font-display text-xl md:text-2xl"
                    {...props}
                  />
                ),
                p: (props) => (
                  <p className="mt-4 leading-relaxed text-char" {...props} />
                ),
                ul: (props) => (
                  <ul className="mt-4 list-disc space-y-1.5 pl-6" {...props} />
                ),
                ol: (props) => (
                  <ol className="mt-4 list-decimal space-y-1.5 pl-6" {...props} />
                ),
                a: (props) => (
                  <a className="text-sea-deep underline underline-offset-4" {...props} />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="mt-6 border-l-2 border-sea-deep pl-5 font-display text-xl italic text-sea-deep"
                    {...props}
                  />
                ),
              }}
            />
          </div>

          <aside className="mt-14 rounded-sm bg-sea-deep p-8 text-ivory-soft">
            <p className="font-display text-2xl">{t("relatedCta")}</p>
            <div className="mt-5 flex flex-wrap gap-4">
              <TrackedLink
                href="/clase-de-prueba"
                event="click_trial_cta"
                origin={`blog-${post.slug}`}
                className="inline-block rounded-sm bg-ivory-soft px-6 py-3.5 text-char hover:bg-sand text-center"
              >
                {t("relatedCtaButton")}
              </TrackedLink>
              <WhatsAppLink
                origin="blog"
                className="inline-block rounded-sm border border-ivory-soft px-6 py-3.5 text-ivory-soft hover:bg-sea text-center"
              >
                {t("relatedCtaWhatsApp")}
              </WhatsAppLink>
            </div>
          </aside>
        </article>
      </Section>
    </>
  );
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
