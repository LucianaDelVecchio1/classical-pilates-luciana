"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vídeo del estudio en la parte superior del home
 * (/public/videos/hero-studio.mp4, 720×1280 vertical, sin audio).
 * Se muestra SIEMPRE en su proporción vertical nativa (9:16) — nunca
 * recortado a horizontal. Decorativo (aria-hidden); respeta
 * prefers-reduced-motion mostrando solo el póster.
 */
export function HeroVideo({ className }: { className?: string }) {
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
        /* autoplay bloqueado: se queda el póster */
      });
    }
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className={`relative aspect-[9/16] overflow-hidden rounded-sm ${className ?? ""}`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
      >
        <source src="/videos/hero-studio.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
