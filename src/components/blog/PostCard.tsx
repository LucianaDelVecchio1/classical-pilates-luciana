import { useTranslations, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { Post } from "@/lib/blog";

export function PostCard({ post }: { post: Post }) {
  const t = useTranslations("blog");
  const format = useFormatter();

  return (
    <article className="group">
      <Link
        href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
        className="block"
      >
        <ImagePlaceholder
          name={post.image ? post.image.replace(/^\/images\//, "").replace(/\.\w+$/, "") : `blog-${post.slug}`}
          src={post.image}
          alt={post.imageAlt}
          ratio="landscape"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-sea-deep">
          {post.category}
        </p>
        <h3 className="mt-1 font-display text-xl leading-snug group-hover:text-sea-deep">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-char-soft">{post.excerpt}</p>
        <p className="mt-3 text-xs text-char-soft">
          {format.dateTime(new Date(post.date), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {t("readingTime", { minutes: post.readingMinutes })}
        </p>
      </Link>
    </article>
  );
}
