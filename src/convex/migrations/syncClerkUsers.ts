"use node";

"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";

// Workaround for TypeScript instantiation depth issue
const internalAny = require("../_generated/api").internal;

/**
 * Migration script to sync existing Clerk users to Convex
 * Run with: npx convex run migrations:syncClerkUsers
 */
export const syncClerkUsers = internalAction({
  args: {},
  handler: async (ctx) => {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkSecretKey) {
      console.error("[Migration] CLERK_SECRET_KEY not found in environment variables");
      throw new Error("CLERK_SECRET_KEY is required. Add it to your Convex environment variables.");
    }

    console.log("[Migration] Starting Clerk user sync...");

    try {
      // Fetch all users from Clerk API
      const response = await fetch("https://api.clerk.com/v1/users?limit=100", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${clerkSecretKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Migration] Clerk API error:", errorText);
        throw new Error(`Clerk API returned ${response.status}: ${errorText}`);
      }

      const clerkUsers = await response.json();
      console.log(`[Migration] Found ${clerkUsers.length} users in Clerk`);

      let syncedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      // Process each user
      for (const clerkUser of clerkUsers) {
        try {
          const userId = clerkUser.id;
          const email = clerkUser.email_addresses?.[0]?.email_address || "";
          const firstName = clerkUser.first_name || "";
          const lastName = clerkUser.last_name || "";
          const name = `${firstName} ${lastName}`.trim() || email.split("@")[0];

          console.log(`[Migration] Processing user: ${email} (${userId})`);

          // Check if user already exists in Convex
          const existingUser = await ctx.runQuery(internalAny.users.getUserInternal, {
            subject: userId,
          });

          if (existingUser) {
            console.log(`[Migration] ✓ User ${email} already exists, skipping`);
            skippedCount++;
            continue;
          }

          // Create user in Convex
          await ctx.runMutation(internalAny.users.createUserFromMigration, {
            tokenIdentifier: userId,
            email: email,
            name: name,
          });

          console.log(`[Migration] ✅ Created user: ${email}`);
          syncedCount++;

        } catch (userError: any) {
          console.error(`[Migration] ❌ Error processing user:`, userError.message);
          errorCount++;
        }
      }

      const summary = {
        total: clerkUsers.length,
        synced: syncedCount,
        skipped: skippedCount,
        errors: errorCount,
      };

      console.log("[Migration] ✅ Sync complete:", summary);
      return summary;

    } catch (error: any) {
      console.error("[Migration] ❌ Fatal error:", error.message);
      throw error;
    }
  },
});
