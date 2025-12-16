import { internalAction } from "./_generated/server";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

export const runEmailTest = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("🧪 Running email test...");
    
    // Send test email
    const result = await ctx.runAction(internalAny.marketing.sendTestEmail, {});
    
    console.log("Test result:", result);
    return result;
  },
});
