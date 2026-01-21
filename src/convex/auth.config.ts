// Auth configuration for Clerk integration
// Uses environment variable to determine which domain to use
export default {
  providers: [
    {
      // Production domain (only used when deployed to cvdebug.com)
      domain: "https://clerk.cvdebug.com",
      applicationID: "convex",
    },
    {
      // Development domain (used for local development)
      domain: "https://hopeful-doe-56.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};