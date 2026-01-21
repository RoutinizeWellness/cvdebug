// I18nContext v2 - Fixed provider error handling
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLocale, Translation, detectLocale, useTranslation as getTranslation } from '@/lib/i18n';

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('cvdebug-locale');
    if (saved) return saved as SupportedLocale;

    // Otherwise detect from browser
    return detectLocale();
  });

  const t = getTranslation(locale);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('cvdebug-locale', newLocale);

    // Update HTML lang attribute
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    // Set initial lang attribute
    document.documentElement.lang = locale;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  // Provide fallback if context is not available
  // This handles edge cases during initial render or HMR
  if (!context) {
    const defaultLocale: SupportedLocale = 'en';
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: getTranslation(defaultLocale)
    };
  }

  return context;
}
