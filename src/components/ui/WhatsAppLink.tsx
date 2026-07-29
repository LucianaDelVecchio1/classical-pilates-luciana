"use client";

import { useTranslations } from "next-intl";
import { business, whatsappLink, type WhatsAppOrigin } from "@/config/business";
import { track } from "@/lib/analytics";

/**
 * Enlace a WhatsApp Business con mensaje prellenado según el origen.
 * El identificador de origen viaja al final del mensaje (sin datos personales).
 */
export function WhatsAppLink({
  origin,
  children,
  className,
  reference,
}: {
  origin: WhatsAppOrigin;
  children: React.ReactNode;
  className?: string;
  /** Referencia de compra (solo para origin="trial-purchased"). */
  reference?: string;
}) {
  const t = useTranslations("whatsapp");
  let message = t(`messages.${origin}`);
  if (reference) message = message.replace("[ID]", reference);
  message += ` [web:${origin}]`;

  return (
    <a
      href={whatsappLink(origin, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("click_whatsapp", { origin })}
      className={className}
      aria-label={`WhatsApp ${business.whatsappDisplay}`}
    >
      {children}
    </a>
  );
}
