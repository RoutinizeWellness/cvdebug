/**
 * Pricing utilities for CVDebug
 * Base prices are in EUR and converted to local currency based on user location
 */

export interface PricingInfo {
  amount: number;
  currency: string;
  symbol: string;
  formatted: string;
}

// Base prices in EUR
export const BASE_PRICES = {
  single_scan: 14.99,
  interview_sprint: 49.99,
} as const;

// Exchange rates (updated periodically)
const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1.0,
  USD: 1.09,
  GBP: 0.86,
  CAD: 1.48,
  AUD: 1.67,
  MXN: 20.5,
  BRL: 5.42,
  ARS: 1050.0,
  CLP: 1020.0,
  COP: 4280.0,
  JPY: 161.0,
  CNY: 7.85,
  INR: 90.5,
  CHF: 0.95,
  SEK: 11.35,
  NOK: 11.85,
  DKK: 7.45,
  PLN: 4.32,
  CZK: 24.5,
  HUF: 390.0,
  RON: 4.97,
};

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  MXN: 'MX$',
  BRL: 'R$',
  ARS: 'ARS$',
  CLP: 'CLP$',
  COP: 'COP$',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
};

/**
 * Get currency code from user's country/locale
 */
export function getCurrencyFromLocale(locale?: string): string {
  if (!locale) {
    // Try to detect from browser
    const browserLocale = navigator.language || 'en-US';
    locale = browserLocale;
  }

  const countryCode = locale.split('-')[1] || locale.split('_')[1];

  // Map country codes to currencies
  const countryToCurrency: Record<string, string> = {
    US: 'USD',
    GB: 'GBP',
    CA: 'CAD',
    AU: 'AUD',
    MX: 'MXN',
    BR: 'BRL',
    AR: 'ARS',
    CL: 'CLP',
    CO: 'COP',
    JP: 'JPY',
    CN: 'CNY',
    IN: 'INR',
    CH: 'CHF',
    SE: 'SEK',
    NO: 'NOK',
    DK: 'DKK',
    PL: 'PLN',
    CZ: 'CZK',
    HU: 'HUF',
    RO: 'RON',
    // EU countries default to EUR
    AT: 'EUR',
    BE: 'EUR',
    DE: 'EUR',
    ES: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    NL: 'EUR',
    PT: 'EUR',
    IE: 'EUR',
    FI: 'EUR',
    GR: 'EUR',
    LU: 'EUR',
    MT: 'EUR',
    SI: 'EUR',
    SK: 'EUR',
    EE: 'EUR',
    LV: 'EUR',
    LT: 'EUR',
    CY: 'EUR',
  };

  return countryToCurrency[countryCode?.toUpperCase() || ''] || 'EUR';
}

/**
 * Convert EUR price to target currency
 */
export function convertPrice(
  priceInEur: number,
  targetCurrency: string
): PricingInfo {
  const rate = EXCHANGE_RATES[targetCurrency] || 1.0;
  const convertedAmount = priceInEur * rate;

  // Round to appropriate precision
  let roundedAmount: number;
  if (['JPY', 'ARS', 'CLP', 'COP', 'HUF'].includes(targetCurrency)) {
    // No decimals for these currencies
    roundedAmount = Math.round(convertedAmount);
  } else {
    // 2 decimals for most currencies
    roundedAmount = Math.round(convertedAmount * 100) / 100;
  }

  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;

  // Format with appropriate decimal places
  const decimals = ['JPY', 'ARS', 'CLP', 'COP', 'HUF'].includes(targetCurrency) ? 0 : 2;
  const formatted = `${symbol}${roundedAmount.toFixed(decimals)}`;

  return {
    amount: roundedAmount,
    currency: targetCurrency,
    symbol,
    formatted,
  };
}

/**
 * Get pricing for a plan in user's currency
 */
export function getPlanPrice(
  planType: keyof typeof BASE_PRICES,
  userLocale?: string
): PricingInfo {
  const basePrice = BASE_PRICES[planType];
  const currency = getCurrencyFromLocale(userLocale);
  return convertPrice(basePrice, currency);
}

/**
 * Get all plan prices in user's currency
 */
export function getAllPlanPrices(userLocale?: string) {
  const currency = getCurrencyFromLocale(userLocale);

  return {
    single_scan: convertPrice(BASE_PRICES.single_scan, currency),
    interview_sprint: convertPrice(BASE_PRICES.interview_sprint, currency),
    currency,
  };
}
