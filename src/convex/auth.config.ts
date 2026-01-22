// Auth configuration for Clerk integration
// Uses dynamic domain configuration
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || "https://lazy-badgers-roll.vly.sh",
      applicationID: "convex",
    },
  ],
};