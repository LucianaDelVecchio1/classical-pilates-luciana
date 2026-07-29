# Instagram — integración y publicación

Cuenta actual: [@pilatesclasicaluciana](https://www.instagram.com/pilatesclasicaluciana/)
(nombre de pantalla: **Classical Pilates**).

## Lo que la web ya hace

- Enlace visible a Instagram en el footer y la página de contacto.
- Open Graph y Twitter Cards en todos los artículos (compartir con buena previsualización).
- Botones de copiar enlace / compartir nativo en los artículos (Web Share API cuando el navegador la soporta).
- Script `scripts/editorial/instagram-brief.mjs` que genera un brief de post
  (resumen, caption, CTA, hashtags, brief de imagen) a partir de un artículo aprobado.

## Lo que NO se hace (y por qué)

- **No hay scraping de Instagram** (contra los términos de uso y frágil).
- **No hay publicación automática**: requiere permisos oficiales (abajo).
- El componente de "publicaciones recientes" queda pendiente de una
  integración oficial (Instagram Basic Display está descontinuado; usar
  la Graph API con cuenta profesional).

## Requisitos para publicar automáticamente (futuro)

1. Convertir la cuenta a **cuenta profesional** (Business o Creator).
2. Vincular una **página de Facebook** a la cuenta.
3. Crear una **aplicación en Meta for Developers**.
4. Solicitar permisos de la **Instagram Graph API**:
   `instagram_basic`, `instagram_content_publish`, `pages_show_list`.
5. Pasar la **App Review** de Meta cuando la app salga de modo desarrollo.
6. Almacenar los tokens de acceso de forma segura (secrets del repositorio
   o gestor de secretos del hosting; nunca en el código).
7. Renovar los tokens de larga duración (~60 días) de forma programada.

Hasta completar esos pasos, el flujo es: artículo aprobado → generar brief
con el script → publicar manualmente desde la app de Instagram.
