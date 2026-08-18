# GEO / AEO — Getting Cited by AI Assistants

Generative Engine Optimization (GEO) — also called Answer Engine Optimization (AEO) — is the
practice of getting a site **cited, quoted, and recommended inside AI answers**: ChatGPT,
Gemini, Claude, Perplexity, Google AI Overviews, Microsoft Copilot.

The mindset shift: there is no fixed "position #1". Success is **share of voice** — how often
your brand/content appears and is cited across AI responses for the queries that matter to you.
You're optimizing to be *the source the model reaches for*.

Crucially, GEO is built on top of good SEO, not instead of it. AI assistants run live web
searches and reuse search-engine signals. So do everything in `technical-seo.md`,
`onpage-and-content.md`, and `structured-data.md` first — then add the layers below.

## Table of contents
1. The three pillars of AI visibility
2. Make content machine-retrievable (technical)
3. Write content the way models quote it
4. llms.txt
5. AI crawlers: who to allow and how
6. Off-domain authority — the biggest GEO lever
7. Platform-by-platform notes
8. Measuring AI visibility

---

## 1. The three pillars of AI visibility

An AI assistant can only cite you if all three are true:

1. **Retrievable** — its crawler can fetch and read the page (not blocked, not JS-only, not
   gated). Covered in §2 and §5.
2. **Extractable** — the answer is stated clearly enough to lift as a standalone, attributable
   fact. Covered in §3.
3. **Trusted** — the model has corroborating signals that you're a credible source: authority,
   consistent entity, third-party mentions. Covered in §6 and in `onpage-and-content.md`.

Weakness in any one pillar drops you out of the answer. Diagnose which pillar is failing before
prescribing fixes.

## 2. Make content machine-retrievable (technical)

- **Server-render or statically generate** the content and metadata. Most AI bots don't run
  JavaScript, so client-hydrated content is often invisible. This is the #1 GEO failure — verify
  with `curl` that your text is in the raw HTML (see `technical-seo.md` §5).
- **Don't gate what you want cited.** Content behind logins, paywalls, "read more" toggles,
  tabs, accordions, or carousels may not be read. Put citable content in the initial DOM.
- **Check robots.txt and your CDN/WAF.** Cloudflare and similar can silently block AI bots
  (there are one-click "block AI" toggles). If you want AI visibility, confirm the search bots
  are allowed (§5).
- **Add structured data** (`structured-data.md`) — it gives models unambiguous, extractable
  facts (prices, ratings, Q&A, author, dates, entity identity).
- **Keep it fast and clean.** Bots have time/size budgets; slow or bloated pages get partially
  read.

## 3. Write content the way models quote it

Models favor content that is easy to lift as a correct, self-contained answer.

- **Answer first.** Open the page/section with a direct 1–3 sentence answer to the implied
  question, then elaborate. Don't bury it.
- **Question-based headings** that mirror how people ask AI ("How much does X cost?",
  "Is X better than Y?"). Each becomes a liftable Q→A unit.
- **Short paragraphs (2–3 sentences)** and generous use of **lists, numbered steps, and
  tables**. Pages rich in structured lists, quotes, and statistics show markedly higher AI
  visibility than walls of prose.
- **Self-contained, quotable statements.** Write sentences that are true and complete on their
  own, so a model can quote one without surrounding context. Include the specific number, the
  date, the unit.
- **Cite sources and quote experts** with name/title/company. Models trust — and re-cite —
  content that itself shows sourcing and expertise.
- **Cover the fan-out.** Break a big topic into the component sub-questions users actually ask
  (often an FAQ block) so you can be cited for each facet, not just the headline query.
- **Freshness.** AI citations to a page fall off sharply once it's >~3 months old. Add and
  maintain visible `dateModified`, refresh cornerstone pages quarterly with new data/examples,
  and keep `<lastmod>` in the sitemap accurate.

## 4. llms.txt

`llms.txt` is a proposed Markdown standard at the domain root (`/llms.txt`) that gives AI
systems a curated map of your best, most citable content — think "a sitemap written for LLMs".

Adoption note: it's an emerging convention, championed by AI-first tools and increasingly by AI
crawlers, but not universally consumed (e.g. Google has said it doesn't currently use it for
Search). It's low-cost to add and forward-looking; treat it as a helpful supplement, not a
guaranteed ranking lever, and never as a *substitute* for crawlable on-page content.

Format and rules (see the ready template in `assets/llms.txt.example`):

- Root only: `https://example.com/llms.txt`. Markdown.
- Curate: **10–30 URLs**, your best answer-dense pages. Lists over ~50 dilute the "these are my
  best" signal. Skip thin (<500-word) or duplicate pages.
- Group under descriptive `##` section headers; each entry is
  `- [Descriptive Title](https://full-url): a detailed sentence on what it covers, what
  questions it answers, and any unique data.` Rich descriptions beat terse ones.
- **Sync with robots.txt** — never list a URL you also block; the contradiction undermines both.
- Optional `llms-full.txt`: the full Markdown text of your 5–10 most important pages inline
  (useful for docs/developer sites so assistants get content without extra fetches or JS).

## 5. AI crawlers: who to allow and how

Different bots do different jobs. Distinguish **search/retrieval** bots (they fetch pages to
*answer a user right now* and can cite you — you almost always want these) from **training**
bots (they gather data to train future models — allowing them is an editorial/IP choice).

| Company | Search / retrieval (allow for citations) | Training crawler (opt-in choice) |
|---------|------------------------------------------|----------------------------------|
| OpenAI | `OAI-SearchBot` (SearchGPT index), `ChatGPT-User` (user-triggered browse) | `GPTBot` |
| Anthropic (Claude) | `Claude-User` / `Claude-Web` (user-triggered fetch), `Claude-SearchBot` | `ClaudeBot`, `anthropic-ai` |
| Google | `Googlebot` (also powers AI Overviews — **never block**) | `Google-Extended` (Gemini/Vertex training) |
| Perplexity | `PerplexityBot`, `Perplexity-User` | — |
| Microsoft/Bing | `Bingbot` (powers Copilot) | — |
| Apple | `Applebot` | `Applebot-Extended` |
| Amazon | `Amazonbot` | — |
| Common Crawl | — | `CCBot` (feeds many LLMs) |

Key points:

- **Blocking a search/retrieval bot guarantees you can't be cited by that assistant.** For
  maximum visibility, allow them all.
- **Never block `Googlebot`** — it removes you from Google Search *and* AI Overviews.
- Blocking a *training* bot (GPTBot, ClaudeBot, Google-Extended, CCBot) does **not** stop
  live-search citations from that company's search bot — they're separate user-agents. So you
  can opt out of training while staying visible in AI answers, if that's your preference.
- Specify each bot individually rather than a blanket `User-agent: *` disallow, so you don't
  accidentally catch Googlebot. See `assets/robots.txt.example`.

## 6. Off-domain authority — the biggest GEO lever

What the wider web says about you often matters more than your own pages for AI recommendations,
because models synthesize across many sources.

- **Get mentioned in pages AI already cites.** Query your target prompts in ChatGPT/Perplexity/
  Gemini, note which URLs they cite, and work to be represented on those pages — expert quotes,
  guest contributions, being added to a "best/top" list, a comparison table. This is frequently
  the fastest way to move share of voice.
- **Unlinked brand mentions count.** Consistent, positive mentions across articles, roundups,
  and comparisons shape how models describe you — even without a hyperlink.
- **Participate authentically where models draw from.** Reddit, YouTube, Q&A sites, industry
  forums, and niche communities are heavily represented in AI training and retrieval. Add real
  value; don't spam (models and platforms filter obvious manipulation, and it backfires).
- **Wikipedia / Wikidata.** A well-sourced entity there strongly influences how AI systems
  describe your brand and links your `sameAs` entity graph together. Only pursue if genuinely
  notable and follow Wikipedia's rules.
- **Consistent entity everywhere.** Same brand name, description, logo, and profile links across
  the web and in your `Organization` schema so models resolve one confident entity.

## 7. Platform-by-platform notes

Optimize for the shared fundamentals above; then note these tendencies:

- **ChatGPT (OpenAI)** — largest reach; favors comprehensive, well-sourced content with clear
  expertise signals. Uses Bing-powered and its own search index; solid classic SEO helps.
- **Google AI Overviews** — tightly tied to traditional Google rankings and structured data. If
  you rank well and have clean schema, you're in the running. Never block Googlebot.
- **Perplexity** — the most citation-forward engine; strong recency bias and visible source
  lists. Freshness and clearly-sourced, structured pages win. High-intent traffic.
- **Gemini (Google)** — fast-growing; strong overlap with Google Search signals, so SEO
  translates directly. Entity/structured data help.
- **Claude (Anthropic)** — synthesizes and reasons over sources rather than pasting quotes;
  rewards well-structured, logically-organized, unambiguous content it can reason about.
- **Copilot (Microsoft)** — Bing-powered; make sure the site is healthy in Bing Webmaster Tools.

## 8. Measuring AI visibility

Traditional rank trackers don't capture AI answers. Track instead:

- **Share of voice / citation frequency** — across a fixed set of 10–20 high-intent prompts,
  how often you appear and are cited, vs competitors. Re-run monthly.
- **Manual prompt panel** — keep a spreadsheet of your key prompts; each month, ask ChatGPT,
  Perplexity, and Gemini, and log presence, how you're described, and which URLs are cited.
- **Brand-mention accuracy** — is the AI describing you correctly? Inaccuracies point to weak or
  conflicting entity signals to fix.
- **AI referral traffic** — in analytics/server logs, watch referrals from `chatgpt.com`,
  `perplexity.ai`, `gemini.google.com`, and crawler hits from `ChatGPT-User`, `PerplexityBot`,
  etc. (Cloudflare exposes AI crawl metrics.)
- **Dedicated GEO trackers** exist (e.g. Profound, Peec, Otterly, LLMrefs and similar) if you
  want automated monitoring, but the manual prompt panel is a fine, free starting point.
