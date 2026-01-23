// Auth configuration for Clerk integration
// Supports both development and production Clerk instances
// Development: hopeful-doe-56.clerk.accounts.dev (pk_test_...)
// Production: clerk.cvdebug.com (pk_live_...)

export default {
  providers: [
    // Production Clerk instance (cvdebug.com)
    {
      domain: "https://clerk.cvdebug.com",
      applicationID: "convex",
    },
    // Development Clerk instance (vly.sh, localhost)
    {
      domain: "https://hopeful-doe-56.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};