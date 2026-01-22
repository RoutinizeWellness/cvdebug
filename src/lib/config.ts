/**
 * Application configuration
 * Uses environment variables to determine the correct base URL
 */

// Get the base URL from environment or use window.location.origin as fallback
export const getBaseUrl = (): string => {
  // If we're in the browser, use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For SSR/build time, use the working vly.sh domain as fallback
  return 'https://lazy-badgers-roll.vly.sh';
};

// Export as constant for convenience
export const BASE_URL = getBaseUrl();

// Common URLs
export const SITE_CONFIG = {
  baseUrl: BASE_URL,
  ogImage: `${BASE_URL}/og-image.png`,
  twitterImage: `${BASE_URL}/og-image.png`,
  defaultOgImage: `${BASE_URL}/og-image.png`,
} as const;