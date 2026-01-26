// I18nContext v3 - Cache bust for deployment
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLocale, Translation, detectLocale, useTranslation as getTranslation } from '@/lib/i18n';

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Debug log to verify provider mounting
  useEffect(() => {
    console.log("[I18nProvider] Mounted");
  }, []);

  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('cvdebug-locale');

    // CACHE BUST: Force English if saved locale is invalid
    const validLocales: SupportedLocale[] = ['en', 'es', 'fr', 'de', 'pt'];
    if (saved && validLocales.includes(saved as SupportedLocale)) {
      console.log(`[I18nProvider] Using saved locale: ${saved}`);
      return saved as SupportedLocale;
    }

    // Default to English
    console.log("[I18nProvider] No saved locale, defaulting to English");
    return 'en';
  });

  const t = getTranslation(locale);

  const setLocale = (newLocale: SupportedLocale) => {
    console.log(`[I18nProvider] Setting locale to: ${newLocale}`);
    setLocaleState(newLocale);
    localStorage.setItem('cvdebug-locale', newLocale);

    // Update HTML lang attribute
    document.documentElement.lang = newLocale;

    // Force page reload to ensure all components re-render with new locale
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  useEffect(() => {
    // Set initial lang attribute
    document.documentElement.lang = locale;
    console.log(`[I18nProvider] HTML lang attribute set to: ${locale}`);
  }, [locale]);

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
    console.warn("[useI18n] Context not found, using fallback. Ensure I18nProvider is at the root.");
    const defaultLocale: SupportedLocale = 'en';
    return {
      locale: defaultLocale,
      setLocale: () => console.warn("[useI18n] Cannot set locale in fallback mode"),
      t: getTranslation(defaultLocale)
    };
  }

  return context;
}