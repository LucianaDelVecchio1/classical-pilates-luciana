#!/usr/bin/env node
/**
 * Valida los artículos del blog contra la plantilla editorial:
 * frontmatter, longitudes SEO, enlaces internos, CTA, duplicación
 * y reglas de contenido prohibido.
 *
 * Uso: node scripts/editorial/validate-content.mjs [ruta.mdx...]
 * Sin argumentos valida todo content/blog. Sale con código 1 si hay errores.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CATEGORIES = [
  "Pilates Clásico",
  "Respiración",
  "Conciencia corporal",
  "Postura y movimiento",
  "Historia del método",
  "Vida junto al mar",
  "Bienestar y estilo de vida",
  "Pilates en Palma de Mallorca",
  "Equipamiento clásico",
  "Primeros pasos",
];

const FORBIDDEN_PATTERNS = [
  { re: /tania\s+tsiora/i, msg: "Menciona 'Pilates Tania Tsiora' (prohibido)" },
  { re: /\b(cura|curar|elimina el dolor|desintoxica|sana enfermedades)\b/i, msg: "Posible afirmación médica" },
  { re: /\b(65|200|120|150|90)\s?€/, msg: "Posible precio interno publicado (solo 30 € es público)" },
];

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : walk(path.join(process.cwd(), "content", "blog"));

const allPosts = walk(path.join(process.cwd(), "content", "blog")).map((f) => ({
  file: f,
  ...matter(fs.readFileSync(f, "utf8")),
}));

let errors = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const rel = path.relative(process.cwd(), file);
  const fail = (msg) => {
    console.error(`✖ ${rel}: ${msg}`);
    errors++;
  };

  // Frontmatter
  for (const key of ["title", "excerpt", "author", "date", "category", "imageAlt", "metaDescription", "translationKey"]) {
    if (!data[key]) fail(`falta frontmatter obligatorio: ${key}`);
  }
  if (data.title && data.title.length > 70) fail(`title demasiado largo (${data.title.length} > 70)`);
  if (data.metaTitle && data.metaTitle.length > 70) fail(`metaTitle demasiado largo (${data.metaTitle.length} > 70)`);
  if (data.metaDescription && (data.metaDescription.length < 120 || data.metaDescription.length > 170))
    fail(`metaDescription fuera de rango (${data.metaDescription.length}; esperado 120-170)`);
  if (data.category && !CATEGORIES.includes(data.category))
    fail(`categoría desconocida: "${data.category}"`);
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date)))
    fail(`fecha inválida: ${data.date}`);

  // Cuerpo
  const words = content.split(/\s+/).filter(Boolean).length;
  if (words < 500) fail(`cuerpo demasiado corto (${words} palabras; mínimo 500)`);
  const h2s = (content.match(/^##\s/gm) ?? []).length;
  if (h2s < 3) fail(`menos de 3 encabezados ## (${h2s})`);

  // Enlaces internos y CTA
  const internalLinks = (content.match(/\]\(\/(es|en|sv|de)\//g) ?? []).length;
  if (internalLinks < 2) fail(`menos de 2 enlaces internos (${internalLinks})`);
  if (!/clase-de-prueba|trial-class|whatsapp/i.test(content))
    fail("sin CTA hacia la clase de prueba o WhatsApp");

  // Enlaces internos rotos (rutas ES conocidas)
  const KNOWN_ES = [
    "/es/clase-de-prueba", "/es/metodo-pilates-clasico", "/es/el-estudio",
    "/es/sesiones", "/es/sobre-luciana", "/es/preguntas-frecuentes",
    "/es/contacto", "/es/blog",
  ];
  for (const m of content.matchAll(/\]\((\/es\/[^)#?]+)\)/g)) {
    const target = m[1].replace(/\/$/, "");
    if (!KNOWN_ES.includes(target) && !target.startsWith("/es/blog/"))
      fail(`enlace interno no reconocido: ${m[1]}`);
  }

  // Contenido prohibido
  for (const { re, msg } of FORBIDDEN_PATTERNS) {
    if (re.test(content) || re.test(JSON.stringify(data))) fail(msg);
  }

  // Duplicación básica frente a otros artículos
  for (const other of allPosts) {
    if (path.resolve(other.file) === path.resolve(file)) continue;
    if (other.data.translationKey === data.translationKey && path.dirname(other.file) === path.dirname(file))
      fail(`translationKey duplicada con ${path.basename(other.file)}`);
    if (other.data.title && data.title && titleSimilarity(other.data.title, data.title) > 0.7)
      fail(`título muy similar a ${path.basename(other.file)}`);
  }
}

if (errors) {
  console.error(`\n${errors} error(es) de validación.`);
  process.exit(1);
}
console.log(`✓ ${files.length} artículo(s) válidos.`);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith(".mdx")) out.push(p);
  }
  return out;
}

function titleSimilarity(a, b) {
  const wa = new Set(a.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
  const wb = new Set(b.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
  if (!wa.size || !wb.size) return 0;
  let common = 0;
  for (const w of wa) if (wb.has(w)) common++;
  return common / Math.min(wa.size, wb.size);
}
