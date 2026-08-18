# Technical SEO

The foundation. If a search engine or AI bot can't crawl, render, and trust the page, no
amount of content or links will rank it. Work top-down: access → indexing → speed → stability.

## Table of contents
1. Crawlability & access
2. Indexing & canonicalization
3. XML sitemaps
4. robots.txt
5. Rendering (the JavaScript trap)
6. Core Web Vitals & site speed
7. HTTPS, mobile, and UX signals
8. International: hreflang
9. Common technical failures checklist

---

## 1. Crawlability & access

A bot must be able to reach the page and follow links to the rest of the site.

- Return `200 OK` for real pages; `301` for permanent redirects; `404`/`410` for gone pages.
  Avoid redirect chains (A→B→C) — collapse them to a single hop.
- Keep important pages within ~3 clicks of the homepage. Deep orphan pages get crawled rarely.
- Use a logical internal-linking structure with descriptive anchor text — it distributes
  authority ("link equity") and tells engines what a page is about.
- Check server logs (or Search Console's Crawl Stats) for crawl errors, soft-404s, and
  whether bots are wasting "crawl budget" on junk URLs (faceted filters, session IDs).

## 2. Indexing & canonicalization

Crawled ≠ indexed. Control what gets indexed and consolidate duplicates.

- `<link rel="canonical" href="https://…">` on every page, pointing to the preferred URL.
  Self-reference canonical on the canonical page. This consolidates duplicate/parameterized
  URLs into one ranking entity.
- Use `<meta name="robots" content="noindex,follow">` to keep thin/utility pages
  (internal search results, tag archives, cart) out of the index while still passing link flow.
- Pick one host convention and 301 the rest: `https://www.` vs `https://` (non-www), trailing
  slash vs not. Mixed versions split authority.
- Watch for accidental `noindex` (staging configs shipped to production) — a top cause of
  sudden traffic loss. The audit script flags robots meta directives.

## 3. XML sitemaps

- List only canonical, indexable, `200` URLs. Never include redirected, noindexed, or blocked
  URLs — that sends contradictory signals.
- Include `<lastmod>` with accurate dates; it helps engines prioritize recrawls of changed
  pages (important for freshness-sensitive AI visibility).
- Split into multiple sitemaps + a sitemap index if over 50,000 URLs or 50 MB.
- Reference it in robots.txt (`Sitemap: https://example.com/sitemap.xml`) and submit it in
  Google Search Console and Bing Webmaster Tools.

## 4. robots.txt

Lives at the domain root (`/robots.txt`). It controls *crawling*, not *indexing* — a blocked
page can still appear in results as a bare URL, so use `noindex` (not robots.txt) to remove
pages from the index.

- Block low-value crawl spaces (admin, internal search, infinite faceted URLs), not ranking
  pages.
- Never accidentally `Disallow: /` in production (another classic catastrophic mistake).
- For AI crawlers, decide per-bot. Allowing AI *search* bots is what enables AI citations;
  see `geo-aeo.md` for the full bot list and a ready template in `assets/robots.txt.example`.

## 5. Rendering (the JavaScript trap)

This is the highest-leverage technical issue for GEO and a frequent SEO issue too.

- Googlebot can render JavaScript, but it's slower and imperfect; **most AI bots do not
  execute JavaScript at all.** Content injected client-side after hydration is often invisible
  to them.
- Prefer **Server-Side Rendering (SSR)** or **Static Site Generation (SSG)** so the meaningful
  HTML — headings, body copy, links, structured data — is present in the initial response.
- Test: `curl -s https://example.com/page | grep "your key content"`. If your main content and
  meta tags aren't in the raw HTML, bots may not see them. The audit script estimates whether a
  page looks client-rendered.
- Don't hide primary content behind tabs, accordions, "load more", logins, or paywalls if you
  want it cited — put it in the initial DOM.

## 6. Core Web Vitals & site speed

Google measures these on **real users** (field data, CrUX), at the **75th percentile**. To
"pass", ≥75% of visits must be "good". Lab tools (Lighthouse/PageSpeed lab) estimate but don't
replace field data.

| Metric | Good | Needs work | Poor | Measures |
|--------|------|-----------|------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5–4s | > 4s | Loading — when the main element renders |
| **INP** (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms | Responsiveness to clicks/taps/keys |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 | Visual stability (unexpected movement) |

Fixes by metric:

- **LCP**: optimize the hero image (WebP/AVIF, correct dimensions), `fetchpriority="high"` and
  `<link rel="preload">` on it, cut render-blocking CSS/JS, improve TTFB (caching/CDN), and
  avoid loading the LCP element via JS.
- **INP**: break up long JavaScript tasks, defer/`async` non-critical JS, minimize main-thread
  work, avoid heavy third-party scripts, use web workers for expensive work.
- **CLS**: set explicit `width`/`height` (or `aspect-ratio`) on images/video/iframes/ads,
  reserve space for dynamically injected content (banners, cookie notices), and preload fonts
  with `font-display: optional|swap` to avoid layout jumps.

Speed is both a direct ranking factor and a conversion factor — improvements here often lift
revenue independent of rankings.

## 7. HTTPS, mobile, and UX signals

- **HTTPS** is a baseline trust requirement — serve every page over TLS and redirect HTTP→HTTPS.
- **Mobile-first indexing**: Google indexes the mobile version. It must contain the same content
  and structured data as desktop. Responsive design, legible font sizes, adequate tap targets.
- **No intrusive interstitials**: full-screen popups that block content on mobile hurt rankings.
- Accessibility overlaps with SEO: semantic HTML, alt text, and logical heading order help both
  screen readers and crawlers.

## 8. International: hreflang

For multi-region/multi-language sites, `hreflang` tells engines which URL to serve to which
audience and prevents same-language versions from cannibalizing each other.

```html
<link rel="alternate" hreflang="en" href="https://example.com/page" />
<link rel="alternate" hreflang="es" href="https://example.com/es/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

Rules: every version must list every version *including itself*; annotations must be reciprocal;
use ISO language (and optional region) codes; include an `x-default` fallback. Can also be
delivered via XML sitemap or HTTP headers. For an international-English site with future locale
plans, set this up early even if there's only one language today.

## 9. Common technical failures checklist

Run through these first — they cause the biggest, fastest damage:

- [ ] Accidental `noindex` or `Disallow: /` shipped to production
- [ ] Key content only rendered client-side (invisible to AI bots)
- [ ] No/incorrect canonical tags → duplicate content splitting authority
- [ ] Mixed www/non-www or http/https without redirects
- [ ] Redirect chains and loops
- [ ] Missing/outdated XML sitemap, or sitemap listing non-canonical URLs
- [ ] Slow LCP from unoptimized hero images
- [ ] Layout shift from images without dimensions
- [ ] Broken internal links / orphan pages
- [ ] Not verified in Google Search Console + Bing Webmaster Tools
