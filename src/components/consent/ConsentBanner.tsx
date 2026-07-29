"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { readConsent, writeConsent } from "@/lib/consent";

/**
 * Banner de consentimiento RGPD: aceptar, rechazar y configurar tienen el
 * mismo peso visual (sin patrones manipulativos). El estado se puede cambiar
 * después desde el enlace "Cookies" del footer (evento cpl-open-consent).
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Lectura inicial de localStorage tras el montaje: el servidor no puede
    // saber si el visitante ya decidió, así que el banner aparece en cliente.
    const current = readConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnalytics(current.analytics);
    setMarketing(current.marketing);
    if (!current.decidedAt) setVisible(true);
    const open = () => {
      const c = readConsent();
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
      setConfiguring(true);
      setVisible(true);
    };
    window.addEventListener("cpl-open-consent", open);
    return () => window.removeEventListener("cpl-open-consent", open);
  }, []);

  if (!visible) return null;

  const decide = (a: boolean, m: boolean) => {
    writeConsent({ necessary: true, analytics: a, marketing: m });
    setVisible(false);
    setConfiguring(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-16 md:bottom-0 z-50 border-t border-stone bg-ivory-soft p-4 md:p-6 shadow-[0_-4px_24px_rgba(50,53,47,0.08)]"
    >
      <div className="mx-auto max-w-3xl">
        <h2 id="consent-title" className="font-display text-xl">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-char-soft max-w-prose">{t("body")}</p>

        {configuring && (
          <fieldset className="mt-4 space-y-3 border-0 p-0">
            <legend className="sr-only">{t("configure")}</legend>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <strong>{t("necessaryLabel")}</strong> — {t("necessaryDesc")}
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>{t("analyticsLabel")}</strong> — {t("analyticsDesc")}
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>{t("marketingLabel")}</strong> — {t("marketingDesc")}
              </span>
            </label>
          </fieldset>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => decide(true, true)}
            className="rounded-sm border border-char bg-char px-5 py-2.5 text-sm text-ivory hover:bg-char-soft"
          >
            {t("acceptAll")}
          </button>
          <button
            type="button"
            onClick={() => decide(false, false)}
            className="rounded-sm border border-char px-5 py-2.5 text-sm hover:bg-sand"
          >
            {t("rejectAll")}
          </button>
          {configuring ? (
            <button
              type="button"
              onClick={() => decide(analytics, marketing)}
              className="rounded-sm border border-char px-5 py-2.5 text-sm hover:bg-sand"
            >
              {t("savePreferences")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfiguring(true)}
              className="rounded-sm border border-char px-5 py-2.5 text-sm hover:bg-sand"
            >
              {t("configure")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
