// Auth configuration for Clerk integration
// Uses CONVEX_SITE_URL from environment (set by Convex automatically)
// Falls back to the Convex deployment URL for local development
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || "https://next-cod-660.convex.site",
      applicationID: "convex",
    },
  ],
};