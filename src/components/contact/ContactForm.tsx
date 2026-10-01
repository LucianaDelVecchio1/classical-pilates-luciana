"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/config/business";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Formulario de contacto con validación en cliente y honeypot antispam.
 * No envía email: al enviarlo abre WhatsApp con el mensaje ya escrito
 * (decisión 2026-10-01; todo el contacto de la web va por WhatsApp).
 */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    const clientErrors: Record<string, string> = {};
    if (!String(data.get("name") ?? "").trim()) clientErrors.name = t("validationName");
    if (!String(data.get("contact") ?? "").trim())
      clientErrors.contact = t("validationContact");
    if (!String(data.get("message") ?? "").trim())
      clientErrors.message = t("validationMessage");
    if (!data.get("consent")) clientErrors.consent = t("validationConsent");
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    // Honeypot relleno → es un bot: no abrir nada.
    if (String(data.get("website") ?? "")) return;

    // El formulario no envía email: abre WhatsApp con el mensaje ya escrito,
    // igual que el resto de contactos de la web. Se abre de forma síncrona
    // dentro del gesto del usuario para que el navegador no lo bloquee.
    const text = [
      `${String(data.get("name")).trim()}:`,
      String(data.get("message")).trim(),
      "",
      `${t("contactField")}: ${String(data.get("contact")).trim()}`,
    ].join("\n");
    const url = whatsappLink("general", `${text}\n[web:form-${locale}]`);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;

    setStatus("success");
    track("submit_lead_form", { origin: "contact-page" });
    form.reset();
  };

  if (status === "success") {
    return (
      <p role="status" className="rounded-sm border border-olive bg-olive/10 p-5">
        {t("success")}
      </p>
    );
  }

  const fieldCls =
    "mt-1.5 w-full rounded-sm border border-stone bg-ivory-soft px-3.5 py-2.5";
  const errCls = "mt-1 text-sm text-red-800";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="cf-name" className="font-medium">
          {t("name")}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "cf-name-error" : undefined}
          className={fieldCls}
        />
        {errors.name && (
          <p id="cf-name-error" role="alert" className={errCls}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cf-contact" className="font-medium">
          {t("contactField")}
        </label>
        <input
          id="cf-contact"
          name="contact"
          type="text"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.contact)}
          aria-describedby={errors.contact ? "cf-contact-error" : undefined}
          className={fieldCls}
        />
        {errors.contact && (
          <p id="cf-contact-error" role="alert" className={errCls}>
            {errors.contact}
          </p>
        )}
      </div>

      <fieldset className="border-0 p-0">
        <legend className="font-medium">{t("preference")}</legend>
        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="preference" value="email" defaultChecked />
            {t("preferenceEmail")}
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="preference" value="phone" />
            {t("preferencePhone")}
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="cf-message" className="font-medium">
          {t("message")}
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
          className={fieldCls}
        />
        {errors.message && (
          <p id="cf-message-error" role="alert" className={errCls}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: oculto para humanos, los bots suelen rellenarlo */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            className="mt-1"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "cf-consent-error" : undefined}
          />
          <span className="text-sm">
            {t("consent")}{" "}
            <Link href="/privacidad" className="underline underline-offset-2">
              →
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p id="cf-consent-error" role="alert" className={errCls}>
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-sm border border-red-800/40 bg-red-800/5 p-4 text-sm text-red-900">
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-sm bg-sea-deep px-6 py-3.5 text-ivory-soft hover:bg-sea disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
