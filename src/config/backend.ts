// Production backend configuration
export const PRODUCTION_BACKEND = "https://shocking-meerkat-209.convex.cloud";
export const DEV_BACKEND = "https://next-cod-660.convex.cloud";

export function getBackendUrl(): string {
  if (typeof window === "undefined") {
    return PRODUCTION_BACKEND;
  }
  
  const hostname = window.location.hostname;
  const isLocalDev = hostname === "localhost" || hostname.includes("vly.sh");
  
  return isLocalDev ? DEV_BACKEND : PRODUCTION_BACKEND;
}
