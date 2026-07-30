# Estrategia de captación — Classical Pilates Luciana

**Google Ads · Meta Ads · SEO** — Palma de Mallorca · Julio 2026
Preparada para Matías (dirección) y Luciana (titular de las cuentas).

---

## 1. Punto de partida y objetivo

**El negocio:** sesiones privadas e íntimas (individual/dúo), capacidad limitada por agenda de una sola instructora. No necesitamos volumen masivo: necesitamos **llenar una agenda** con clientes de calidad que repitan.

**La economía del cliente (interna, no publicar):**
- Puerta de entrada: clase de prueba a 30 €.
- Un cliente recurrente típico (bono privado de 8: 200 €/mes) vale **2.400 €/año**.
- Con retención media de 6+ meses, **pagar hasta 30-50 € por conseguir una clase de prueba es rentable** si 1 de cada 2-3 pruebas se convierte en cliente. Ese es nuestro CPA objetivo inicial: **≤ 35 €** por prueba vendida (o por conversación de WhatsApp cualificada mientras Stripe no esté activo).

**Objetivo a 90 días:** 15-25 clases de prueba/mes entre todos los canales, con un 40-50 % de conversión a cliente recurrente → agenda estable de 12-18 clientes fijos.

**Aprendizaje que importamos de la cuenta de SOLUXE:** en Mallorca **convierte el WhatsApp, no los formularios**. Toda la estrategia pone el clic a WhatsApp como conversión secundaria de primera clase, y la web ya está construida así (mensajes prellenados por origen + eventos medidos).

---

## 2. Medición primero (semana 0)

Todo lo de abajo es inútil sin medir. La web **ya emite** estos eventos a `dataLayer`, condicionados al consentimiento RGPD (Consent Mode v2 configurado):

`view_trial_offer` · `click_trial_cta` · `begin_checkout` · `purchase` · `click_whatsapp` · `submit_lead_form` · `view_contact` · `select_language` · `read_blog_article`

**Falta solo crear las cuentas y pegar 4 IDs en Vercel** (variables de entorno):

| Herramienta | Variable | Quién la crea |
|---|---|---|
| Google Tag Manager | `NEXT_PUBLIC_GTM_ID` | Matías (gratis, 10 min) |
| Google Analytics 4 | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Matías (con el email hello@) |
| Google Ads | `NEXT_PUBLIC_GOOGLE_ADS_ID` + label | Luciana (paso 3 de su guía) |
| Meta Pixel | `NEXT_PUBLIC_META_PIXEL_ID` | Más adelante (fase Meta) |

**Conversiones a configurar en Google Ads:**
- **Principal: `purchase`** (30 €) — cuando Stripe esté activo.
- **Secundaria: `click_whatsapp`** con origen `trial`/`pricing` — activa desde el día 1 (aprendizaje SOLUXE).
- No usar `submit_lead_form` como conversión de puja (histórico SOLUXE: no convierte).

---

## 3. SEO — el activo a largo plazo

### 3.1 Lo que ya está hecho (ventaja de salida)

- Web multilingüe es/en/sv/de con slugs localizados, hreflang, sitemap, canonicals.
- JSON-LD completo: LocalBusiness, Person, Service, FAQPage, BlogPosting.
- Blog con 3 artículos de calidad + automatización semanal (borrador → PR → revisión humana).
- Auditoría SEO técnica automática semanal con informe.
- Core Web Vitals de salida excelentes (Next.js estático + imágenes optimizadas).

### 3.2 Prioridad nº 1: Google Business Profile (SEO local)

El 80 % del SEO de un negocio local es el mapa. En cuanto Luciana cree el perfil (paso 4 de su guía):

1. Categoría principal: **Estudio de pilates**. Secundarias: Gimnasio, Instructor de pilates.
2. Nombre exacto: `Classical Pilates Luciana` (idéntico a la web — consistencia NAP).
3. Fotos: las mismas 13 de la web + 2-3 nuevas del exterior/entrada.
4. Servicios con precio solo en "Clase de prueba: 30 €"; resto "consultar".
5. Botón de mensajes → WhatsApp. Horarios reales.
6. **Reseñas: el motor.** Rutina: tras la 3ª-4ª sesión de cada cliente contento, Luciana envía por WhatsApp el enlace directo de reseña. Objetivo: 2-4 reseñas/mes constantes (mejor que 20 de golpe). Responder todas.
7. Publicar 1 novedad/mes en el perfil (foto + 2 líneas; puedo generarlas desde el blog).

### 3.3 Contenido (ya automatizado, falta activarlo)

- Activar el workflow editorial (falta el scope `workflow` en tu token de GitHub + secret `ANTHROPIC_API_KEY`): 1 artículo/semana → borrador → lo revisas → publicar.
- Clusters ya definidos: Pilates Clásico, Respiración, Palma de Mallorca, Equipamiento, Primeros pasos, Postura.
- Regla de oro: cada artículo ataca UNA búsqueda concreta y enlaza a la clase de prueba.
- A 3-6 meses: traducir los 4-5 mejores artículos a EN y DE (revisados por nativos).

### 3.4 Autoridad local (manual, 1-2 acciones/mes)

- Altas en directorios: Google Maps (vía GBP), Bing Places, Apple Maps, Páginas Amarillas, directorios de wellness de Mallorca.
- 2-3 colaboraciones locales: hoteles boutique cercanos, fisioterapeutas, nutricionistas, Mallorca Magazin / abcMallorca (público DE/EN) — un artículo invitado o mención = enlace local valioso.
- Sinergia SOLUXE: mención cruzada desde soluxe-estates.com (audiencia premium alemana/inglesa en Mallorca) si encaja editorialmente.

**KPI SEO:** posiciones para «pilates clásico palma», «classical pilates palma», «pilates reformer palma» + llamadas/rutas/webs desde GBP. Revisión mensual (la auditoría automática ya vigila lo técnico).

---

## 4. Google Ads — captación activa

### 4.1 Principios

- Cuenta de Luciana (su tarjeta), tú administrador — igual que SOLUXE.
- **Presupuesto inicial: 10-15 €/día (~350 €/mes).** Mercado pequeño y capacidad limitada: mejor poco y bien que PMax quemando presupuesto.
- Solo Búsqueda al inicio. Nada de Display/PMax hasta tener 30+ conversiones registradas.
- Landing dedicada ya construida: `/es/pilates-clasico-palma-clase-de-prueba` (sin navegación, FAQ, CTA fijo). Cada idioma tiene la suya.

### 4.2 Estructura de campañas

**Campaña 1 — Búsqueda ES "Pilates Palma"** (60 % del presupuesto)
- Grupo "pilates clásico": `pilates clasico palma`, `pilates clasico mallorca`, `estudio pilates clasico palma` — concordancia de frase.
- Grupo "pilates máquina": `pilates reformer palma`, `pilates maquina palma`, `pilates camilla palma`.
- Grupo "pilates privado": `clases particulares pilates palma`, `pilates privado palma`, `pilates individual palma`.
- Anuncios: precio de la prueba visible («Primera clase 30 €») para filtrar curiosos, «frente al mar», «sesiones 1:1». CTA doble: reservar online / WhatsApp.

**Campaña 2 — Búsqueda EN+DE residentes/expats** (30 %)
- EN: `classical pilates palma`, `private pilates palma`, `reformer pilates palma mallorca`.
- DE: `pilates palma de mallorca`, `privatstunden pilates mallorca`, `reformer pilates palma`.
- Landing en su idioma. Aprendizaje SOLUXE: el segmento DE estaba desatendido — aquí entra desde el día 1.

**Campaña 3 — Marca** (10 %, 1-2 €/día)
- `classical pilates luciana`, `pilates luciana palma`. Barata, protege la marca cuando el boca-oreja y el IG crezcan.

**Negativas desde el día 1:** `gratis`, `barato`, `grupo`, `formación`, `curso instructor`, `empleo`, `trabajo`, `máquina comprar`, `segunda mano`, `online`, `vídeo`, `youtube`.

**Segmentación:** radio 15 km alrededor del estudio (Palma + Calvià/Llucmajor según ubicación exacta), "presencia en" (no "interés en"). Horario: 6:00-22:00.

### 4.3 Fases

| Fase | Cuándo | Conversión de puja | Puja |
|---|---|---|---|
| 1. Arranque | Ya (sin Stripe) | `click_whatsapp` (trial/pricing) | CPC manual mejorado |
| 2. Venta online | Stripe activo | `purchase` (30 €) + WhatsApp como secundaria | Maximizar conversiones |
| 3. Optimización | 30+ conversiones | `purchase` | tCPA ≤ 35 € |

**Rutina de gestión:** revisión cada 3 días las primeras 2 semanas (términos de búsqueda → negativas), luego semanal. Puedo montarte la misma rutina automatizada que tienes para SOLUXE (`soluxe-google-ads-optimizer`) adaptada a esta cuenta.

---

## 5. Meta Ads (Instagram) — la vitrina

### 5.1 Por qué Meta aquí sí

El pilates es visual y el material existe: los reels de Luciana practicando (los que me pasaste) son exactamente el creativo que funciona en este sector — real, sin producción, aspiracional. En Meta no captamos «demanda» (eso es Google): **creamos deseo y reconocimiento local**.

### 5.2 Fases

**Fase 0 — Orgánico (ya, gratis):**
- Convertir @pilatesclasicaluciana en cuenta profesional + crear página de Facebook (paso 5 de la guía de Luciana).
- Enlace a la web en bio + botón de WhatsApp.
- Cadencia: 2-3 reels/semana (Luciana ya los produce) + el brief de Instagram que genera mi script por cada artículo del blog.

**Fase 1 — Primeras campañas (tras crear la cuenta de anuncios, ~150-200 €/mes):**
- Objetivo **Interacción → WhatsApp** (clic a chat con mensaje prellenado): el formato que mejor casa con lo aprendido en SOLUXE.
- Público: radio 15 km Palma, 28-60 años, sin afinar intereses al inicio (el creativo segmenta solo).
- Creativos: 3-4 reels de práctica + 1 estático del estudio con el mar + oferta «Primera clase 30 €».
- Idiomas: ES + EN (Advantage+ traduce mal el DE — el DE mejor con adset propio y texto revisado).

**Fase 2 — Conversiones (con Stripe + píxel + 2-3 meses de datos):**
- Píxel (`NEXT_PUBLIC_META_PIXEL_ID` — la web ya lo carga condicionado a consentimiento) + Conversion API.
- Campaña de conversiones a `purchase` con público similar (lookalike) de compradores.
- Retargeting: visitantes de /clase-de-prueba que no compraron (ventana 14 días).

**Regla:** Meta nunca debe superar a Google en presupuesto hasta que demuestre CPA comparable. Google captura intención; Meta la crea — y crear intención es más caro.

---

## 6. Presupuesto y calendario 90 días

| Mes | Google Ads | Meta Ads | Acciones clave |
|---|---|---|---|
| **Mes 1** | 350 € | 0 € (orgánico) | GTM+GA4 ya · Ads con conversión WhatsApp · GBP creado · workflow blog activo |
| **Mes 2** | 350-450 € | 150 € | Stripe activo → conversión `purchase` · primeras campañas Meta WhatsApp · 4-6 reseñas GBP |
| **Mes 3** | 450 € | 200 € | tCPA en Google · píxel + retargeting Meta · revisión de keywords/negativas consolidada |

**Total mes 3: ~650 €/mes.** Con CPA de 35 € → ~18 pruebas/mes → con 45 % de conversión, **8 clientes nuevos recurrentes/mes** (1.600 €/mes de ingreso recurrente añadido). La agenda de Luciana se llena entre el mes 2 y el 4; entonces se recorta presupuesto y se vive de SEO + reseñas + boca-oreja, reactivando Ads solo cuando haya huecos.

**KPIs del panel mensual:** coste/clase de prueba por canal · % prueba→cliente · conversaciones WhatsApp por origen · posiciones SEO top-3 keywords · reseñas GBP acumuladas.

---

## 7. Qué necesito de cada uno

**De Luciana (con su email hello@):**
1. ⚠ Clic al email de validación del dominio (antes del 13/08 — obligatorio).
2. Stripe (próxima reunión — ya acordado).
3. Google Business Profile (15 min, paso 4 de su guía) — **se puede hacer YA, no depende de Stripe**.
4. Cuenta de Google Ads con su tarjeta + invitarte como admin (paso 3).
5. Instagram a cuenta profesional + página de Facebook (paso 5).
6. Confirmar ubicación exacta del estudio (para el radio de las campañas y GBP).

**De Matías:**
1. Crear GTM + GA4 con acceso de hello@ y pasarme los IDs → los configuro en Vercel.
2. Scope `workflow` en tu token de GitHub → activo blog automático + auditoría SEO.
3. Decidir fecha de arranque de Ads (recomendación: no esperar a Stripe — arrancar con conversión WhatsApp ya).

**Mío (en cuanto haya IDs):** configurar variables en Vercel, montar el contenedor GTM (GA4 + Ads + Consent Mode), estructura completa de campañas lista para importar, rutina de optimización cada 3 días, y el panel mensual de KPIs.
