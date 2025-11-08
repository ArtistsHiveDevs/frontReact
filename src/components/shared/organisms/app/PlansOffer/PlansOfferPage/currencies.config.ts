// ============================================
// CURRENCY TYPES & CONFIGURATION
// ============================================

export type Currency = {
  code: string;
  symbol: string;
  exchangeRate: number; // Relative to USD (USD = 1)
  decimals: number;
  locale: string;
  label: string;
  flag?: string; // Optional emoji flag
};

/**
 * Supported currencies configuration
 * Exchange rates should be updated periodically or fetched from an API
 *
 * Note: Exchange rates are approximate and for display purposes.
 * For actual payments, use real-time exchange rates from payment provider.
 */
export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    symbol: 'USD $',
    exchangeRate: 1,
    decimals: 2,
    locale: 'en-US',
    label: 'USD ($)',
    flag: '🇺🇸',
  },
  {
    code: 'EUR',
    symbol: '€',
    exchangeRate: 0.92,
    decimals: 2,
    locale: 'de-DE',
    label: 'EUR (€)',
    flag: '🇪🇺',
  },
  {
    code: 'GBP',
    symbol: '£',
    exchangeRate: 0.79,
    decimals: 2,
    locale: 'en-GB',
    label: 'GBP (£)',
    flag: '🇬🇧',
  },
  {
    code: 'CAD',
    symbol: 'CA$',
    exchangeRate: 1.35,
    decimals: 2,
    locale: 'en-CA',
    label: 'CAD ($)',
    flag: '🇨🇦',
  },
  // Latin America
  {
    code: 'COP',
    symbol: 'COP $',
    exchangeRate: 4000,
    decimals: 0,
    locale: 'es-CO',
    label: 'COP ($)',
    flag: '🇨🇴',
  },
  {
    code: 'MXN',
    symbol: 'MX$',
    exchangeRate: 17.5,
    decimals: 2,
    locale: 'es-MX',
    label: 'MXN ($)',
    flag: '🇲🇽',
  },
  {
    code: 'ARS',
    symbol: 'AR$',
    exchangeRate: 350,
    decimals: 0,
    locale: 'es-AR',
    label: 'ARS ($)',
    flag: '🇦🇷',
  },
  {
    code: 'BRL',
    symbol: 'R$',
    exchangeRate: 5.0,
    decimals: 2,
    locale: 'pt-BR',
    label: 'BRL (R$)',
    flag: '🇧🇷',
  },
  {
    code: 'CLP',
    symbol: 'CLP$',
    exchangeRate: 900,
    decimals: 0,
    locale: 'es-CL',
    label: 'CLP ($)',
    flag: '🇨🇱',
  },
  {
    code: 'PEN',
    symbol: 'S/',
    exchangeRate: 3.7,
    decimals: 2,
    locale: 'es-PE',
    label: 'PEN (S/)',
    flag: '🇵🇪',
  },
  {
    code: 'UYU',
    symbol: 'UY$',
    exchangeRate: 39,
    decimals: 2,
    locale: 'es-UY',
    label: 'UYU ($)',
    flag: '🇺🇾',
  },
  // Additional currencies can be added here
];

/**
 * Get currency configuration by code
 * @param currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns Currency configuration object
 */
export const getCurrencyConfig = (currencyCode: string): Currency => {
  return CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
};

/**
 * Format number as currency string
 * @param value - Numeric value to format
 * @param currencyCode - Currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currencyCode: string): string => {
  const currencyConfig = getCurrencyConfig(currencyCode);
  return value.toLocaleString(currencyConfig.locale, {
    minimumFractionDigits: currencyConfig.decimals,
    maximumFractionDigits: currencyConfig.decimals,
  });
};

/**
 * Convert price from USD to target currency
 * @param priceUSD - Price in USD
 * @param currencyCode - Target currency code
 * @returns Converted price
 */
export const convertFromUSD = (priceUSD: number, currencyCode: string): number => {
  const currencyConfig = getCurrencyConfig(currencyCode);
  return priceUSD * currencyConfig.exchangeRate;
};
