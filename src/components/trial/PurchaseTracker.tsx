"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Dispara purchase en la página de confirmación (sin datos personales). */
export function PurchaseTracker() {
  useEffect(() => {
    track("purchase", { value: 30, currency: "EUR", item: "trial-class" });
  }, []);
  return null;
}
