# Implementation: Next.js / React

Next.js is well-suited to SEO/GEO because it can server-render or statically generate HTML,
metadata, and structured data — so bots (including JS-blind AI crawlers) see real content.
The examples below use the **App Router** (`app/`); Pages Router equivalents are noted.

## The one thing that matters most: render on the server

AI crawlers and, to a lesser degree, search crawlers struggle with client-only content. Keep
content and metadata in **Server Components** (the default in `app/`) or use SSG/SSR. Avoid
putting primary content or meta tags behind `'use client'` + `useEffect` data fetching. If a
page must be interactive, render the core content on the server and hydrate the interactive
parts.

## Metadata (titles, descriptions, canonical, OG, hreflang)

Static, per-route:

```tsx
// app/pricing/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Plans & Costs | YourBrand',
  description: 'Transparent pricing for YourBrand. Compare plans, features, and costs. Free tier available; no credit card required.',
  alternates: {
    canonical: 'https://example.com/pricing',
    languages: { 'en': 'https://example.com/pricing', 'es': 'https://example.com/es/pricing', 'x-default': 'https://example.com/pricing' },
  },
  openGraph: {
    title: 'Pricing — Plans & Costs',
    description: 'Compare YourBrand plans and costs.',
    url: 'https://example.com/pricing',
    type: 'website',
    images: [{ url: 'https://example.com/og/pricing.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}
```

Dynamic, per data-driven route:

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: `${post.title} | YourBrand Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://example.com/blog/${post.slug}` },
    openGraph: { type: 'article', publishedTime: post.publishedAt, modifiedTime: post.updatedAt },
  }
}
```

Set a template + defaults once in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: { default: 'YourBrand — Tagline', template: '%s | YourBrand' },
  description: 'Default site description.',
}
```

*Pages Router*: use `next/head` with `<title>`, `<meta>`, `<link rel="canonical">` inside the
page component, or the `next-seo` package.

## Structured data (JSON-LD)

Render JSON-LD from a Server Component so it's in the initial HTML. See
`assets/jsonld-templates.md` for the object shapes.

```tsx
// app/blog/[slug]/page.tsx  (inside the component's returned JSX)
export default async function Post({ params }) {
  const post = await getPost(params.slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.authorName, url: post.authorUrl },
    image: post.coverImage,
    mainEntityOfPage: `https://example.com/blog/${post.slug}`,
  }
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>{/* … visible content that matches the markup … */}</article>
    </>
  )
}
```

Use a global `Organization` + `WebSite` block in `app/layout.tsx` the same way.

## Sitemap & robots (native, no plugin needed)

```ts
// app/sitemap.ts  →  serves /sitemap.xml
import type { MetadataRoute } from 'next'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const staticUrls = [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://example.com/pricing', lastModified: new Date(), priority: 0.8 },
  ]
  const postUrls = posts.map(p => ({
    url: `https://example.com/blog/${p.slug}`, lastModified: new Date(p.updatedAt), priority: 0.6,
  }))
  return [...staticUrls, ...postUrls]
}
```

```ts
// app/robots.ts  →  serves /robots.txt
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      // AI search/retrieval bots — allow so you can be cited:
      { userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-User', 'Googlebot', 'Bingbot'], allow: '/' },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

`llms.txt` isn't a native route: put a static `public/llms.txt` (served at `/llms.txt`) using
`assets/llms.txt.example`, or generate it in `app/llms.txt/route.ts` as a `text/plain` response.

## Core Web Vitals in Next.js

- Use `next/image` for automatic responsive sizing, lazy-loading, and modern formats. Mark the
  LCP image with `priority` so it preloads:

  ```tsx
  import Image from 'next/image'
  <Image src="/hero.jpg" alt="…" width={1200} height={630} priority />
  ```

- Use `next/font` to self-host fonts with zero layout shift (`display: 'swap'` or `'optional'`).
- Load third-party/non-critical scripts with `next/script` and `strategy="lazyOnload"` or
  `"afterInteractive"` to protect INP.
- Prefer Server Components and streaming to cut client JS (better INP/TBT). Keep `'use client'`
  boundaries small.
- Always set image/embed dimensions or `aspect-ratio` to keep CLS < 0.1.

## Rendering strategy quick guide

- Mostly-static pages (marketing, blog): **SSG** (`generateStaticParams` / static routes) +
  ISR (`export const revalidate = 3600`) for freshness without rebuilds.
- Personalized/frequently-changing data-driven pages: **SSR** (dynamic rendering) — still
  server-side, so bots get full HTML.
- Never rely on client-side fetching for content you need indexed or cited.

## Sanity check

```bash
# Confirm the crawler-visible HTML actually contains your content & metadata:
curl -s https://example.com/pricing | grep -i "<title>\|application/ld+json\|canonical"
```

If your title, JSON-LD, and canonical aren't in that raw output, fix rendering before anything
else.
