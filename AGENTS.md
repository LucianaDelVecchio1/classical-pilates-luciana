<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reglas del proyecto — Ser Classical Pilates

- **Identidad centralizada**: nombre, contacto, precios y duración viven en
  `src/config/business.ts`. Nunca hardcodear estos datos en componentes.
- **Único precio público: 30 €** (clase de prueba). Los demás precios NO
  viven en el repositorio (repo público): se comunican solo por WhatsApp.
- **Prohibido**: mencionar "Pilates Tania Tsiora"; inventar testimonios,
  certificaciones o direcciones; afirmaciones médicas (curar, eliminar dolor,
  desintoxicar); afirmar la duración de sesión (50/60 min sin confirmar).
- **i18n**: todo texto visible va en `messages/{es,en,sv,de}.json` (es es la
  fuente). Las rutas usan slugs localizados definidos en `src/i18n/routing.ts`;
  enlazar siempre con `Link` de `@/i18n/navigation` y claves internas
  (`/clase-de-prueba`), nunca con slugs traducidos.
- **Blog**: artículos MDX en `content/blog/<locale>/`; validar con
  `npm run validate:content` (plantilla en `docs/EDITORIAL_TEMPLATE.md`).
- **Analítica**: solo eventos de `src/lib/analytics.ts`, sin PII; GTM se carga
  únicamente tras consentimiento (RGPD).
- Antes de dar por terminado un cambio: `npm run lint && npm run typecheck && npm run build`.
