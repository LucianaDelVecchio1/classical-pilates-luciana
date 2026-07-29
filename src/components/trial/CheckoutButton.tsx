"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@/lib/analytics";

/**
 * Inicia Stripe Checkout contra /api/checkout.
 * Previene peticiones duplicadas (doble clic) y muestra estados de
 * carga y error accesibles.
 */
export function CheckoutButton({ origin }: { origin: string }) {
  const t = useTranslations("trial");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const startCheckout = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    track("begin_checkout", { origin, value: 30, currency: "EUR" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, origin }),
      });
      if (!res.ok) throw new Error(`checkout_failed_${res.status}`);
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("checkout_no_url");
      window.location.assign(data.url);
    } catch {
      setError(t("checkoutError"));
      inFlight.current = false;
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="inline-block rounded-sm bg-sea-deep px-8 py-4 text-lg text-ivory-soft hover:bg-sea disabled:opacity-60"
      >
        {loading ? t("checkoutLoading") : t("cta")}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
