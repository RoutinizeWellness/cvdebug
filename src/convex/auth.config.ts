// Auth configuration for Clerk integration
// Uses CONVEX_SITE_URL from environment (set by Convex automatically)
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};