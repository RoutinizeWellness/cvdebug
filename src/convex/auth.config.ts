// Auth configuration for Clerk integration
// Uses cvdebug.com for production
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || "https://lazy-badgers-roll.vly.sh",
      applicationID: "convex",
    },
  ],
};