"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vídeo de fondo del héroe de portada (/public/videos/hero-studio.mp4,
 * versión web comprimida de HOMESTUDIO.mp4; póster hero-poster.jpg).
 * Silencioso, en bucle y decorativo (aria-hidden): el contenido accesible
 * es el texto que se superpone. Respeta prefers-reduced-motion mostrando
 * solo el póster.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura inicial de una preferencia del sistema tras montar
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => {
        /* autoplay bloqueado: se queda el póster, sin error visible */
      });
    }
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
      >
        <source src="/videos/hero-studio.mp4" type="video/mp4" />
      </video>
      {/* Velo para legibilidad del texto sobre el vídeo */}
      <div className="absolute inset-0 bg-gradient-to-t from-char/70 via-char/30 to-char/20" />
    </div>
  );
}
