# Audit & Measurement

Never prescribe blind. Start every engagement by measuring the current state, and end it by
setting up tracking so improvement is visible. This file is the checklist + the toolset.

## Table of contents
1. Running the audit script
2. The full audit checklist
3. Tools worth using
4. What to measure (SEO)
5. What to measure (GEO/AI)
6. Reporting format
7. Realistic timelines

---

## 1. Running the audit script

`scripts/seo_audit.py` pulls the on-page and technical signals for one or more URLs so your
recommendations rest on facts, not guesses.

```bash
# one page, human-readable summary
python scripts/seo_audit.py https://example.com/pricing

# several pages, save structured results
python scripts/seo_audit.py https://example.com https://example.com/blog/post --json audit.json
```

It reports: HTTP status, final URL/redirects, title (+length), meta description (+length),
canonical, meta-robots, `<h1>`s and heading outline, word count, images missing `alt`,
`hreflang` set, presence and types of JSON-LD structured data, viewport tag, Open Graph tags,
response size, and a heuristic flag for JavaScript-dependent (client-rendered) pages.

If `requests`/`beautifulsoup4` are missing it prints the exact `pip install --break-system-packages
requests beautifulsoup4` command. It does **not** measure field Core Web Vitals (those require
real-user data — use PageSpeed Insights / Search Console CrUX for that).

## 2. The full audit checklist

**Technical**
- [ ] Site verified in Google Search Console + Bing Webmaster Tools
- [ ] `200`/redirect/error codes correct; no redirect chains; one canonical host (www/https)
- [ ] robots.txt sane (no accidental blocks; sitemap referenced; AI search bots allowed)
- [ ] XML sitemap present, canonical-only, submitted, accurate `<lastmod>`
- [ ] Canonical tags correct and self-referencing
- [ ] No accidental `noindex` on important pages
- [ ] Key content present in raw HTML (not JS-only) — critical for AI
- [ ] Core Web Vitals passing (LCP <2.5s, INP <200ms, CLS <0.1 at p75 field data)
- [ ] HTTPS everywhere; mobile-friendly; no intrusive interstitials
- [ ] hreflang correct if multi-region/-language

**On-page & content**
- [ ] Every page: unique, intent-matched title (~50–60 chars) + description (~140–160)
- [ ] One H1; logical heading outline; question-based headings where useful
- [ ] Answer-first structure; short paragraphs; lists/tables for facts
- [ ] Content matches search intent and fully answers the query
- [ ] E-E-A-T: author bylines/bios, sources, dates, contact/about, policies
- [ ] Internal links with descriptive anchors; topic clusters interlinked
- [ ] Images: descriptive filenames, alt text, compressed, dimensioned

**Structured data**
- [ ] Appropriate JSON-LD per page type; validates cleanly; matches visible content
- [ ] `Organization`/`Person` with `sameAs` entity graph

**GEO/AEO**
- [ ] AI search crawlers allowed; content retrievable without JS
- [ ] llms.txt present and synced with robots.txt
- [ ] Content is quotable (self-contained facts, sourced stats, fresh dates)
- [ ] Off-domain presence: mentions on already-cited pages, consistent entity, key profiles

## 3. Tools worth using

Free/essential: **Google Search Console** (impressions, clicks, queries, indexing, CWV),
**Bing Webmaster Tools**, **PageSpeed Insights** (field + lab CWV), **Rich Results Test** and
**validator.schema.org** (structured data), **Google Analytics 4** or equivalent (traffic,
conversions, referrals).

Paid/optional (only if the user has them — don't require them): Ahrefs, Semrush, or Moz for
keyword/backlink research and rank tracking; Screaming Frog for large-site crawls; GEO trackers
(Profound, Peec, Otterly, LLMrefs) for AI-citation monitoring.

## 4. What to measure (SEO)

- **Organic impressions & clicks** by query and page (Search Console) — the ground truth.
- **Average position** for target queries, and coverage of the topic cluster.
- **Indexing** — indexed vs submitted; anything excluded and why.
- **Core Web Vitals** — % of URLs "good" at p75.
- **Conversions from organic** — the business outcome, not just traffic.
- **Backlinks / referring domains** growth and quality.

## 5. What to measure (GEO/AI)

See `geo-aeo.md` §8 for detail. In short: **share of voice** across a fixed prompt panel,
**brand-mention accuracy**, **which URLs get cited**, and **AI referral traffic + crawler hits**
in logs/analytics. Re-run the manual prompt panel monthly.

## 6. Reporting format

When delivering an audit or a plan, use this shape so it's scannable and actionable:

```
# SEO/GEO Audit — <domain> (<date>)

## Executive summary
2–4 sentences: overall health, the single biggest opportunity, expected impact.

## Priority actions (highest ROI first)
1. <Action> — why it matters — effort (S/M/L) — expected impact
2. …

## Findings by area
### Technical   ### On-page & content   ### Structured data   ### GEO/AEO   ### Authority
(what's wrong, the evidence from the audit, the specific fix — with code where relevant)

## Measurement plan
What we'll track and the cadence.
```

Lead with the one or two changes that will move the needle most, not an undifferentiated list of
50 nitpicks. Attach the concrete artifacts (schema files, edited templates, the audit JSON).

## 7. Realistic timelines

Set honest expectations — this protects trust and prevents black-hat shortcuts:

- **Technical & on-page fixes**: effects in days to a few weeks (re-crawl + re-index).
- **New/updated content ranking**: typically weeks to a few months to mature.
- **Authority/backlink-driven ranking for competitive terms**: 3–6 months or more.
- **AI citations**: can appear quickly once you're retrievable and cited elsewhere, but share
  of voice builds over weeks as models re-crawl and third-party mentions accumulate.

Never promise a guaranteed #1 ranking or guaranteed AI citation on a timeline. Search and AI
systems are competitive and outside anyone's full control; durable gains come from being
genuinely the best answer.
