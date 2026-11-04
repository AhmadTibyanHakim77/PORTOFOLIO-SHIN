"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "sand_shinobi_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "id" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      } else {
        const browserLang = navigator.language.toLowerCase();
        const initial: Locale = browserLang.startsWith("id") ? "id" : "en";
        setLocaleState(initial);
        document.documentElement.lang = initial;
      }
    } catch (_err) {
      // localStorage disabled or not accessible
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (_err) {}
    try {
      document.documentElement.lang = newLocale;
    } catch (_err) {}
  };

  const toggleLocale = () => {
    setLocale(locale === "id" ? "en" : "id");
  };

  const t = useMemo(() => dictionaries[locale], [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

