# Ser Classical Pilates — web

Web del estudio boutique de Pilates Clásico de Luciana en Palma de Mallorca.
Multilingüe (es/en/sv/de), orientada a conversión (clase de prueba de 30 €),
con blog SEO y automatización editorial.

## Stack

- **Next.js 16** (App Router) + **TypeScript estricto**
- **Tailwind CSS 4** (tokens en `src/app/globals.css`)
- **next-intl 4** — rutas localizadas con slugs traducidos (`/es/clase-de-prueba`, `/en/trial-class`…)
- **MDX** (`next-mdx-remote`) — blog en `content/blog/<locale>/`
- **Stripe Checkout** — pago de la clase de prueba
- **zod** — validación de entradas en API routes

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar variables
npm run dev                  # http://localhost:3000 → redirige a /es
```

Comprobaciones:

```bash
npm run lint
npm run typecheck
npm run validate:content   # valida los artículos del blog
npm run build
```

## Estructura clave

| Ruta | Qué es |
|---|---|
| `src/config/business.ts` | **Única fuente de identidad**: nombre, WhatsApp, email, IG, precios, duración de sesión. Cambiar aquí actualiza toda la web. |
| `src/i18n/routing.ts` | Idiomas y slugs localizados de todas las rutas. |
| `messages/{es,en,sv,de}.json` | Todo el contenido de la interfaz por idioma. |
| `content/blog/es/*.mdx` | Artículos del blog (frontmatter validado). |
| `src/components/brand/Wordmark.tsx` | Wordmark provisional "Horizonte" + sello "L" (reemplazables). |
| `src/app/api/checkout` | Crea la sesión de Stripe Checkout (rate-limited). |
| `src/app/api/webhooks/stripe` | Webhook con verificación de firma. |
| `src/app/api/contact` | Formulario con validación de servidor + honeypot. |
| `scripts/` | Automatización editorial y auditoría SEO. |
| `docs/` | Plantilla editorial, Instagram, checklist de lanzamiento. |

## Stripe (clase de prueba, 30 €)

1. Crear cuenta de Stripe (a nombre de Luciana) y un producto **Clase de prueba**
   con precio único de **30 €**.
2. Copiar en `.env.local`: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
   `STRIPE_TRIAL_PRICE_ID`.
3. Configurar el webhook (`checkout.session.completed`) hacia
   `https://<dominio>/api/webhooks/stripe` y copiar `STRIPE_WEBHOOK_SECRET`.
4. Probar en modo test: tarjeta `4242 4242 4242 4242`.

El flujo genera una referencia legible (`CPL-XXXXXX`) que el cliente usa para
coordinar el horario por WhatsApp. Nunca se almacenan datos de tarjeta.

## Formulario de contacto

Sin proveedor configurado, el formulario valida y responde pero **no envía
email** (queda registrado en logs del servidor). Para activar el envío:

- **Resend**: definir `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
- **SMTP corporativo**: sustituir el bloque de Resend en
  `src/app/api/contact/route.ts` por `nodemailer` con las credenciales SMTP.

## Analítica y RGPD

- Banner de consentimiento propio (aceptar / rechazar / configurar con igual peso).
- **Consent Mode v2** con defaults en `denied`; GTM solo se carga tras
  consentimiento de analítica o marketing (`NEXT_PUBLIC_GTM_ID`).
- GA4, Google Ads y el futuro Meta Pixel se configuran **dentro de GTM**,
  condicionados a los flags de Consent Mode.
- Eventos emitidos a `dataLayer`: `view_trial_offer`, `click_trial_cta`,
  `begin_checkout`, `purchase`, `click_whatsapp`, `submit_lead_form`,
  `view_contact`, `select_language`, `read_blog_article` (sin PII).
- Landing para Google Ads: `/es/pilates-clasico-palma-clase-de-prueba`
  (noindex, navegación reducida).

## Blog y automatización editorial

- Artículos MDX con frontmatter validado (`npm run validate:content`).
- **Workflow semanal** (`.github/workflows/editorial-draft.yml`): propone tema
  → genera borrador con la API de Anthropic → valida → **abre un PR** con
  etiqueta `editorial-review`. No publica nunca directamente
  (`draft: true`; `AUTO_PUBLISH_BLOG=false`).
- Secret necesario en GitHub: `ANTHROPIC_API_KEY`.
- Frecuencia: semanal por defecto; cambiar el cron del workflow si el cliente
  confirma "cada 3 días".
- Brief de Instagram por artículo: `npm run instagram:brief content/blog/es/<slug>.mdx`.

## Auditoría SEO semanal

`.github/workflows/seo-audit.yml` construye el sitio, ejecuta
`scripts/seo-audit.mjs` (metadatos, canonicals, hreflang, enlaces rotos,
alt, JSON-LD, h1, artículos antiguos) y genera un informe Markdown en
`reports/`. Si hay problemas de prioridad ALTA, abre una issue.

Manual: `npm run build && npm run start` y en otra terminal
`npm run seo:audit http://localhost:3000`.

## Fotografías

Placeholders elegantes con proporciones definitivas. Para reemplazar:
guardar las fotos en `public/images/<nombre>.jpg` (nombres en
`CONTENT_TODO.md`) y añadir la prop `src="/images/<nombre>.jpg"` en el
`ImagePlaceholder` correspondiente — el diseño no cambia.

## Despliegue

Pensado para Vercel (o cualquier host Node):

1. Importar el repositorio y definir las variables de `.env.example`.
2. `NEXT_PUBLIC_SITE_URL` = dominio definitivo (afecta a canonicals, sitemap y OG).
3. Verificar `https://<dominio>/sitemap.xml` y `robots.txt`.
4. Revisar `docs/LAUNCH_CHECKLIST.md` antes de publicar.

## Pendiente de intervención humana

Ver **`CONTENT_TODO.md`** (datos del cliente) y `docs/LAUNCH_CHECKLIST.md`
(verificación de lanzamiento).
