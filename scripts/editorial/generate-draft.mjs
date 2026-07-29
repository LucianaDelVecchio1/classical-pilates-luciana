#!/usr/bin/env node
/**
 * Genera un borrador de artículo MDX mediante la API de Anthropic.
 * Requiere ANTHROPIC_API_KEY en el entorno (secret de GitHub Actions).
 *
 * Uso:
 *   node scripts/editorial/propose-topics.mjs > topic.json
 *   node scripts/editorial/generate-draft.mjs "$(cat topic.json)"
 *
 * El borrador se escribe en content/blog/es/<slug>.mdx con draft: true.
 * NUNCA publica directamente: el workflow abre un PR con etiqueta
 * editorial-review (autopublicación solo si AUTO_PUBLISH_BLOG=true).
 */
import fs from "node:fs";
import path from "node:path";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Falta ANTHROPIC_API_KEY.");
  process.exit(1);
}

const topicArg = process.argv[2];
if (!topicArg) {
  console.error("Uso: generate-draft.mjs '<json del tema>'");
  process.exit(1);
}
const { cluster, topic, keywords } = JSON.parse(topicArg);
const today = new Date().toISOString().slice(0, 10);

const EDITORIAL_TEMPLATE = fs.readFileSync(
  path.join(process.cwd(), "docs", "EDITORIAL_TEMPLATE.md"),
  "utf8",
);

const prompt = `Escribe un artículo de blog en español para "Classical Pilates Luciana",
un estudio boutique de Pilates Clásico frente al mar en Palma de Mallorca.

TEMA: ${topic}
CATEGORÍA: ${cluster}
KEYWORDS ORIENTATIVAS (sin sobreoptimizar): ${keywords.join(", ")}
FECHA: ${today}

Sigue ESTRICTAMENTE esta plantilla editorial:

${EDITORIAL_TEMPLATE}

Devuelve ÚNICAMENTE el archivo MDX completo (frontmatter + cuerpo), sin explicaciones.`;

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-5",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!res.ok) {
  console.error(`Error de la API de Anthropic: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
let mdx = data.content?.[0]?.text ?? "";
mdx = mdx.replace(/^```mdx?\n/, "").replace(/\n```\s*$/, "").trim() + "\n";

// Marcar como borrador siempre: la revisión humana decide publicar.
if (!/^draft:/m.test(mdx)) {
  mdx = mdx.replace(/^---\n/, "---\ndraft: true\n");
}

const slugMatch = /^title:\s*["']?(.+?)["']?\s*$/m.exec(mdx);
const slug = (slugMatch?.[1] ?? `borrador-${today}`)
  .toLowerCase()
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .slice(0, 60);

const outPath = path.join(process.cwd(), "content", "blog", "es", `${slug}.mdx`);
if (fs.existsSync(outPath)) {
  console.error(`Ya existe ${outPath}; abortando para no sobrescribir.`);
  process.exit(1);
}
fs.writeFileSync(outPath, mdx, "utf8");
console.log(outPath);
