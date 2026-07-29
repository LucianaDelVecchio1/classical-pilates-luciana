"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ContactViewTracker() {
  useEffect(() => {
    track("view_contact");
  }, []);
  return null;
}
