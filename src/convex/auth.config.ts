// Auth configuration for Clerk integration
// Uses the vly.sh domain that Clerk is configured with
export default {
  providers: [
    {
      domain: "https://lazy-badgers-roll.vly.sh",
      applicationID: "convex",
    },
  ],
};