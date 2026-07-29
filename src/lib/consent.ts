"use client";

/** Estado de consentimiento RGPD, persistido en localStorage. */
export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string | null;
};

const KEY = "cpl-consent-v1";

export const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  decidedAt: null,
};

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return defaultConsent;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultConsent;
    const parsed = JSON.parse(raw) as ConsentState;
    return { ...defaultConsent, ...parsed, necessary: true };
  } catch {
    return defaultConsent;
  }
}

export function writeConsent(state: Omit<ConsentState, "decidedAt">) {
  const value: ConsentState = { ...state, decidedAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(value));
  applyConsentMode(value);
  window.dispatchEvent(new CustomEvent("cpl-consent-changed", { detail: value }));
  return value;
}

/** Google Consent Mode v2: actualiza los flags si gtag está presente. */
export function applyConsentMode(state: ConsentState) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  });
}
