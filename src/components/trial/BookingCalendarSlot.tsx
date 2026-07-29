import { getTranslations } from "next-intl/server";

/**
 * Componente desacoplado para el futuro calendario de reservas
 * (Cal.com, Calendly o Google Calendar).
 *
 * Mientras no exista una cuenta conectada, muestra un texto honesto:
 * el horario se coordina por WhatsApp. NO simula disponibilidad.
 *
 * Para activar Cal.com más adelante:
 * 1. Definir NEXT_PUBLIC_BOOKING_EMBED_URL en .env (URL del embed).
 * 2. Este componente renderizará el iframe automáticamente.
 */
export async function BookingCalendarSlot() {
  const t = await getTranslations("trial");
  const embedUrl = process.env.NEXT_PUBLIC_BOOKING_EMBED_URL;

  if (embedUrl) {
    return (
      <div className="mt-8">
        <h2 className="font-display text-2xl">{t("scheduleTitle")}</h2>
        <iframe
          src={embedUrl}
          title={t("scheduleTitle")}
          className="mt-4 h-[640px] w-full rounded-sm border border-stone/60"
        />
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-sm border border-stone/60 bg-sand/30 p-6">
      <h2 className="font-display text-2xl">{t("scheduleTitle")}</h2>
      <p className="mt-2 max-w-prose text-char-soft">{t("scheduleText")}</p>
    </div>
  );
}
