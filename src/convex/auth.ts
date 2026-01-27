// THIS FILE IS DEPRECATED. We are using Clerk for authentication.
// See src/convex/auth.config.ts for the Clerk configuration.

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { emailOtp } from "./auth/emailOtp";

// Exporting dummy objects to prevent import errors if referenced elsewhere, 
// but these should not be used.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [],
});