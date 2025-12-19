import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const apiAny: any = api;

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [searchParams] = useSearchParams();
  const storeUser = useMutation(apiAny.users.storeUser);
  const plan = searchParams.get("plan");
  const payment = searchParams.get("payment");
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      storeUser().catch(err => {
        console.error("Failed to store user:", err);
      });
    }
  }, [isAuthenticated, isLoading, storeUser]);
  
  let redirectUrl = "/dashboard";
  const params = new URLSearchParams();
  if (plan) params.append("plan", plan);
  if (payment) params.append("payment", payment);
  
  if (params.toString()) {
    redirectUrl = `/dashboard?${params.toString()}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden relative px-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="relative w-full max-w-[420px] z-10">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
            <Logo variant="light" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">CVDebug</h1>
        </div>

        {/* Main Card */}
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-lg shadow-[0_0_100px_-20px_rgba(124,59,237,0.15)] p-8 w-full">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              {isSignIn ? "Welcome Back" : "Debug your resume visibility."}
            </h2>
            <p className="text-zinc-400 text-sm">
              {isSignIn 
                ? "Enter your details to access your resume analytics." 
                : "Join CVDebug to optimize your CV for Applicant Tracking Systems."}
            </p>
          </div>

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
                  formButtonPrimary: "bg-[#7c3bed] hover:bg-[#6d32d6] text-white shadow-[0_0_20px_-5px_rgba(124,59,237,0.5)] hover:shadow-[0_0_25px_-5px_rgba(124,59,237,0.6)] transition-all rounded-lg py-3 font-semibold",
                  formFieldLabel: "text-white text-sm font-medium",
                  formFieldInput: "bg-[#121212] border-zinc-800 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-lg h-11 transition-colors",
                  identityPreviewText: "hidden",
                  identityPreviewEditButton: "hidden",
                  footerPages: "hidden",
                  footerPagesLink: "hidden",
                  socialButtonsBlockButton: "bg-[#121212] border border-zinc-800 text-white hover:bg-zinc-900 transition-colors rounded-lg",
                  dividerLine: "bg-zinc-800",
                  dividerText: "text-zinc-600 text-xs uppercase tracking-wider",
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
                  formButtonPrimary: "bg-[#7c3bed] hover:bg-[#6d32d6] text-white shadow-[0_0_20px_-5px_rgba(124,59,237,0.5)] hover:shadow-[0_0_25px_-5px_rgba(124,59,237,0.6)] transition-all rounded-lg py-3 font-semibold",
                  formFieldLabel: "text-zinc-300 text-sm font-medium",
                  formFieldInput: "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-primary focus:bg-zinc-900 focus:ring-1 focus:ring-primary/50 rounded-lg py-3 transition-all",
                  identityPreviewText: "hidden",
                  identityPreviewEditButton: "hidden",
                  footerPages: "hidden",
                  footerPagesLink: "hidden",
                  socialButtonsBlockButton: "bg-zinc-900/50 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors rounded-lg",
                  dividerLine: "bg-zinc-800",
                  dividerText: "text-zinc-600 text-xs uppercase tracking-wider",
                }
              }}
            />
          )}
          
          <div className="mt-6 text-center text-sm">
            <span className="text-zinc-400">
              {isSignIn ? "New to CVDebug? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all"
            >
              {isSignIn ? "Create an account" : "Log In"}
            </button>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-8 flex justify-center space-x-6 text-xs text-zinc-600">
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Docs</a>
        </div>
      </div>
    </div>
  );
}