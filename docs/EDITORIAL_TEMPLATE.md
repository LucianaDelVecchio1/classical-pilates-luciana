# Plantilla editorial — blog Ser Classical Pilates

Todo artículo (humano o generado) debe cumplir esta plantilla. La validación
automática (`scripts/editorial/validate-content.mjs`) la aplica antes de abrir el PR.

## Frontmatter obligatorio (YAML)

```yaml
---
title: "Título claro, específico, sin clickbait (máx. 70 caracteres)"
excerpt: "Resumen de 1-2 frases que invita a leer (120-200 caracteres)."
author: "Luciana"
date: "YYYY-MM-DD"
category: "Una de las categorías oficiales"
tags: ["3-5 etiquetas en minúscula"]
imageAlt: "Descripción de la imagen principal para lectores de pantalla"
metaTitle: "Title SEO (máx. 60 caracteres + marca)"
metaDescription: "Description SEO (120-160 caracteres, con intención de búsqueda)."
translationKey: "slug-en-ingles-para-enlazar-traducciones"
draft: true
---
```

Categorías oficiales: Pilates Clásico · Respiración · Conciencia corporal ·
Postura y movimiento · Historia del método · Vida junto al mar ·
Bienestar y estilo de vida · Pilates en Palma de Mallorca ·
Equipamiento clásico · Primeros pasos.

## Cuerpo

- 700–1.100 palabras. Tono cálido, preciso, sin relleno ni palabrería SEO.
- Estructura con `##` y `###`; mínimo 3 encabezados `##`.
- Mínimo 2 enlaces internos a páginas de la web (`/es/clase-de-prueba`,
  `/es/metodo-pilates-clasico`, `/es/el-estudio`, `/es/sesiones`) integrados
  con naturalidad.
- Cierre con CTA contextual hacia la clase de prueba (30 €) o WhatsApp.
- PROHIBIDO: afirmaciones médicas (curar, eliminar dolor, desintoxicar),
  testimonios inventados, precios distintos de 30 €, mencionar
  "Pilates Tania Tsiora", inventar títulos o certificaciones de Luciana.
- Datos verificables únicamente: Joseph Pilates e historia general del método
  sí; biografía de Luciana solo lo publicado en /sobre-luciana.
