"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const deleteUserFromClerk = internalAction({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    // Extract the Clerk user ID from the token identifier
    // Format is typically "https://..." or just the user ID
    const userId = args.tokenIdentifier.split("|").pop() || args.tokenIdentifier;

    try {
      // Use Clerk's backend API to delete the user
      const clerkSecretKey = process.env.CLERK_SECRET_KEY;
      if (!clerkSecretKey) {
        console.error("[deleteUserFromClerk] CLERK_SECRET_KEY not configured");
        return;
      }

      const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${clerkSecretKey}`,
        },
      });

      if (response.ok) {
        console.log(`[deleteUserFromClerk] Successfully deleted user ${userId} from Clerk`);
      } else {
        const errorText = await response.text();
        console.error(`[deleteUserFromClerk] Failed to delete user from Clerk: ${errorText}`);
      }
    } catch (error: any) {
      console.error(`[deleteUserFromClerk] Error deleting user from Clerk:`, error.message);
    }
  },
});
