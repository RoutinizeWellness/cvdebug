import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const payment = searchParams.get("payment");
  
  // Construct redirect URL preserving both plan and payment status
  let redirectUrl = "/dashboard";
  const params = new URLSearchParams();
  if (plan) params.append("plan", plan);
  if (payment) params.append("payment", payment);
  
  if (params.toString()) {
    redirectUrl = `/dashboard?${params.toString()}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
          <div className="h-4 w-32 bg-primary/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectUrl} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-purple-500/10 to-background opacity-60"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 h-64 w-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 h-80 w-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="w-full max-w-md p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-6 scale-150 animate-in zoom-in duration-500">
            <Logo />
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in slide-in-from-bottom-2 duration-500 delay-100">
            {isSignIn ? "Welcome back" : "Join the Beta Launch"}
          </h1>
          <p className="text-muted-foreground mt-3 text-base animate-in slide-in-from-bottom-2 duration-500 delay-200">
            {isSignIn ? "Enter your credentials to access your dashboard" : "Get 15 days free access with our Beta Launch offer."}
          </p>
          
          {!isSignIn && (
            <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-full px-4 py-2 animate-in slide-in-from-bottom-2 duration-500 delay-300">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold text-primary">Limited Beta Access Available</span>
            </div>
          )}
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-3 duration-500 delay-200">
          {isSignIn ? (
            <SignIn 
              routing="hash"
              forceRedirectUrl={redirectUrl}
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none w-full bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  header: "hidden",
                  footer: "hidden",
                  footerAction: "hidden",
                  footerActionLink: "hidden",
                  footerActionText: "hidden",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
                  formFieldLabel: "text-foreground",
                  formFieldInput: "bg-background border-border text-foreground",
                }
              }}
            />
          ) : (
            <SignUp 
              routing="hash"
              forceRedirectUrl={redirectUrl}
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none w-full bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  header: "hidden",
                  footer: "hidden",
                  footerAction: "hidden",
                  footerActionLink: "hidden",
                  footerActionText: "hidden",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
                  formFieldLabel: "text-foreground",
                  formFieldInput: "bg-background border-border text-foreground",
                }
              }}
            />
          )}
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-bold text-primary hover:underline transition-all hover:scale-105 inline-block"
            >
              {isSignIn ? "Sign up & Get Beta Access" : "Sign in"}
            </button>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground animate-in fade-in duration-700 delay-500">
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
            <span className="font-medium">Secure Login</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">10K+ Users</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">No Credit Card</span>
          </div>
        </div>
      </div>
    </div>
  );
}