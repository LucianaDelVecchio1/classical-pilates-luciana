# JSON-LD Templates (copy, edit, validate)

Drop these into a `<script type="application/ld+json">` block. Replace every placeholder, delete
properties that don't truthfully apply, and **only mark up content that's visible on the page**.
Validate with the Rich Results Test (search.google.com/test/rich-results) and validator.schema.org
before shipping. Dates are ISO 8601 (`YYYY-MM-DD` or full `2026-08-01T10:00:00+02:00`).

---

## Organization (site-wide, usually on the homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourBrand",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "One-sentence description of what the company does.",
  "sameAs": [
    "https://www.linkedin.com/company/yourbrand",
    "https://x.com/yourbrand",
    "https://www.youtube.com/@yourbrand"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@example.com"
  }
}
```

## WebSite + Sitelinks Search Box (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "YourBrand",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://example.com/search?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
}
```

## Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Exact Post Title (≤110 chars)",
  "description": "Short summary of the article.",
  "image": "https://example.com/img/cover.jpg",
  "datePublished": "2026-01-15",
  "dateModified": "2026-08-01",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/author-name",
    "jobTitle": "Role",
    "sameAs": ["https://www.linkedin.com/in/authorname"]
  },
  "publisher": {
    "@type": "Organization",
    "name": "YourBrand",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://example.com/blog/post-slug" }
}
```

## Product + Offer + AggregateRating (e-commerce)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": ["https://example.com/img/product.jpg"],
  "description": "What the product is and does.",
  "sku": "SKU123",
  "brand": { "@type": "Brand", "name": "YourBrand" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/product-name",
    "priceCurrency": "USD",
    "price": "49.00",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "128"
  }
}
```

*Only include `aggregateRating`/`review` if you display real reviews.*

## FAQPage (great for GEO — use for genuine Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does YourBrand cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "Plans start at $X/month. There is a free tier with …" }
    },
    {
      "@type": "Question",
      "name": "Is there a free trial?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes — 14 days, no credit card required." }
    }
  ]
}
```

## HowTo (tutorials)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to do X",
  "totalTime": "PT15M",
  "step": [
    { "@type": "HowToStep", "name": "Step 1 title", "text": "Do this first.", "url": "https://example.com/guide#step1" },
    { "@type": "HowToStep", "name": "Step 2 title", "text": "Then do this." }
  ]
}
```

## BreadcrumbList (nav context on inner pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "This Post", "item": "https://example.com/blog/post-slug" }
  ]
}
```

## LocalBusiness (physical location / local SEO)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "YourBrand",
  "image": "https://example.com/storefront.jpg",
  "url": "https://example.com",
  "telephone": "+1-555-123-4567",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "ST",
    "postalCode": "00000",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "40.0", "longitude": "-74.0" },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00", "closes": "18:00" }
  ]
}
```

## Combining multiple types with @graph

Instead of several `<script>` blocks, you can put related entities in one:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://example.com/#org", "name": "YourBrand", "url": "https://example.com" },
    { "@type": "WebSite", "@id": "https://example.com/#website", "url": "https://example.com", "publisher": { "@id": "https://example.com/#org" } },
    { "@type": "WebPage", "@id": "https://example.com/blog/post#webpage", "url": "https://example.com/blog/post", "isPartOf": { "@id": "https://example.com/#website" } }
  ]
}
```

Using `@id` lets entities reference each other, which helps engines build a coherent entity graph
(valuable for GEO).
