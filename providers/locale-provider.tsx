"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

import { LanguageModal } from "@/components/language-modal";
import { translations } from "@/translations";
import Analyzing from "@/components/analyzing";

type TranslationsType = typeof translations;
type SupportedLocale = keyof TranslationsType;
type TranslationKey = keyof TranslationsType[SupportedLocale];

const DEFAULT_LOCALE: SupportedLocale = "en";
const STORAGE_KEY = "locale";

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: TranslationKey) => string;
  availableLocales: SupportedLocale[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

interface LocaleProviderProps {
  children: ReactNode;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => null,
  t: (key) => String(key),
  availableLocales: [],
  isModalOpen: false,
  setIsModalOpen: () => null,
});

const useTranslation = (locale: SupportedLocale) => {
  return useMemo(() => {
    return (key: TranslationKey): string => {
      try {
        const translation = translations[locale][key];

        return translation ?? String(key);
      } catch {
        return String(key);
      }
    };
  }, [locale]);
};

const isSupportedLocale = (locale: string): locale is SupportedLocale => {
  return Object.keys(translations).includes(locale);
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeLocale = () => {
      const savedLocale = localStorage.getItem(STORAGE_KEY);

      if (savedLocale && isSupportedLocale(savedLocale)) {
        setLocale(savedLocale);
      }
      setIsLoading(false);
    };

    initializeLocale();
  }, []);

  const handleSetLocale = (newLocale: string) => {
    if (isSupportedLocale(newLocale)) {
      setLocale(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
      setIsModalOpen(false);
    }
  };

  const t = useTranslation(locale);

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale: handleSetLocale,
      t,
      availableLocales: Object.keys(translations) as SupportedLocale[],
      isModalOpen,
      setIsModalOpen,
    }),
    [locale, t, isModalOpen],
  );

  if (isLoading) {
    return <Analyzing />;
  }

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLanguage={handleSetLocale}
      />
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
};
