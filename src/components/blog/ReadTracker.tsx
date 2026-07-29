"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Dispara read_blog_article una vez por visita al artículo. */
export function ReadTracker({ slug, category }: { slug: string; category: string }) {
  useEffect(() => {
    track("read_blog_article", { article: slug, category });
  }, [slug, category]);
  return null;
}
