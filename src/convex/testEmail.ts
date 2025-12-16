import { action } from "./_generated/server";
import { v } from "convex/values";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

export const sendTestWelcomeEmail = action({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email || "tiniboti@gmail.com";
    const name = args.name || "Test User";
    
    await ctx.runAction(internalAny.marketing.sendOnboardingEmail, {
      email,
      name,
      variant: "A",
    });
    
    return { success: true, sentTo: email };
  },
});