// I18nContext v3 - Cache bust for deployment
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLocale, Translation, detectLocale, useTranslation as getTranslation } from '@/lib/i18n';

type TFunction = (path: string) => string;
type TType = Translation & TFunction;

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TType;
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
    if (saved) return saved as SupportedLocale;

    // Otherwise detect from browser
    return detectLocale();
  });

  const tObj = getTranslation(locale);

  // Create a base function for t('key') notation
  const tFn = (path: string) => {
    if (!path) return '';
    const parts = path.split('.');
    let current: any = tObj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return path;
      }
    }
    return typeof current === 'string' ? current : path;
  };

  // Merge the translation object properties onto the function
  // use Object.assign to create a function that also has the object as properties
  const t = Object.assign(tFn, tObj);

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
    <I18nContext.Provider value={{ locale, setLocale, t: t as any }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  // Provide fallback if context is not available
  // This handles edge cases during initial render or HMR
  if (!context) {
    if (typeof window !== 'undefined') {
      console.warn("[useI18n] Context not found, using fallback. Ensure I18nProvider is at the root.");
    }
    const defaultLocale: SupportedLocale = 'en';
    const translationObj = getTranslation(defaultLocale);

    // Create a fallback function that works like the real one
    const fallbackTFn = (path: string) => {
      if (!path) return '';
      const parts = path.split('.');
      let current: any = translationObj;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return path;
        }
      }
      return typeof current === 'string' ? current : path;
    };

    const fallbackT = Object.assign(fallbackTFn, translationObj);

    return {
      locale: defaultLocale,
      setLocale: () => { },
      t: fallbackT as TType
    };
  }

  return context;
}