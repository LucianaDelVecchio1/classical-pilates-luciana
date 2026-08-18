# Structured Data (Schema.org / JSON-LD)

Structured data is machine-readable markup that describes what a page *is* and what entities it
contains. It powers rich results in search (stars, FAQs, prices, breadcrumbs) and is one of the
clearest signals AI engines use to extract facts accurately. It rarely hurts and often helps —
add it to every page type that has a matching schema.

Ready-to-edit snippets live in `assets/jsonld-templates.md`. This file explains *what to use
when* and the rules that keep markup valid.

## Format: always JSON-LD

Google recommends **JSON-LD** in a `<script type="application/ld+json">` block, placed in the
`<head>` or `<body>`. It's decoupled from the visible HTML, easy to template, and easy to
maintain. Prefer it over Microdata/RDFa.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "…",
  "author": {"@type": "Person", "name": "…"},
  "datePublished": "2026-01-15",
  "dateModified": "2026-08-01"
}
</script>
```

## The cardinal rule

**Only mark up content that is actually visible on the page, and describe it truthfully.**
Marking up content the user can't see, faking reviews/ratings, or mismatching markup and page
content violates Google's structured-data policies and can trigger manual actions. Structured
data amplifies the truth of the page; it can't invent it.

## Which type for which page

| Page / content | Primary schema type | Why |
|----------------|--------------------|-----|
| Blog post / news / guide | `Article` / `BlogPosting` / `NewsArticle` | Author, dates, headline → E-E-A-T + freshness |
| Product page | `Product` + `Offer` (+ `AggregateRating`, `Review`) | Price, availability, ratings in results |
| FAQ section | `FAQPage` | Q&A pairs; directly reusable by AI answers |
| Step-by-step tutorial | `HowTo` | Steps, tools, time |
| Any page (nav context) | `BreadcrumbList` | Breadcrumb rich result; site structure |
| Company/site identity | `Organization` (+ `logo`, `sameAs`) | Establishes the brand entity for AI + Knowledge Panel |
| Personal/author identity | `Person` (+ `sameAs`, `jobTitle`) | Ties authorship to a real, credentialed entity |
| Local business | `LocalBusiness` (+ `address`, `geo`, `openingHours`) | Local pack, maps, "near me" |
| Reviews / ratings | `Review`, `AggregateRating` | Star rich results (only for real reviews) |
| Site search box | `WebSite` + `SearchAction` | Sitelinks search box |
| Events | `Event` | Date/venue/ticket rich results |
| Recipes | `Recipe` | Ingredients, time, ratings |
| Videos | `VideoObject` | Video rich results; transcript/description indexing |

Pages commonly stack multiple types (e.g. an `Organization` + `WebSite` on the homepage; an
`Article` + `BreadcrumbList` + `FAQPage` on a blog post). Combine them either as separate
`<script>` blocks or in a `@graph` array.

## Entity building with `sameAs` (important for GEO)

`Organization` and `Person` schema with a `sameAs` array linking to your official profiles
(LinkedIn, Wikipedia/Wikidata, Crunchbase, GitHub, social) helps engines and AI models resolve
*who you are* as a single, verified entity. This "entity SEO" is a major factor in how AI
assistants describe and recommend a brand. Keep the entity consistent everywhere.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Brand",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/your-brand",
    "https://en.wikipedia.org/wiki/Your_Brand",
    "https://x.com/yourbrand"
  ]
}
```

## Validation workflow

Always validate before shipping — a syntax error means the whole block is ignored.

1. **Rich Results Test** (`search.google.com/test/rich-results`) — shows which rich results the
   page is eligible for.
2. **Schema Markup Validator** (`validator.schema.org`) — general schema.org validity.
3. In Search Console, watch the **Enhancements/Rich results** reports for errors and warnings
   after deployment.
4. Fill all **required** properties for the rich result you want, and as many **recommended**
   ones as truthfully apply — partial markup may not be eligible.

## FAQ & HowTo caveat

Google has narrowed FAQ/HowTo rich-result *display* over time (they now show mainly for
authoritative gov/health sites in some regions). Still worth including: the markup remains a
clean, structured signal that AI answer engines parse readily, even when the search rich result
isn't shown. Prioritize genuine, useful Q&A — not keyword-stuffed fake FAQs.
