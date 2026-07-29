import { NextResponse } from "next/server";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { business } from "@/config/business";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Recibe el formulario de contacto con validación de servidor,
 * honeypot antispam y rate limiting.
 *
 * ENVÍO DE EMAIL: no se envían correos reales hasta configurar un
 * proveedor. Para activar Resend:
 * 1. Definir RESEND_API_KEY y CONTACT_TO_EMAIL en el entorno.
 * 2. El endpoint enviará el mensaje automáticamente.
 * Alternativa SMTP: ver README (sección "Formulario de contacto").
 */

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(200),
  preference: z.enum(["email", "phone"]).default("email"),
  message: z.string().trim().min(1).max(4000),
  consent: z.literal(true),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot: debe llegar vacío
  locale: z.enum(routing.locales).default("es"),
});

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Honeypot relleno → responder 200 sin hacer nada (no dar pistas al bot).
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? business.email;

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "web@localhost",
          to: [toEmail],
          subject: `Nuevo mensaje web de ${body.name}`,
          text: [
            `Nombre: ${body.name}`,
            `Contacto: ${body.contact}`,
            `Preferencia: ${body.preference}`,
            `Idioma: ${body.locale}`,
            "",
            body.message,
          ].join("\n"),
        }),
      });
      if (!res.ok) throw new Error(`resend_${res.status}`);
    } catch (err) {
      console.error("Error enviando email de contacto:", err instanceof Error ? err.message : err);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } else {
    // Proveedor de email pendiente: registrar recepción (sin volcar el mensaje).
    console.log(`Mensaje de contacto recibido (${body.locale}); email no configurado aún.`);
  }

  return NextResponse.json({ ok: true });
}
