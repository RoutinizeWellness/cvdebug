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

export const createUserInClerk = internalAction({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const clerkSecretKey = process.env.CLERK_SECRET_KEY;
      if (!clerkSecretKey) {
        console.error("[createUserInClerk] CLERK_SECRET_KEY not configured");
        throw new Error("CLERK_SECRET_KEY not configured");
      }

      // Create user in Clerk
      const response = await fetch("https://api.clerk.com/v1/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clerkSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: [args.email],
          first_name: args.firstName || args.email.split("@")[0],
          last_name: args.lastName || "",
          skip_password_checks: true,
          skip_password_requirement: true,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(`[createUserInClerk] Successfully created user ${args.email} in Clerk`);
        return {
          success: true,
          userId: userData.id,
          tokenIdentifier: userData.id,
        };
      } else {
        const errorText = await response.text();
        console.error(`[createUserInClerk] Failed to create user in Clerk: ${errorText}`);
        throw new Error(`Failed to create user in Clerk: ${errorText}`);
      }
    } catch (error: any) {
      console.error(`[createUserInClerk] Error creating user in Clerk:`, error.message);
      throw error;
    }
  },
});
