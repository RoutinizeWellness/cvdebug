// Auth configuration for Clerk integration
// Uses the actual working vly.sh domain
export default {
  providers: [
    {
      // Use the working vly.sh domain until custom domain is configured
      domain: process.env.CONVEX_SITE_URL || "https://lazy-badgers-roll.vly.sh",
      applicationID: "convex",
    },
  ],
};