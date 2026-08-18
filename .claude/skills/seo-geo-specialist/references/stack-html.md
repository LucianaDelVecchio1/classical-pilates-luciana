# Implementation: Custom HTML / CSS / JS & Static Sites

For hand-built sites and static-site generators (Astro, Eleventy, Hugo, Jekyll, plain HTML),
you control every tag directly. That's an advantage: you can ship perfectly clean, fast,
crawlable HTML. The trade-off is you must add everything yourself. This file is the checklist +
copy-paste boilerplate.

## The essential `<head>`

Put this on every page, customized per page. Everything a bot needs must be in the initial HTML.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Primary Topic — Secondary | YourBrand</title>
  <meta name="description" content="A compelling ~150-character summary that states the benefit and includes the query naturally.">
  <link rel="canonical" href="https://example.com/this-page">

  <!-- Open Graph / social -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Primary Topic — YourBrand">
  <meta property="og:description" content="Same or tailored summary.">
  <meta property="og:url" content="https://example.com/this-page">
  <meta property="og:image" content="https://example.com/og/this-page.png">
  <meta name="twitter:card" content="summary_large_image">

  <!-- hreflang (only if multi-language) -->
  <link rel="alternate" hreflang="en" href="https://example.com/this-page">
  <link rel="alternate" hreflang="es" href="https://example.com/es/this-page">
  <link rel="alternate" hreflang="x-default" href="https://example.com/this-page">

  <!-- Preload the LCP hero image for fast LCP -->
  <link rel="preload" as="image" href="/img/hero.avif" fetchpriority="high">

  <!-- JSON-LD structured data (see assets/jsonld-templates.md) -->
  <script type="application/ld+json">
  { "@context":"https://schema.org", "@type":"WebSite",
    "name":"YourBrand", "url":"https://example.com" }
  </script>
</head>
<body>
  <!-- Real, server-rendered content goes here — not injected later by JS -->
</body>
</html>
```

## Semantic HTML for structure

Use real semantic elements — they give crawlers and AI models clean structure for free:

```html
<header> … site nav … </header>
<main>
  <article>
    <h1>The single main topic of this page</h1>
    <p>Answer-first: state the core answer in 1–2 sentences.</p>
    <h2>How much does it cost?</h2>   <!-- question-based heading -->
    <p>Direct answer, then detail.</p>
    <ul> … discrete facts as a list … </ul>
    <table> … comparisons/specs … </table>
  </article>
  <aside> … related links … </aside>
</main>
<footer> … contact, about, policies (trust signals) … </footer>
```

One `<h1>`, logical `<h2>`/`<h3>` nesting, short paragraphs, and lists/tables for facts — this
is exactly the structure that wins featured snippets and AI citations.

## Images

```html
<img src="/img/solar-efficiency-chart.avif"
     alt="Bar chart comparing solar panel efficiency by brand, 2026"
     width="800" height="450" loading="lazy" decoding="async">
```

Descriptive filename + alt, explicit `width`/`height` (prevents CLS), modern format (AVIF/WebP),
`loading="lazy"` for below-the-fold — but **not** on the LCP/hero image (preload that instead).

## sitemap.xml (root)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/</loc><lastmod>2026-08-01</lastmod><priority>1.0</priority></url>
  <url><loc>https://example.com/pricing</loc><lastmod>2026-08-01</lastmod><priority>0.8</priority></url>
</urlset>
```

Static-site generators (Astro `@astrojs/sitemap`, Hugo/Jekyll/Eleventy plugins) generate this
automatically — enable it. Keep it canonical-only and submit it in Search Console + Bing.

## robots.txt and llms.txt (root)

Copy `assets/robots.txt.example` and `assets/llms.txt.example` into the site root and edit the
domain/URLs. Confirm they're served at `https://example.com/robots.txt` and `/llms.txt`
(text/plain / markdown, `200` status).

## If your site is JavaScript-heavy (SPA)

A client-rendered SPA (create-react-app, Vue/Angular SPA) is the worst case for GEO: AI bots
usually see an empty `<div id="root">`. Fix the rendering, don't patch around it:

- **Best**: migrate to or wrap with an SSR/SSG framework (Next.js, Nuxt, Astro, SvelteKit) so
  HTML is server-rendered. See `stack-nextjs.md`.
- **Or**: add a **prerendering** step (Prerender.io, `prerender-spa-plugin`, Puppeteer-based
  static export) that serves fully-rendered HTML snapshots to bots and crawlers.
- **Minimum**: ensure `<title>`, meta, canonical, and JSON-LD are in the static `index.html`
  even if the body hydrates — but body content that only appears after JS may still be missed.

Verify:

```bash
curl -s https://example.com/page | grep -i "<title>\|<h1\|application/ld+json"
```

If your visible content and metadata aren't in that raw HTML, an AI crawler probably can't see
them — that's the first thing to fix.

## Performance for hand-built sites

You have the most control here, so aim high:

- Inline critical CSS; defer the rest. `defer`/`async` all non-critical JS to protect INP.
- Self-host fonts; `font-display: swap`; preload the primary font file.
- Serve over HTTP/2+ from a CDN (Cloudflare, Netlify, Vercel, Fastly); enable Brotli/gzip.
- Cache aggressively with long `Cache-Control` on static assets + content hashing.
- Ship as little JS as possible — static sites can hit near-perfect Core Web Vitals easily.
