import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { business } from "@/config/business";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Crea una sesión de Stripe Checkout para la clase de prueba (30 €).
 * Requiere STRIPE_SECRET_KEY y STRIPE_TRIAL_PRICE_ID en el entorno.
 * Nunca se manejan datos de tarjeta en esta aplicación.
 */

const bodySchema = z.object({
  locale: z.enum(routing.locales),
  origin: z.string().max(64).optional(),
});

// Idiomas de la pasarela de Stripe correspondientes a los de la web.
const STRIPE_LOCALES: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  es: "es",
  en: "en",
  sv: "sv",
  de: "de",
};

export async function POST(req: Request) {
  if (!rateLimit(`checkout:${clientIp(req)}`, { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_TRIAL_PRICE_ID;
  if (!secretKey || !priceId) {
    // Configuración pendiente: no exponer detalles internos al cliente.
    console.error("Stripe no configurado: faltan STRIPE_SECRET_KEY o STRIPE_TRIAL_PRICE_ID");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const successPath = getPathname({ locale: body.locale, href: "/pago-confirmado" });
  const cancelPath = getPathname({ locale: body.locale, href: "/pago-cancelado" });

  // Referencia legible que el cliente usará para coordinar por WhatsApp.
  const reference = generateReference();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: STRIPE_LOCALES[body.locale] ?? "auto",
      client_reference_id: reference,
      metadata: {
        product: "trial-class",
        reference,
        source_origin: body.origin ?? "unknown",
        site_locale: body.locale,
      },
      success_url: `${business.url}${successPath}?ref=${reference}`,
      cancel_url: `${business.url}${cancelPath}`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creando la sesión de Checkout:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
  }
}

/** Referencia corta legible para coordinar por WhatsApp. */
function generateReference(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let ref = "CPL-";
  for (let i = 0; i < 6; i++) {
    ref += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return ref;
}
