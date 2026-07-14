"use client";

import { useEffect, useState } from "react";

export interface SiteSettings {
  store?: Record<string, string>;
  content?: Record<string, string>;
  translations?: Record<string, Record<string, string>>;
}

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

async function load(): Promise<SiteSettings> {
  try {
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(cache || {});
  useEffect(() => {
    if (cache) return;
    if (!inflight) inflight = load().then((d) => { cache = d; return d; });
    inflight.then(setSettings);
  }, []);
  return settings;
}
