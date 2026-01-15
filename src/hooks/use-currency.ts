import { useState, useEffect } from "react";

export interface CurrencyInfo {
  code: string; // EUR, USD, GBP, etc.
  symbol: string; // €, $, £, etc.
  rate: number; // Conversion rate from USD
  country: string; // Country code
}

// Base prices in USD
const BASE_PRICES = {
  single_scan: 9.99,
  interview_sprint: 19.99,
};

// Currency conversion rates (from USD)
const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  EUR: { symbol: "€", rate: 0.92 }, // 1 USD = 0.92 EUR
  USD: { symbol: "$", rate: 1.0 },
  GBP: { symbol: "£", rate: 0.79 }, // 1 USD = 0.79 GBP
  CAD: { symbol: "C$", rate: 1.35 }, // 1 USD = 1.35 CAD
  AUD: { symbol: "A$", rate: 1.52 }, // 1 USD = 1.52 AUD
  JPY: { symbol: "¥", rate: 149.5 }, // 1 USD = 149.5 JPY
  INR: { symbol: "₹", rate: 83.2 }, // 1 USD = 83.2 INR
  BRL: { symbol: "R$", rate: 4.92 }, // 1 USD = 4.92 BRL
  MXN: { symbol: "MX$", rate: 17.1 }, // 1 USD = 17.1 MXN
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
    code: "USD",
    symbol: "$",
    rate: 1.0,
    country: "US",
  });

  useEffect(() => {
    async function detectCurrency() {
      try {
        // Try to get user's country from IP geolocation
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const countryCode = data.country_code || "US";

        let currencyCode = "USD";

        // Check if EU country
        if (EU_COUNTRIES.includes(countryCode)) {
          currencyCode = "EUR";
        } else if (COUNTRY_CURRENCY_MAP[countryCode]) {
          currencyCode = COUNTRY_CURRENCY_MAP[countryCode];
        }

        const currencyData = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD;

        setCurrencyInfo({
          code: currencyCode,
          symbol: currencyData.symbol,
          rate: currencyData.rate,
          country: countryCode,
        });
      } catch (error) {
        console.log("Could not detect currency, defaulting to USD");
        // Keep default USD
      }
    }

    detectCurrency();
  }, []);

  const convertPrice = (usdPrice: number): string => {
    const converted = usdPrice * currencyInfo.rate;

    // Format based on currency
    if (currencyInfo.code === "JPY") {
      return Math.round(converted).toString(); // No decimals for JPY
    }

    return converted.toFixed(2);
  };

  const formatPrice = (priceKey: keyof typeof BASE_PRICES): string => {
    const usdPrice = BASE_PRICES[priceKey];
    const converted = convertPrice(usdPrice);
    return `${currencyInfo.symbol}${converted}`;
  };

  return {
    currencyInfo,
    convertPrice,
    formatPrice,
  };
}
