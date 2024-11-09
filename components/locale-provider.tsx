"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { LanguageModal } from "@/components/language-modal";
import { translations } from "@/translations";
import { Loading } from "@/components/loading";

type Locale = "tr" | "en";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof translations.tr) => string;
}>({
  locale: "tr",
  setLocale: () => {},
  t: () => "",
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("tr");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;

    if (savedLocale) {
      setLocale(savedLocale);
    }
    setIsLoading(false);
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: keyof typeof translations.tr) => {
    return translations[locale][key];
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      <LanguageModal onSelectLanguage={handleSetLocale} />
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
