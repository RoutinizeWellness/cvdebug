import { query, QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Get the current signed in user identity. Returns null if the user is not signed in.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});

/**
 * Use this function internally to get the current user data.
 */
export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return {
    _id: identity.subject, // Use the subject (Clerk ID) as the ID
    ...identity,
  };
};