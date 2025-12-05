import { query } from "./_generated/server";
import { v } from "convex/values";

// Admin-only query to get all users
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Security check: Only allow specific admin email
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized: Admin access only");
    }

    const users = await ctx.db.query("users").order("desc").collect();
    return users;
  },
});
