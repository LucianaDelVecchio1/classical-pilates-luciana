"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { track } from "@/lib/analytics";

/** Barra fija inferior en móvil: reservar prueba + WhatsApp. */
export function MobileBar() {
  const t = useTranslations("mobileBar");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-stone bg-ivory-soft md:hidden">
      <Link
        href="/clase-de-prueba"
        onClick={() => track("click_trial_cta", { origin: "mobile-bar" })}
        className="py-4 text-center text-sm uppercase tracking-[0.08em] text-ivory-soft bg-sea-deep"
      >
        {t("bookTrial")}
      </Link>
      <WhatsAppLink
        origin="general"
        className="py-4 text-center text-sm uppercase tracking-[0.08em] text-char hover:bg-sand"
      >
        WhatsApp
      </WhatsAppLink>
    </div>
  );
}
