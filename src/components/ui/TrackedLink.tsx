"use client";

import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Enlace interno que dispara un evento analítico al hacer clic. */
export function TrackedLink({
  href,
  event,
  origin,
  className,
  children,
}: {
  href: StaticPathname;
  event: AnalyticsEvent;
  origin: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() => track(event, { origin })}
      className={className}
    >
      {children}
    </Link>
  );
}

export const ctaPrimaryCls =
  "inline-block rounded-sm bg-sea-deep px-6 py-3.5 text-ivory-soft hover:bg-sea text-center";
export const ctaSecondaryCls =
  "inline-block rounded-sm border border-char px-6 py-3.5 text-char hover:bg-sand text-center";
export const ctaOnDarkCls =
  "inline-block rounded-sm bg-ivory-soft px-6 py-3.5 text-char hover:bg-sand text-center";
export const ctaOutlineOnDarkCls =
  "inline-block rounded-sm border border-ivory-soft px-6 py-3.5 text-ivory-soft hover:bg-sea text-center";
