import { useState, useEffect } from "react";

export interface CurrencyInfo {
  code: string; // EUR, USD, GBP, etc.
  symbol: string; // €, $, £, etc.
  rate: number; // Conversion rate from EUR
  country: string; // Country code
}

// Base prices in EUR (€) - OFFICIAL PRICING
const BASE_PRICES = {
  single_scan: 14.99,
  interview_sprint: 49.99,
  sprint_7day: 24.99, // 7-Day Sprint
};

// Currency conversion rates (from EUR)
const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  EUR: { symbol: "€", rate: 1.0 }, // Base currency
  USD: { symbol: "$", rate: 1.09 },
  GBP: { symbol: "£", rate: 0.86 },
  CAD: { symbol: "CA$", rate: 1.48 },
  AUD: { symbol: "A$", rate: 1.67 },
  MXN: { symbol: "MX$", rate: 20.5 },
  BRL: { symbol: "R$", rate: 5.42 },
  ARS: { symbol: "ARS$", rate: 1050.0 },
  CLP: { symbol: "CLP$", rate: 1020.0 },
  COP: { symbol: "COP$", rate: 4280.0 },
  JPY: { symbol: "¥", rate: 161.0 },
  CNY: { symbol: "¥", rate: 7.85 },
  INR: { symbol: "₹", rate: 90.5 },
  CHF: { symbol: "CHF", rate: 0.95 },
  SEK: { symbol: "kr", rate: 11.35 },
  NOK: { symbol: "kr", rate: 11.85 },
  DKK: { symbol: "kr", rate: 7.45 },
  PLN: { symbol: "zł", rate: 4.32 },
  CZK: { symbol: "Kč", rate: 24.5 },
  HUF: { symbol: "Ft", rate: 390.0 },
  RON: { symbol: "lei", rate: 4.97 },
};

// EU countries (use EUR)
const EU_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
];

// Map countries to currencies
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  MX: "MXN",
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  CO: "COP",
  JP: "JPY",
  CN: "CNY",
  IN: "INR",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RO: "RON",
};

export function useCurrency() {
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>({
    code: "EUR",
    symbol: "€",
    rate: 1.0,
    country: "ES",
  });

  useEffect(() => {
    async function detectCurrency() {
      try {
        // Try to get user's country from IP geolocation
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const countryCode = data.country_code || "ES"; // Default to Spain (EUR)

        let currencyCode = "EUR"; // Default to EUR

        // Check if EU country
        if (EU_COUNTRIES.includes(countryCode)) {
          currencyCode = "EUR";
        } else if (COUNTRY_CURRENCY_MAP[countryCode]) {
          currencyCode = COUNTRY_CURRENCY_MAP[countryCode];
        }

        const currencyData = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.EUR;

        setCurrencyInfo({
          code: currencyCode,
          symbol: currencyData.symbol,
          rate: currencyData.rate,
          country: countryCode,
        });
      } catch (error) {
        console.log("Could not detect currency, defaulting to EUR");
        // Keep default EUR
      }
    }

    detectCurrency();
  }, []);

  const convertPrice = (eurPrice: number): string => {
    const converted = eurPrice * currencyInfo.rate;

    // Format based on currency (no decimals for certain currencies)
    if (["JPY", "ARS", "CLP", "COP", "HUF"].includes(currencyInfo.code)) {
      return Math.round(converted).toString();
    }

    return converted.toFixed(2);
  };

  const formatPrice = (priceKey: keyof typeof BASE_PRICES): string => {
    const eurPrice = BASE_PRICES[priceKey];
    const converted = convertPrice(eurPrice);
    return `${currencyInfo.symbol}${converted}`;
  };

  // Get raw price amount without symbol
  const getRawPrice = (priceKey: keyof typeof BASE_PRICES): number => {
    const eurPrice = BASE_PRICES[priceKey];
    const converted = eurPrice * currencyInfo.rate;

    if (["JPY", "ARS", "CLP", "COP", "HUF"].includes(currencyInfo.code)) {
      return Math.round(converted);
    }

    return Math.round(converted * 100) / 100;
  };

  return {
    currencyInfo,
    convertPrice,
    formatPrice,
    getRawPrice,
    BASE_PRICES, // Export base prices for reference
  };
}
