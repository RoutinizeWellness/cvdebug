import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

export function useAuth() {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user } = useUser();

  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    user: user ? {
      ...user,
      email: user.primaryEmailAddress?.emailAddress,
      _id: user.id, // Mapping Clerk ID to _id for compatibility
    } : undefined,
    signIn: () => {}, // Clerk handles sign in via components
    signOut,
  };
}