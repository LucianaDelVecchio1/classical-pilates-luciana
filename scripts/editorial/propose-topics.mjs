#!/usr/bin/env node
/**
 * Propone el siguiente tema del blog según los clusters SEO definidos
 * y los artículos ya publicados (evita repetir temas).
 *
 * Uso: node scripts/editorial/propose-topics.mjs
 * Salida: JSON con { cluster, topic, keywords } por stdout.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CLUSTERS = [
  {
    cluster: "Pilates Clásico",
    topics: [
      "Los seis principios del método Pilates explicados con ejemplos",
      "Contrología: por qué Joseph Pilates llamó así a su método",
      "Pilates clásico vs contemporáneo: guía honesta para elegir",
    ],
    keywords: ["pilates clásico", "método pilates", "contrología"],
  },
  {
    cluster: "Respiración",
    topics: [
      "Cómo la respiración lateral cambia tu práctica de Pilates",
      "Tres ejercicios de respiración para hacer en casa",
    ],
    keywords: ["respiración pilates", "respiración consciente"],
  },
  {
    cluster: "Pilates en Palma de Mallorca",
    topics: [
      "Practicar Pilates frente al mar: qué aporta el entorno a la práctica",
      "Guía para elegir estudio de Pilates en Palma de Mallorca",
    ],
    keywords: ["pilates palma", "pilates mallorca", "estudio pilates palma"],
  },
  {
    cluster: "Equipamiento clásico",
    topics: [
      "El Reformer: qué es y por qué es el corazón del estudio",
      "Gratz y los aparatos originales de Joseph Pilates",
    ],
    keywords: ["reformer palma", "aparatos pilates", "gratz"],
  },
  {
    cluster: "Postura y movimiento",
    topics: [
      "Postura y trabajo de oficina: cómo el Pilates organiza la espalda",
      "Qué significa moverse desde el centro",
    ],
    keywords: ["postura pilates", "conciencia corporal"],
  },
  {
    cluster: "Primeros pasos",
    topics: [
      "Preguntas que todo el mundo se hace antes de empezar Pilates",
      "Individual o dúo: qué modalidad te conviene para empezar",
    ],
    keywords: ["empezar pilates", "primera clase pilates"],
  },
];

const contentDir = path.join(process.cwd(), "content", "blog", "es");
const existing = fs.existsSync(contentDir)
  ? fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"))
  : [];

const existingTitles = existing.map((f) => {
  const { data } = matter(fs.readFileSync(path.join(contentDir, f), "utf8"));
  return String(data.title ?? "").toLowerCase();
});
const existingCategories = existing.map((f) => {
  const { data } = matter(fs.readFileSync(path.join(contentDir, f), "utf8"));
  return String(data.category ?? "");
});

// Prioriza clusters con menos artículos publicados; dentro del cluster,
// el primer tema aún no tratado.
const ranked = CLUSTERS.map((c) => ({
  ...c,
  published: existingCategories.filter((cat) => cat === c.cluster).length,
})).sort((a, b) => a.published - b.published);

for (const cluster of ranked) {
  const topic = cluster.topics.find(
    (t) => !existingTitles.some((title) => similarity(title, t.toLowerCase()) > 0.6),
  );
  if (topic) {
    console.log(JSON.stringify({ cluster: cluster.cluster, topic, keywords: cluster.keywords }));
    process.exit(0);
  }
}

console.error("No quedan temas sin tratar: ampliar la lista de clusters.");
process.exit(1);

/** Similitud simple por solapamiento de palabras (detección de duplicados). */
function similarity(a, b) {
  const wa = new Set(a.split(/\W+/).filter((w) => w.length > 3));
  const wb = new Set(b.split(/\W+/).filter((w) => w.length > 3));
  if (wa.size === 0 || wb.size === 0) return 0;
  let common = 0;
  for (const w of wa) if (wb.has(w)) common++;
  return common / Math.min(wa.size, wb.size);
}
