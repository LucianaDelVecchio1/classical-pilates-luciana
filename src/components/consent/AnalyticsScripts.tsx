"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { readConsent, applyConsentMode, type ConsentState } from "@/lib/consent";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Carga GTM únicamente cuando existe consentimiento de analítica o marketing.
 * Consent Mode v2: los defaults se declaran en "denied" antes de cualquier tag.
 * GA4, Google Ads y el futuro Meta Pixel se gestionan DENTRO de GTM,
 * condicionados a los flags de Consent Mode (ver README).
 */
export function AnalyticsScripts() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    // Lectura inicial de localStorage tras el montaje: evita divergencias de
    // hidratación (el servidor no conoce el consentimiento del visitante).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsent());
    const onChange = (e: Event) =>
      setConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener("cpl-consent-changed", onChange);
    return () => window.removeEventListener("cpl-consent-changed", onChange);
  }, []);

  useEffect(() => {
    if (consent) applyConsentMode(consent);
  }, [consent]);

  const shouldLoad =
    Boolean(GTM_ID) && Boolean(consent && (consent.analytics || consent.marketing));

  return (
    <>
      {/* Defaults de Consent Mode: se ejecutan antes de que GTM pueda cargarse,
          porque GTM solo se monta tras el evento de consentimiento. */}
      <Script id="consent-defaults" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});`}
      </Script>
      {shouldLoad && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})
(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
    </>
  );
}
