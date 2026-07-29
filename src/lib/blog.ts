import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Blog en MDX bajo content/blog/<locale>/<slug>.mdx.
 * Los artículos iniciales existen en español; los demás idiomas muestran
 * los artículos disponibles hasta que existan traducciones revisadas
 * (enlazadas mediante translationKey en el frontmatter).
 */

const frontmatterSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(20),
  author: z.string().default("Luciana"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  imageAlt: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().min(50).max(170),
  /** Clave compartida entre las traducciones del mismo artículo. */
  translationKey: z.string(),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;

export type Post = PostFrontmatter & {
  slug: string;
  locale: Locale;
  content: string;
  readingMinutes: number;
  headings: { depth: number; text: string; id: string }[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(content: string) {
  const headings: { depth: number; text: string; id: string }[] = [];
  for (const line of content.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (match) {
      const text = match[2].trim();
      headings.push({ depth: match[1].length, text, id: slugify(text) });
    }
  }
  return headings;
}

function readPost(locale: Locale, filePath: string): Post | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.error(`Frontmatter inválido en ${filePath}:`, parsed.error.message);
    return null;
  }
  if (parsed.data.draft && process.env.NODE_ENV === "production") return null;
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    ...parsed.data,
    slug: path.basename(filePath, ".mdx"),
    locale,
    content,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    headings: extractHeadings(content),
  };
}

export function getPostsForLocale(locale: Locale): Post[] {
  const dir = path.join(CONTENT_DIR, locale);
  const posts: Post[] = [];
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      const post = readPost(locale, path.join(dir, file));
      if (post) posts.push(post);
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Artículos a mostrar en un idioma: propios o, si no hay, los del idioma principal. */
export function getVisiblePosts(locale: Locale): Post[] {
  const own = getPostsForLocale(locale);
  if (own.length > 0 || locale === routing.defaultLocale) return own;
  return getPostsForLocale(routing.defaultLocale);
}

export function getPost(locale: Locale, slug: string): Post | null {
  for (const l of [locale, ...routing.locales.filter((x) => x !== locale)]) {
    const file = path.join(CONTENT_DIR, l, `${slug}.mdx`);
    if (fs.existsSync(file)) return readPost(l, file);
  }
  return null;
}

export function getAllSlugs(): { locale: Locale; slug: string }[] {
  const result: { locale: Locale; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const post of getPostsForLocale(locale)) {
      result.push({ locale, slug: post.slug });
    }
  }
  return result;
}
