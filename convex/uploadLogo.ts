import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const storeLogo = internalMutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("New logo storage ID:", args.storageId);
    return args.storageId;
  },
});
