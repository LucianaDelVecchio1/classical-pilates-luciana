#!/usr/bin/env node
/**
 * Genera un brief de Instagram para un artículo aprobado del blog:
 * resumen, título, pie de publicación, CTA, hashtags moderados, URL
 * y brief de imagen/carrusel. NO publica nada (ver docs/INSTAGRAM.md
 * para los requisitos de publicación oficial vía Graph API).
 *
 * Uso: node scripts/editorial/instagram-brief.mjs content/blog/es/<slug>.mdx
 * Salida: reports/instagram-brief-<slug>.md
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error("Uso: instagram-brief.mjs <ruta al .mdx>");
  process.exit(1);
}

const { data, content } = matter(fs.readFileSync(file, "utf8"));
const slug = path.basename(file, ".mdx");
const url = `https://serpilatesclassical.com/es/blog/${slug}`;

const firstParagraph = content
  .split("\n\n")
  .map((p) => p.trim())
  .find((p) => p && !p.startsWith("#"));

const brief = `# Brief de Instagram — ${data.title}

## Resumen del artículo
${data.excerpt}

## Título propuesto para el post
${data.title}

## Pie de publicación (caption)
${firstParagraph?.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") ?? data.excerpt}

Lee el artículo completo en el enlace de la bio.
📍 Palma de Mallorca · Pilates Clásico frente al mar

## Llamada a la acción
Reserva tu clase de prueba (30 €) — enlace en la bio o WhatsApp.

## Hashtags (moderados)
#PilatesClasico #ClassicalPilates #PilatesPalma #PilatesMallorca #${(data.category ?? "").replace(/\s+/g, "")}

## URL del artículo
${url}

## Brief de imagen / carrusel
- Imagen 1: ${data.imageAlt}
- Carrusel opcional: 2-3 ideas clave del artículo como tarjetas de texto
  sobre fondo marfil (#F6F2EA) con tipografía serif y línea de horizonte.
- Estilo: luz natural, tonos arena/azul mediterráneo, sin estética de gimnasio.
`;

fs.mkdirSync(path.join(process.cwd(), "reports"), { recursive: true });
const out = path.join(process.cwd(), "reports", `instagram-brief-${slug}.md`);
fs.writeFileSync(out, brief, "utf8");
console.log(out);
