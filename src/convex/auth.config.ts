// Auth configuration for Clerk integration
// Uses Clerk's issuer domain from your Clerk account
export default {
  providers: [
    {
      domain: "https://hopeful-doe-56.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};