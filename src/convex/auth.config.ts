// Auth configuration for Clerk integration
// Uses production domain for cvdebug.com
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || "https://cvdebug.com",
      applicationID: "convex",
    },
  ],
};