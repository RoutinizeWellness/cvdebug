// Auth configuration for Clerk integration
// Uses environment variable to determine which domain to use
export default {
  providers: [
    {
      // Use the CONVEX_SITE_URL environment variable for dynamic domain configuration
      // Falls back to resumeatsoptimizer.vly.site if not set
      domain: process.env.CONVEX_SITE_URL || "https://resumeatsoptimizer.vly.site",
      applicationID: "convex",
    },
  ],
};