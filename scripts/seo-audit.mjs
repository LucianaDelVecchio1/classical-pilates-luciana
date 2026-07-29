#!/usr/bin/env node
/**
 * Auditoría SEO semanal. Analiza el sitio construido (URL base) o,
 * en su defecto, el contenido estático del repositorio, y genera un
 * informe Markdown en reports/seo-audit-<fecha>.md.
 *
 * Solo informa; los cambios editoriales requieren PR (los realiza
 * el workflow, nunca este script).
 *
 * Uso: node scripts/seo-audit.mjs [https://dominio]
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const baseUrl = process.argv[2] ?? process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const today = new Date().toISOString().slice(0, 10);
const findings = []; // { priority, problem, url, impact, action }

const ROUTES = [
  "/es", "/en", "/sv", "/de",
  "/es/sobre-luciana", "/es/metodo-pilates-clasico", "/es/el-estudio",
  "/es/sesiones", "/es/clase-de-prueba", "/es/preguntas-frecuentes",
  "/es/blog", "/es/contacto",
  "/en/trial-class", "/sv/provlektion", "/de/probestunde",
  "/sitemap.xml", "/robots.txt",
];

// --- 1. Estado HTTP y metadatos de rutas importantes ---
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const route of ROUTES) {
  const url = baseUrl + route;
  let res;
  try {
    res = await fetch(url, { redirect: "follow" });
  } catch {
    findings.push({
      priority: "ALTA", problem: "Ruta inaccesible", url,
      impact: "Página fuera de servicio: pérdida directa de tráfico",
      action: "Comprobar despliegue y enrutado",
    });
    continue;
  }
  if (!res.ok) {
    findings.push({
      priority: "ALTA", problem: `HTTP ${res.status}`, url,
      impact: "Página no indexable", action: "Corregir la ruta o el redirect",
    });
    continue;
  }
  if (route.endsWith(".xml") || route.endsWith(".txt")) continue;

  const html = await res.text();
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
  const description = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(html)?.[1];
  const canonical = /<link\s+rel="canonical"\s+href="([^"]*)"/i.exec(html)?.[1];
  const hreflangs = (html.match(/hreflang="/g) ?? []).length;
  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/gi) ?? []).length;
  const jsonLd = html.includes('application/ld+json');
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;

  if (!title) findings.push({ priority: "ALTA", problem: "Sin <title>", url, impact: "CTR y ranking", action: "Añadir title único" });
  else {
    if (title.length > 65) findings.push({ priority: "MEDIA", problem: `Title largo (${title.length})`, url, impact: "Truncado en SERP", action: "Acortar a ≤60-65" });
    if (seenTitles.has(title)) findings.push({ priority: "MEDIA", problem: "Title duplicado", url: `${url} y ${seenTitles.get(title)}`, impact: "Canibalización", action: "Diferenciar titles" });
    seenTitles.set(title, url);
  }
  if (!description) findings.push({ priority: "MEDIA", problem: "Sin meta description", url, impact: "CTR", action: "Añadir description" });
  else {
    if (seenDescriptions.has(description)) findings.push({ priority: "BAJA", problem: "Description duplicada", url: `${url} y ${seenDescriptions.get(description)}`, impact: "CTR", action: "Diferenciar" });
    seenDescriptions.set(description, url);
  }
  if (!canonical) findings.push({ priority: "MEDIA", problem: "Sin canonical", url, impact: "Duplicidad", action: "Añadir canonical" });
  if (hreflangs < 4) findings.push({ priority: "MEDIA", problem: `hreflang incompleto (${hreflangs})`, url, impact: "SEO internacional", action: "Revisar alternates" });
  if (imgsNoAlt > 0) findings.push({ priority: "MEDIA", problem: `${imgsNoAlt} imagen(es) sin alt`, url, impact: "Accesibilidad y SEO", action: "Añadir alt traducible" });
  if (!jsonLd) findings.push({ priority: "BAJA", problem: "Sin structured data", url, impact: "Rich results", action: "Añadir JSON-LD" });
  if (h1s !== 1) findings.push({ priority: "MEDIA", problem: `${h1s} etiquetas <h1>`, url, impact: "Jerarquía de encabezados", action: "Dejar exactamente un h1" });

  // Enlaces internos rotos (mismo dominio)
  for (const m of html.matchAll(/href="(\/(?:es|en|sv|de)\/[^"#?]*)"/g)) {
    const target = baseUrl + m[1];
    try {
      const r = await fetch(target, { method: "HEAD" });
      if (r.status === 404)
        findings.push({ priority: "ALTA", problem: "Enlace interno roto", url: `${url} → ${m[1]}`, impact: "UX y rastreo", action: "Corregir el enlace" });
    } catch { /* red no disponible: ya reportado arriba */ }
  }
}

// --- 2. Artículos antiguos susceptibles de actualización ---
const blogDir = path.join(process.cwd(), "content", "blog", "es");
if (fs.existsSync(blogDir)) {
  const SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;
  for (const f of fs.readdirSync(blogDir).filter((x) => x.endsWith(".mdx"))) {
    const { data } = matter(fs.readFileSync(path.join(blogDir, f), "utf8"));
    const last = new Date(data.updated ?? data.date);
    if (Date.now() - last.getTime() > SIX_MONTHS) {
      findings.push({
        priority: "BAJA", problem: "Artículo sin actualizar en +6 meses",
        url: `content/blog/es/${f}`, impact: "Frescura de contenido",
        action: "Revisar, actualizar y cambiar 'updated'",
      });
    }
  }
}

// --- 3. Informe ---
const order = { ALTA: 0, MEDIA: 1, BAJA: 2 };
findings.sort((a, b) => order[a.priority] - order[b.priority]);

const lines = [
  `# Auditoría SEO — ${today}`,
  "",
  `Base auditada: ${baseUrl}`,
  `Problemas encontrados: ${findings.length}`,
  "",
  "| Prioridad | Problema | URL | Impacto estimado | Acción recomendada |",
  "|---|---|---|---|---|",
  ...findings.map((f) => `| ${f.priority} | ${f.problem} | ${f.url} | ${f.impact} | ${f.action} |`),
  "",
  "## Cambios automáticos realizados",
  "",
  "Ninguno: esta auditoría solo informa. Los cambios mecánicos seguros",
  "(p. ej. regenerar sitemap) ocurren en el build; los editoriales requieren PR.",
  "",
];

fs.mkdirSync(path.join(process.cwd(), "reports"), { recursive: true });
const outPath = path.join(process.cwd(), "reports", `seo-audit-${today}.md`);
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(outPath);
if (findings.some((f) => f.priority === "ALTA")) process.exitCode = 2;
