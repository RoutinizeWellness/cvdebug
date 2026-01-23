/**
 * Clerk configuration with automatic environment detection
 * Production domains (cvdebug.com) use live keys
 * Development domains (vly.sh, localhost) use test keys
 */

// Production Clerk keys (for cvdebug.com)
const PRODUCTION_CLERK_KEY = "pk_live_Y2xlcmsuY3ZkZWJ1Zy5jb20k";

// Development Clerk keys (for vly.sh, localhost)
const DEVELOPMENT_CLERK_KEY = "pk_test_aG9wZWZ1bC1kb2UtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA";

/**
 * Detects if we're running in production based on the hostname
 */
export const isProductionDomain = (): boolean => {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname;

  // Production domains
  const productionDomains = [
    'cvdebug.com',
    'www.cvdebug.com',
    'resumeatsoptimizer.vly.site', // Redirects to cvdebug.com
  ];

  return productionDomains.includes(hostname);
};

/**
 * Get the appropriate Clerk publishable key based on the current domain
 */
export const getClerkPublishableKey = (): string => {
  // First, try to use environment variable if set
  const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // If we're on a production domain, always use production keys
  if (isProductionDomain()) {
    console.log('[Clerk Config] Production domain detected, using live keys');
    return PRODUCTION_CLERK_KEY;
  }

  // Otherwise, use env variable or fallback to development keys
  const key = envKey || DEVELOPMENT_CLERK_KEY;

  console.log('[Clerk Config] Development domain detected, using test keys');
  return key;
};

/**
 * Export the correct key to use
 */
export const CLERK_PUBLISHABLE_KEY = getClerkPublishableKey();
