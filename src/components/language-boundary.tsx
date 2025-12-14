"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { normalizeLanguage, type LanguageCode } from "@/lib/i18n";

const LanguageContext = createContext<LanguageCode>("vi");

export function LanguageBoundary({
  lang,
  children,
}: {
  lang?: string;
  children: React.ReactNode;
}) {
  const normalized = useMemo(() => normalizeLanguage(lang), [lang]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = normalized;
    document.documentElement.setAttribute("data-language", normalized);
  }, [normalized]);

  return <LanguageContext.Provider value={normalized}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
