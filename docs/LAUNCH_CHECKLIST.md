# Checklist de lanzamiento

## Contenido y datos

- [ ] Todos los puntos de `CONTENT_TODO.md` resueltos o aceptados como pendientes.
- [ ] Fotografías reales en `public/images/` y `src` añadido a los ImagePlaceholder.
- [ ] Traducciones EN/SV/DE revisadas por hablantes competentes.
- [ ] Páginas legales revisadas por un profesional y sin marcas [PLACEHOLDER].
- [ ] Política de cancelación aprobada y sin marca [PENDIENTE DE APROBACIÓN].
- [ ] Duración de sesión confirmada (50/60) en `business.ts` y textos.

## Verificación técnica

- [ ] `npm run lint` sin errores.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run validate:content` sin errores.
- [ ] `npm run build` correcto.
- [ ] Las 4 versiones de idioma cargan y el selector conserva la ruta.
- [ ] Flujo completo de Stripe en modo test (pago → confirmación → referencia → WhatsApp).
- [ ] Página de pago cancelado accesible desde Stripe.
- [ ] Enlaces de WhatsApp abren con el mensaje correcto por origen.
- [ ] Formulario de contacto: validación, honeypot, envío real con proveedor configurado.
- [ ] `sitemap.xml` y `robots.txt` correctos en el dominio final.
- [ ] JSON-LD validado con https://validator.schema.org (LocalBusiness, Person, Service, FAQPage, BlogPosting, BreadcrumbList).
- [ ] Responsive verificado en móvil, tablet y escritorio.
- [ ] Auditoría Lighthouse: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95.
- [ ] Navegación completa por teclado y foco visible.
- [ ] `prefers-reduced-motion` respetado.

## Reglas de negocio

- [ ] Ningún precio distinto de 30 € visible públicamente.
- [ ] No aparece "Pilates Tania Tsiora" en ninguna parte.
- [ ] No hay testimonios inventados.
- [ ] No hay afirmaciones médicas (curar, eliminar dolor, desintoxicar…).
- [ ] La duración de sesión no se afirma públicamente hasta confirmarse.

## Analítica y marketing

- [ ] GTM/GA4 configurados y cargando SOLO tras consentimiento.
- [ ] Consent Mode v2 verificado (Tag Assistant).
- [ ] Conversión de Google Ads configurada (evento `purchase`).
- [ ] Landing de Ads revisada y enlazada desde la campaña.
- [ ] Google Business Profile creado y enlazado.

## Producción

- [ ] Dominio definitivo apuntando al hosting; `NEXT_PUBLIC_SITE_URL` actualizado.
- [ ] Certificado SSL activo.
- [ ] Claves de Stripe en modo live y webhook de producción.
- [ ] Secrets de GitHub (`ANTHROPIC_API_KEY`) configurados.
- [ ] Workflows de GitHub Actions activados y probados con `workflow_dispatch`.
