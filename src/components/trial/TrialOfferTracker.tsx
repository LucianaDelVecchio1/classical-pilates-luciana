"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Dispara view_trial_offer al mostrar la oferta de la clase de prueba. */
export function TrialOfferTracker({ origin }: { origin: string }) {
  useEffect(() => {
    track("view_trial_offer", { origin });
  }, [origin]);
  return null;
}
