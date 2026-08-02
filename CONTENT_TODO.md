# CONTENT_TODO — Datos pendientes del cliente

Lista de todo lo que requiere confirmación o material de Luciana / Matías
antes del lanzamiento. Cada punto indica dónde se aplica en el código.

## Identidad y dominio

- [x] **Nombre definitivo**: Ser Classical Pilates (rebrand confirmado 2026-08-02; antes Classical Pilates Luciana). → `src/config/business.ts`
- [ ] **Dominio definitivo**: candidato `classicalpilatesluciana.com` (verificar disponibilidad y registrar). → `NEXT_PUBLIC_SITE_URL` y `src/config/business.ts`
- [ ] **Logotipo definitivo**: la web usa el wordmark provisional "Horizonte". → `src/components/brand/Wordmark.tsx`

## Estudio

- [ ] **Dirección exacta del estudio** (calle, CP). → `src/config/business.ts` (address)
- [ ] **Ubicación para el mapa** (coordenadas). → `src/config/business.ts` (address.geo)
- [ ] **Lista exacta de aparatos** (confirmados: Reformer y Barrel). → `src/config/business.ts` (confirmedEquipment) y textos de El Estudio / FAQ
- [ ] **Horarios de apertura / disponibilidad**.
- [ ] **Idiomas que habla Luciana en las sesiones**. → respuesta de la FAQ "¿En qué idiomas...?" en `messages/*.json`

## Operativa

- [ ] **Duración definitiva de la sesión: 50 o 60 minutos** (minuta dice 50, Luciana dice 60). → `src/config/business.ts` (sessionDurationMinutes) y FAQ/textos
- [ ] **Política definitiva de cancelación** (propuesta de 1 hora pendiente de aprobación). → `messages/*.json` (legal.terms) — marcada [PENDIENTE DE APROBACIÓN]
- [ ] **Teléfono definitivo de WhatsApp Business** (provisional +34 637 037 637). → `src/config/business.ts`
- [ ] **Email corporativo** (provisional Lucianadv.07@gmail.com). → `src/config/business.ts`

## Material

- [x] **Fotografías del estudio** (2026-07-29): 6 fotos reales en `public/images/` conectadas vía `src/config/images.ts` (`luciana-hero`, `studio-sea-view`, `studio-reformer`, `studio-atmosphere`, `classical-pilates-session`, `movement-detail`).
- [ ] **Fotos pendientes**: retrato profesional de Luciana (`luciana-portrait`) y foto dedicada del Barrel (`studio-barrel`) — siguen con placeholder. Al recibirlas: guardar en `public/images/` y añadir la entrada en `src/config/images.ts`.
- [ ] **Testimonios auténticos con autorización escrita** → crear componente Testimonials (hay hueco marcado en la portada).

## Pagos y reservas

- [ ] **Cuenta de Stripe** (a nombre de Luciana) + producto "Clase de prueba 30 €" → claves en `.env` (`STRIPE_*`).
- [ ] **Webhook de Stripe** configurado hacia `/api/webhooks/stripe`.
- [ ] **Calendario o plataforma de reservas** (Cal.com / Calendly / Google Calendar) → `NEXT_PUBLIC_BOOKING_EMBED_URL`.

## Legal y fiscal

- [ ] **Información fiscal para facturación** (razón social, NIF, domicilio). → placeholders en `messages/*.json` (legal.*)
- [ ] **Revisión de las 4 páginas legales por un profesional** (ahora son plantillas marcadas como provisionales).

## Marketing

- [ ] **Google Business Profile** (crear y enlazar).
- [ ] **Cuenta de Google Ads a nombre de Luciana** (con su tarjeta; acceso de gestión para Matías). → IDs en `.env`
- [ ] **IDs de GTM / GA4 / Google Ads** → `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`
- [ ] **Configuración futura de Meta** (píxel + Conversion API). → `NEXT_PUBLIC_META_PIXEL_ID`
- [ ] **Cuenta profesional de Instagram + página de Facebook + app de Meta** para publicación automática (ver `docs/INSTAGRAM.md`).

## Contenido

- [ ] **Revisión profesional de las traducciones EN/SV/DE** por hablantes competentes antes de producción.
- [ ] **Frecuencia definitiva del blog**: semanal (actual) o cada 3 días. → cron en `.github/workflows/editorial-draft.yml`
- [ ] **Email para recibir el formulario de contacto** + proveedor (Resend o SMTP). → `RESEND_API_KEY`, `CONTACT_TO_EMAIL`
