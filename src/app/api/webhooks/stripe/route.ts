import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Webhook de Stripe con verificación de firma.
 * Configurar en el dashboard de Stripe apuntando a /api/webhooks/stripe
 * con el evento checkout.session.completed, y definir STRIPE_WEBHOOK_SECRET.
 *
 * Aquí es donde se conectará en el futuro el envío de email de
 * confirmación o el registro de la reserva en un calendario.
 */
export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    console.error("Webhook de Stripe no configurado");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    console.error(
      "Firma de webhook inválida:",
      err instanceof Error ? err.message : "unknown",
    );
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // Registro sin datos personales: solo referencia y estado.
      console.log(
        `Clase de prueba pagada. Referencia: ${session.client_reference_id ?? "n/a"}, estado: ${session.payment_status}`,
      );
      // TODO: cuando exista proveedor de email (Resend/SMTP), enviar
      // confirmación aquí. Cuando exista calendario, crear la reserva.
      break;
    }
    case "checkout.session.expired":
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
