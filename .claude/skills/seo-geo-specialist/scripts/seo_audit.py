#!/usr/bin/env python3
"""
seo_audit.py — quick on-page + technical SEO/GEO signal extractor.

Fetches one or more URLs and reports the signals that matter for ranking in search
engines and for being cited by AI assistants. Use it at the START of an engagement so
recommendations rest on what the page actually contains, not guesses.

Usage:
    python seo_audit.py https://example.com
    python seo_audit.py https://example.com https://example.com/pricing
    python seo_audit.py https://example.com --json report.json

Notes:
- Requires `requests` and `beautifulsoup4`. If missing, the script prints the exact
  install command and exits (it does not crash).
- It fetches the RAW HTML (no JavaScript execution) — which is exactly what most AI
  crawlers see. If your content isn't in this output, AI bots probably can't see it.
- It does NOT measure field Core Web Vitals (those need real-user data — use PageSpeed
  Insights / Search Console CrUX). It flags obvious performance red flags only.
"""

import sys
import json
import argparse
from urllib.parse import urljoin, urlparse

# --- dependency check (graceful) -------------------------------------------------
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    sys.stderr.write(
        "Missing dependencies. Install them with:\n\n"
        "    pip install --break-system-packages requests beautifulsoup4\n\n"
    )
    sys.exit(1)

UA = ("Mozilla/5.0 (compatible; SEO-GEO-Audit/1.0; +https://example.com/bot) "
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36")

# Recommended length windows (characters)
TITLE_MIN, TITLE_MAX = 30, 60
DESC_MIN, DESC_MAX = 70, 160


def fetch(url):
    """Return (response, redirect_chain) or raise."""
    resp = requests.get(url, headers={"User-Agent": UA}, timeout=20, allow_redirects=True)
    chain = [f"{r.status_code} {r.url}" for r in resp.history]
    return resp, chain


def head_of_domain(url, path):
    p = urlparse(url)
    return f"{p.scheme}://{p.netloc}{path}"


def check_exists(url):
    """Lightweight GET to see if a root file (robots.txt, llms.txt) exists."""
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=10)
        return r.status_code == 200, r.status_code, (r.text if r.status_code == 200 else "")
    except requests.RequestException:
        return False, None, ""


def audit_url(url):
    out = {"url": url}
    try:
        resp, chain = fetch(url)
    except requests.RequestException as e:
        out["error"] = str(e)
        return out

    # Fix mojibake when the server omits charset (requests then guesses ISO-8859-1).
    if "charset" not in resp.headers.get("Content-Type", "").lower():
        resp.encoding = resp.apparent_encoding or resp.encoding
    html = resp.text or ""
    out["http_status"] = resp.status_code
    out["final_url"] = resp.url
    out["redirect_chain"] = chain
    out["response_bytes"] = len(resp.content)
    out["content_type"] = resp.headers.get("Content-Type", "")
    out["https"] = resp.url.startswith("https://")

    soup = BeautifulSoup(html, "html.parser")

    # Title
    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    out["title"] = title
    out["title_length"] = len(title)

    # Meta description
    md = soup.find("meta", attrs={"name": lambda v: v and v.lower() == "description"})
    desc = (md.get("content") or "").strip() if md else ""
    out["meta_description"] = desc
    out["meta_description_length"] = len(desc)

    # Canonical
    can = soup.find("link", rel=lambda v: v and "canonical" in [x.lower() for x in (v if isinstance(v, list) else [v])])
    out["canonical"] = can.get("href") if can else None

    # Meta robots
    mr = soup.find("meta", attrs={"name": lambda v: v and v.lower() == "robots"})
    out["meta_robots"] = (mr.get("content") or "").strip() if mr else None
    out["noindex"] = bool(out["meta_robots"] and "noindex" in out["meta_robots"].lower())

    # Viewport (mobile)
    vp = soup.find("meta", attrs={"name": lambda v: v and v.lower() == "viewport"})
    out["has_viewport"] = bool(vp)

    # Headings
    h1s = [h.get_text(strip=True) for h in soup.find_all("h1")]
    out["h1_count"] = len(h1s)
    out["h1s"] = h1s[:5]
    outline = []
    for level in range(1, 5):
        for h in soup.find_all(f"h{level}"):
            outline.append(f"{'  ' * (level - 1)}H{level}: {h.get_text(strip=True)[:80]}")
    out["heading_outline"] = outline[:40]

    # Body word count (visible-ish text). Parse a SEPARATE copy so `soup` keeps its
    # <script> tags for the JSON-LD extraction below.
    text_soup = BeautifulSoup(html, "html.parser")
    for tag in text_soup(["script", "style", "noscript"]):
        tag.decompose()
    body_text = text_soup.get_text(" ", strip=True)
    words = body_text.split()
    out["word_count"] = len(words)

    # Images missing alt
    imgs = soup.find_all("img")
    missing_alt = [img.get("src", "(no src)") for img in imgs if not (img.get("alt") or "").strip()]
    out["image_count"] = len(imgs)
    out["images_missing_alt"] = missing_alt[:10]
    out["images_missing_alt_count"] = len(missing_alt)

    # hreflang
    hreflangs = []
    for link in soup.find_all("link", rel=lambda v: v and "alternate" in [x.lower() for x in (v if isinstance(v, list) else [v])]):
        if link.get("hreflang"):
            hreflangs.append({"hreflang": link.get("hreflang"), "href": link.get("href")})
    out["hreflang"] = hreflangs

    # Open Graph
    og = {m.get("property"): m.get("content") for m in soup.find_all("meta", property=lambda v: v and v.startswith("og:"))}
    out["open_graph"] = og
    out["has_open_graph"] = bool(og)

    # Structured data (JSON-LD)
    ld_types = []
    ld_errors = 0
    for script in soup.find_all("script", type="application/ld+json"):
        raw = script.string or script.get_text() or ""
        try:
            data = json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            ld_errors += 1
            continue
        for obj in (data if isinstance(data, list) else [data]):
            if isinstance(obj, dict):
                if "@graph" in obj and isinstance(obj["@graph"], list):
                    for node in obj["@graph"]:
                        if isinstance(node, dict) and node.get("@type"):
                            ld_types.append(node["@type"])
                elif obj.get("@type"):
                    ld_types.append(obj["@type"])
    out["structured_data_types"] = ld_types
    out["structured_data_invalid_blocks"] = ld_errors

    # Client-render heuristic: lots of scripts + very little server-rendered text
    script_count = len(BeautifulSoup(html, "html.parser").find_all("script"))
    out["script_tag_count"] = script_count
    likely_csr = out["word_count"] < 200 and script_count >= 3
    # Common SPA root containers with empty content:
    root_div = BeautifulSoup(html, "html.parser").find(id=lambda v: v in ("root", "app", "__next")) if html else None
    if root_div is not None and len(root_div.get_text(strip=True)) < 50:
        likely_csr = True
    out["likely_client_side_rendered"] = likely_csr

    return out


def issues_for(a):
    """Return a list of human-readable warnings for one audited page."""
    if "error" in a:
        return [f"FETCH FAILED: {a['error']}"]
    w = []
    if a.get("http_status") != 200:
        w.append(f"HTTP status is {a['http_status']} (want 200 for indexable pages)")
    if a.get("redirect_chain"):
        w.append(f"Redirect chain ({len(a['redirect_chain'])} hop(s)) — collapse to a single hop")
    if not a.get("https"):
        w.append("Not served over HTTPS")
    if not a.get("title"):
        w.append("Missing <title>")
    elif not (TITLE_MIN <= a["title_length"] <= TITLE_MAX):
        w.append(f"Title length {a['title_length']} outside ~{TITLE_MIN}-{TITLE_MAX} chars")
    if not a.get("meta_description"):
        w.append("Missing meta description")
    elif not (DESC_MIN <= a["meta_description_length"] <= DESC_MAX):
        w.append(f"Meta description length {a['meta_description_length']} outside ~{DESC_MIN}-{DESC_MAX}")
    if not a.get("canonical"):
        w.append("No canonical tag")
    if a.get("noindex"):
        w.append("Page is NOINDEX — it will be excluded from search results")
    if a.get("h1_count", 0) == 0:
        w.append("No <h1>")
    elif a.get("h1_count", 0) > 1:
        w.append(f"Multiple <h1> tags ({a['h1_count']}) — use exactly one")
    if not a.get("has_viewport"):
        w.append("No viewport meta — mobile-friendliness at risk")
    if a.get("word_count", 0) < 300:
        w.append(f"Thin content ({a['word_count']} words in raw HTML)")
    if a.get("images_missing_alt_count", 0) > 0:
        w.append(f"{a['images_missing_alt_count']} image(s) missing alt text")
    if not a.get("structured_data_types"):
        w.append("No JSON-LD structured data found")
    if a.get("structured_data_invalid_blocks", 0) > 0:
        w.append(f"{a['structured_data_invalid_blocks']} invalid JSON-LD block(s)")
    if a.get("likely_client_side_rendered"):
        w.append("LIKELY CLIENT-SIDE RENDERED — AI bots may see little/no content. Server-render it.")
    return w


def print_report(a):
    print("\n" + "=" * 78)
    print(f"URL: {a['url']}")
    if "error" in a:
        print(f"  ERROR: {a['error']}")
        return
    print(f"  Status: {a['http_status']}  |  HTTPS: {a['https']}  |  Bytes: {a['response_bytes']:,}")
    if a["redirect_chain"]:
        print(f"  Redirects: {' -> '.join(a['redirect_chain'])} -> {a['final_url']}")
    print(f"  Title ({a['title_length']}): {a['title'] or '—'}")
    print(f"  Description ({a['meta_description_length']}): {a['meta_description'] or '—'}")
    print(f"  Canonical: {a['canonical'] or '—'}")
    print(f"  Meta robots: {a['meta_robots'] or '—'}")
    print(f"  H1 x{a['h1_count']}: {', '.join(a['h1s']) or '—'}")
    print(f"  Words (raw HTML): {a['word_count']}  |  Images: {a['image_count']} ({a['images_missing_alt_count']} missing alt)")
    print(f"  Structured data: {', '.join(a['structured_data_types']) or 'none'}")
    print(f"  hreflang: {', '.join(h['hreflang'] for h in a['hreflang']) or 'none'}")
    print(f"  Open Graph: {'yes' if a['has_open_graph'] else 'no'}  |  Scripts: {a['script_tag_count']}  |  Likely CSR: {a['likely_client_side_rendered']}")
    issues = issues_for(a)
    print("  " + "-" * 40)
    if issues:
        print("  ISSUES / OPPORTUNITIES:")
        for i in issues:
            print(f"    • {i}")
    else:
        print("  No major issues detected. 🎉")


def main():
    ap = argparse.ArgumentParser(description="On-page + technical SEO/GEO signal audit.")
    ap.add_argument("urls", nargs="+", help="One or more URLs to audit")
    ap.add_argument("--json", metavar="FILE", help="Write full results to a JSON file")
    ap.add_argument("--no-root-check", action="store_true",
                    help="Skip checking /robots.txt and /llms.txt at the domain root")
    args = ap.parse_args()

    results = []
    for url in args.urls:
        if not urlparse(url).scheme:
            url = "https://" + url
        results.append(audit_url(url))

    for a in results:
        print_report(a)

    # Domain-level root files (checked once per unique domain)
    if not args.no_root_check:
        seen = set()
        print("\n" + "=" * 78)
        print("DOMAIN ROOT FILES")
        for a in results:
            base = a.get("final_url") or a["url"]
            netloc = urlparse(base).netloc
            if netloc in seen:
                continue
            seen.add(netloc)
            for fname in ("robots.txt", "llms.txt", "sitemap.xml"):
                exists, code, body = check_exists(head_of_domain(base, "/" + fname))
                mark = "✓" if exists else "✗"
                extra = ""
                if fname == "robots.txt" and exists:
                    has_sitemap = "sitemap:" in body.lower()
                    extra = f" (Sitemap directive: {'yes' if has_sitemap else 'MISSING'})"
                print(f"  {mark} https://{netloc}/{fname} [{code}]{extra}")

    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\nSaved JSON report to {args.json}")


if __name__ == "__main__":
    main()
