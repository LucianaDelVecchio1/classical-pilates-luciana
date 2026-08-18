# Implementation: WordPress / WooCommerce

WordPress serves server-rendered HTML by default, so the rendering trap is usually a non-issue —
the work is configuration, an SEO plugin, clean theme markup, and performance. WooCommerce adds
product/catalog specifics.

## 1. Pick and configure one SEO plugin

Use **one** (never two — they conflict): **Yoast SEO**, **Rank Math**, or **The SEO Framework**.
They manage titles, meta descriptions, canonicals, sitemaps, robots meta, Open Graph, breadcrumbs,
and most structured data. Rank Math and Yoast are the most full-featured; The SEO Framework is
lighter.

Baseline setup after install:

- **Titles & Meta**: set brand-suffix templates (e.g. `%%title%% %%sep%% %%sitename%%`). Write
  custom titles/descriptions on key pages rather than relying on defaults.
- **Search appearance**: `noindex` thin archives you don't need (tag, author, date, media
  attachment pages). Keep category archives if they're useful landing pages.
- **XML sitemap**: enable the plugin's sitemap (`/sitemap_index.xml` for Yoast,
  `/sitemap_index.xml` for Rank Math), then submit it in Search Console + Bing.
- **Schema**: enable Organization/Website schema in the plugin's settings and set the logo,
  social profiles (`sameAs`), and default article/person types.
- **Breadcrumbs**: enable and add the plugin's breadcrumb function to the theme for
  `BreadcrumbList` schema + better UX.
- **Permalinks**: Settings → Permalinks → "Post name" (`/%postname%/`). Avoid `?p=123` URLs.

## 2. robots.txt, hreflang, llms.txt

- **robots.txt**: WordPress serves a virtual one; edit it via your SEO plugin (Yoast: Tools →
  File editor; Rank Math: General Settings → Edit robots.txt) or a real file in the web root.
  Use `assets/robots.txt.example` — block `/wp-admin/` (but allow `/wp-admin/admin-ajax.php`),
  keep the sitemap line, and allow AI search bots.
- **hreflang / multilingual**: use **Polylang** or **WPML**; both emit correct hreflang. Don't
  hand-roll it.
- **llms.txt**: WordPress won't serve an arbitrary root file by default. Either drop a real
  `llms.txt` in the site root via SFTP/hosting file manager, use a plugin that adds it, or add a
  rewrite. Base it on `assets/llms.txt.example`.

## 3. Structured data beyond the plugin defaults

The SEO plugins output Article/Product/Breadcrumb schema automatically. For extra types (FAQ,
HowTo, Review, LocalBusiness, Event) use the plugin's schema blocks (Rank Math and Yoast both
ship Gutenberg schema/FAQ blocks) or a dedicated plugin like **Schema Pro**. Add FAQ blocks to
pages with genuine Q&A — great for GEO. Validate every template with the Rich Results Test.

To add custom JSON-LD without a plugin, hook into `wp_head`:

```php
// functions.php (child theme) — inject Organization schema site-wide
add_action('wp_head', function () {
  if (!is_front_page()) return;
  $data = [
    '@context' => 'https://schema.org',
    '@type'    => 'Organization',
    'name'     => 'YourBrand',
    'url'      => home_url('/'),
    'logo'     => 'https://example.com/logo.png',
    'sameAs'   => ['https://www.linkedin.com/company/yourbrand', 'https://x.com/yourbrand'],
  ];
  echo '<script type="application/ld+json">' . wp_json_encode($data) . '</script>' . "\n";
});
```

## 4. Core Web Vitals on WordPress

WordPress + page builders can get heavy. Priorities:

- **Caching + optimization plugin**: WP Rocket (paid) or LiteSpeed Cache / W3 Total Cache /
  FlyingPress. Enable page caching, minify/combine where safe, and defer non-critical JS.
- **Images**: an image plugin (ShortPixel, Imagify, EWWW) to compress and serve WebP/AVIF;
  ensure images have width/height; lazy-load below-the-fold (WP core does this, but don't
  lazy-load the LCP/hero image).
- **Preload the LCP image** and add `fetchpriority="high"` (many optimization plugins have a
  toggle for this).
- **Fonts**: host Google Fonts locally (several plugins do this) to cut third-party requests and
  layout shift.
- **Trim plugins**: each active plugin can add CSS/JS. Audit and remove unused ones — the
  single biggest WP speed win is often deleting bloat.
- **Good hosting**: managed WP hosts (Kinsta, WP Engine, SiteGround, Cloudways) with a CDN
  improve TTFB → LCP. Add Cloudflare in front.
- Measure with PageSpeed Insights (field data) after changes; theme/builder choice matters
  (lightweight themes like GeneratePress/Kadence/Blocksy beat heavy multipurpose themes).

## 5. WooCommerce specifics

- **Product schema**: WooCommerce + Yoast/Rank Math emits `Product` + `Offer` +
  `AggregateRating`/`Review` from real product data and reviews. Enable it; keep prices,
  availability, SKU, and GTIN accurate — these show as rich results and are exactly what AI
  shopping answers extract.
- **Reviews**: enable and encourage genuine product reviews — real `AggregateRating` earns stars
  and trust. Never fake them (policy violation + risk).
- **Category/shop pages**: give them unique intro copy and titles so they can rank for
  commercial queries, not just individual products.
- **Faceted navigation**: filter/sort URLs (`?orderby=`, `?filter_`) can explode crawl budget
  and create duplicates. `noindex` or canonicalize filtered views, and disallow obvious
  parameter traps in robots.txt.
- **Performance**: WooCommerce is heavier — exclude cart/checkout/my-account from full-page
  caching, and keep those pages `noindex`.

## Sanity check

- View source on a live product/post and confirm `<title>`, canonical, and `application/ld+json`
  are present and correct.
- Run the audit script against a few URLs: `python scripts/seo_audit.py https://example.com/shop`.
- Confirm only one SEO plugin is active and it owns the sitemap and canonicals.
