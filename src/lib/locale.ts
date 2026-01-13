/**
 * Multi-region localization system
 * Auto-detects user region and adapts pricing, currency, and content
 */

export type SupportedLocale = 'en-US' | 'es-ES' | 'en-IN' | 'en-PH' | 'en-CA' | 'de-DE' | 'fr-FR' | 'ar-SA' | 'uk-UA';
export type SupportedCurrency = 'USD' | 'EUR' | 'INR' | 'PHP' | 'CAD' | 'GBP';

interface RegionConfig {
  locale: SupportedLocale;
  currency: SupportedCurrency;
  timezone: string;
  countryCode: string;
  countryName: string;
  priceMultiplier: number; // Purchasing power parity adjustment
}

// Regional configurations optimized for each market
export const REGIONS: Record<string, RegionConfig> = {
  US: {
    locale: 'en-US',
    currency: 'USD',
    timezone: 'America/New_York',
    countryCode: 'US',
    countryName: 'United States',
    priceMultiplier: 1.0,
  },
  ES: {
    locale: 'es-ES',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    countryCode: 'ES',
    countryName: 'Spain',
    priceMultiplier: 1.0,
  },
  IN: {
    locale: 'en-IN',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    countryCode: 'IN',
    countryName: 'India',
    priceMultiplier: 0.25, // 75% discount for purchasing power parity
  },
  PH: {
    locale: 'en-PH',
    currency: 'PHP',
    timezone: 'Asia/Manila',
    countryCode: 'PH',
    countryName: 'Philippines',
    priceMultiplier: 0.35, // 65% discount
  },
  CA: {
    locale: 'en-CA',
    currency: 'CAD',
    timezone: 'America/Toronto',
    countryCode: 'CA',
    countryName: 'Canada',
    priceMultiplier: 0.95,
  },
  DE: {
    locale: 'de-DE',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    countryCode: 'DE',
    countryName: 'Germany',
    priceMultiplier: 1.0,
  },
  FR: {
    locale: 'fr-FR',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    countryCode: 'FR',
    countryName: 'France',
    priceMultiplier: 1.0,
  },
  SA: {
    locale: 'ar-SA',
    currency: 'USD',
    timezone: 'Asia/Riyadh',
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    priceMultiplier: 0.9,
  },
  UA: {
    locale: 'uk-UA',
    currency: 'USD',
    timezone: 'Europe/Kiev',
    countryCode: 'UA',
    countryName: 'Ukraine',
    priceMultiplier: 0.4, // 60% discount
  },
  ID: {
    locale: 'en-US',
    currency: 'USD',
    timezone: 'Asia/Jakarta',
    countryCode: 'ID',
    countryName: 'Indonesia',
    priceMultiplier: 0.3, // 70% discount
  },
};

// Currency conversion rates (base: USD)
const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 0.92,
  INR: 83.5,
  PHP: 56.0,
  CAD: 1.36,
  GBP: 0.79,
};

let cachedRegion: RegionConfig | null = null;

/**
 * Detects user region from browser locale and timezone
 */
export function detectUserRegion(): RegionConfig {
  if (cachedRegion) return cachedRegion;

  // Try to detect from browser locale
  const browserLocale = navigator.language || 'en-US';
  const countryCode = browserLocale.split('-')[1]?.toUpperCase();

  // Check if we support this region
  if (countryCode && REGIONS[countryCode]) {
    cachedRegion = REGIONS[countryCode];
    return cachedRegion;
  }

  // Fallback to US
  cachedRegion = REGIONS.US;
  return cachedRegion;
}

/**
 * Gets current region config
 */
export function getCurrentRegion(): RegionConfig {
  return detectUserRegion();
}

/**
 * Formats price based on user's region
 * @param basePrice - Base price in USD
 * @param region - Optional region override
 */
export function formatPrice(basePrice: number, region?: RegionConfig): string {
  const userRegion = region || getCurrentRegion();

  // Apply purchasing power parity adjustment
  const adjustedPrice = basePrice * userRegion.priceMultiplier;

  // Convert to local currency
  const localPrice = adjustedPrice * CURRENCY_RATES[userRegion.currency];

  return new Intl.NumberFormat(userRegion.locale, {
    style: 'currency',
    currency: userRegion.currency,
    minimumFractionDigits: userRegion.currency === 'INR' || userRegion.currency === 'PHP' ? 0 : 2,
    maximumFractionDigits: userRegion.currency === 'INR' || userRegion.currency === 'PHP' ? 0 : 2,
  }).format(localPrice);
}

/**
 * Calculates regional price in local currency
 * @param basePrice - Base price in USD
 */
export function getRegionalPrice(basePrice: number): {
  price: number;
  currency: SupportedCurrency;
  formatted: string;
  discount?: number;
} {
  const region = getCurrentRegion();
  const adjustedPrice = basePrice * region.priceMultiplier;
  const localPrice = adjustedPrice * CURRENCY_RATES[region.currency];

  const discount = region.priceMultiplier < 1.0
    ? Math.round((1 - region.priceMultiplier) * 100)
    : undefined;

  return {
    price: Math.round(localPrice * 100) / 100,
    currency: region.currency,
    formatted: formatPrice(basePrice),
    discount,
  };
}

/**
 * Formats a date based on user's locale
 */
export function formatDate(date: number | Date, region?: RegionConfig): string {
  const userRegion = region || getCurrentRegion();
  return new Date(date).toLocaleDateString(userRegion.locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats date and time based on user's locale
 */
export function formatDateTime(date: number | Date, region?: RegionConfig): string {
  const userRegion = region || getCurrentRegion();
  return new Date(date).toLocaleString(userRegion.locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a number based on user's locale
 */
export function formatNumber(value: number, region?: RegionConfig): string {
  const userRegion = region || getCurrentRegion();
  return new Intl.NumberFormat(userRegion.locale).format(value);
}

/**
 * Formats relative time in user's language
 */
export function formatRelativeTime(date: number | Date, region?: RegionConfig): string {
  const userRegion = region || getCurrentRegion();
  const now = Date.now();
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // Translation maps for different languages
  const translations: Record<string, any> = {
    'en-US': {
      seconds: 'seconds ago',
      minute: 'minute ago',
      minutes: 'minutes ago',
      hour: 'hour ago',
      hours: 'hours ago',
      day: 'day ago',
      days: 'days ago',
      week: 'week ago',
      weeks: 'weeks ago',
      month: 'month ago',
      months: 'months ago',
      year: 'year ago',
      years: 'years ago',
    },
    'es-ES': {
      seconds: 'hace unos segundos',
      minute: 'hace 1 minuto',
      minutes: 'minutos',
      hour: 'hace 1 hora',
      hours: 'horas',
      day: 'hace 1 día',
      days: 'días',
      week: 'hace 1 semana',
      weeks: 'semanas',
      month: 'hace 1 mes',
      months: 'meses',
      year: 'hace 1 año',
      years: 'años',
    },
  };

  const lang = userRegion.locale.startsWith('es') ? 'es-ES' : 'en-US';
  const t = translations[lang];

  if (diffSec < 60) {
    return t.seconds;
  } else if (diffMin === 1) {
    return t.minute;
  } else if (diffMin < 60) {
    return lang === 'es-ES' ? `hace ${diffMin} ${t.minutes}` : `${diffMin} ${t.minutes}`;
  } else if (diffHour === 1) {
    return t.hour;
  } else if (diffHour < 24) {
    return lang === 'es-ES' ? `hace ${diffHour} ${t.hours}` : `${diffHour} ${t.hours}`;
  } else if (diffDay === 1) {
    return t.day;
  } else if (diffDay < 7) {
    return lang === 'es-ES' ? `hace ${diffDay} ${t.days}` : `${diffDay} ${t.days}`;
  } else if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return lang === 'es-ES'
      ? `hace ${weeks} ${weeks === 1 ? 'semana' : t.weeks}`
      : `${weeks} ${weeks === 1 ? t.week : t.weeks}`;
  } else if (diffDay < 365) {
    const months = Math.floor(diffDay / 30);
    return lang === 'es-ES'
      ? `hace ${months} ${months === 1 ? 'mes' : t.months}`
      : `${months} ${months === 1 ? t.month : t.months}`;
  } else {
    const years = Math.floor(diffDay / 365);
    return lang === 'es-ES'
      ? `hace ${years} ${years === 1 ? 'año' : t.years}`
      : `${years} ${years === 1 ? t.year : t.years}`;
  }
}

/**
 * Gets localized message for common UI strings
 */
export function t(key: string, region?: RegionConfig): string {
  const userRegion = region || getCurrentRegion();
  const lang = userRegion.locale.startsWith('es') ? 'es' : 'en';

  const messages: Record<string, Record<string, string>> = {
    en: {
      'scan.button': 'Scan Resume',
      'pricing.monthly': 'per month',
      'pricing.yearly': 'per year',
      'free.trial': 'Free Trial',
      'get.started': 'Get Started',
      'learn.more': 'Learn More',
    },
    es: {
      'scan.button': 'Escanear CV',
      'pricing.monthly': 'por mes',
      'pricing.yearly': 'por año',
      'free.trial': 'Prueba Gratis',
      'get.started': 'Comenzar',
      'learn.more': 'Saber Más',
    },
  };

  return messages[lang]?.[key] || messages.en[key] || key;
}
