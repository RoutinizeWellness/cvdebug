import { useState, useEffect } from "react";

export interface CurrencyInfo {
  code: string; // EUR, USD, GBP, etc.
  symbol: string; // €, $, £, etc.
  rate: number; // Conversion rate from EUR
  country: string; // Country code
}

// Base prices in EUR (€)
const BASE_PRICES = {
  single_scan: 9.99,
  interview_sprint: 24.99,
};

// Currency conversion rates (from EUR)
const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  EUR: { symbol: "€", rate: 1.0 }, // Base currency
  USD: { symbol: "$", rate: 1.09 }, // 1 EUR = 1.09 USD
  GBP: { symbol: "£", rate: 0.86 }, // 1 EUR = 0.86 GBP
  CAD: { symbol: "C$", rate: 1.47 }, // 1 EUR = 1.47 CAD
  AUD: { symbol: "A$", rate: 1.65 }, // 1 EUR = 1.65 AUD
  JPY: { symbol: "¥", rate: 163.0 }, // 1 EUR = 163 JPY
  INR: { symbol: "₹", rate: 90.5 }, // 1 EUR = 90.5 INR
  BRL: { symbol: "R$", rate: 5.35 }, // 1 EUR = 5.35 BRL
  MXN: { symbol: "MX$", rate: 18.6 }, // 1 EUR = 18.6 MXN
};

// EU countries
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
  JP: "JPY",
  IN: "INR",
  BR: "BRL",
  MX: "MXN",
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

    // Format based on currency
    if (currencyInfo.code === "JPY") {
      return Math.round(converted).toString(); // No decimals for JPY
    }

    return converted.toFixed(2);
  };

  const formatPrice = (priceKey: keyof typeof BASE_PRICES): string => {
    const eurPrice = BASE_PRICES[priceKey];
    const converted = convertPrice(eurPrice);
    return `${currencyInfo.symbol}${converted}`;
  };

  return {
    currencyInfo,
    convertPrice,
    formatPrice,
  };
}
