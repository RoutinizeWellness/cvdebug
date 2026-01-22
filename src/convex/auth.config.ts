// Auth configuration for Clerk integration
// Automatically uses the correct Clerk issuer based on environment
// Development (vly.sh): hopeful-doe-56.clerk.accounts.dev
// Production (cvdebug.com): clerk.cvdebug.com

const isProduction = process.env.CONVEX_CLOUD_URL?.includes("shocking-meerkat-209");

export default {
  providers: [
    {
      domain: isProduction
        ? "https://clerk.cvdebug.com"
        : "https://hopeful-doe-56.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};