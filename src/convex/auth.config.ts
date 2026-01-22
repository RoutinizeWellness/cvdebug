// Auth configuration for Clerk integration
// Uses environment variable to determine which domain to use
export default {
  providers: [
    {
      // Use the CONVEX_SITE_URL environment variable for dynamic domain configuration
      // This allows the same code to work across different deployments
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};