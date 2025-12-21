import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";

const apiAny: any = api;

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [searchParams] = useSearchParams();
  const storeUser = useMutation(apiAny.users.storeUser);
  const plan = searchParams.get("plan");
  const payment = searchParams.get("payment");
  
  useEffect(() => {
    if (isAuthenticated) {
      // Capture device fingerprint and store user
      getDeviceFingerprint().then(fingerprint => {
        storeUser({ deviceFingerprint: fingerprint });
      }).catch(err => {
        console.error("Failed to get fingerprint:", err);
        storeUser(); // Fallback without fingerprint
      });
    }
  }, [isAuthenticated, storeUser]);
  
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

  const clerkAppearance = {
    elements: {
      rootBox: "w-full flex justify-center",
      card: "shadow-none border-none w-full bg-transparent p-0 flex flex-col items-center",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      header: "hidden",
      footer: "hidden",
      footerAction: "hidden",
      footerActionLink: "hidden",
      footerActionText: "hidden",
      formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(249,245,6,0.5)] hover:shadow-[0_0_25px_-5px_rgba(249,245,6,0.6)] transition-all rounded-lg py-3 font-semibold w-full",
      formFieldLabel: "text-zinc-300 text-sm font-medium",
      formFieldInput: "bg-[#121212] border-zinc-800 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-lg h-11 transition-colors w-full",
      formFieldRow: "w-full",
      formFieldInputGroup: "w-full",
      form: "w-full flex flex-col gap-4",
      identityPreviewText: "hidden",
      identityPreviewEditButton: "hidden",
      footerPages: "hidden",
      footerPagesLink: "hidden",
      socialButtonsBlockButton: "bg-[#121212] border border-zinc-800 text-white hover:bg-zinc-900 hover:border-primary/30 transition-all rounded-lg w-full",
      socialButtonsBlockButtonText: "text-white font-medium",
      socialButtonsIconButton: "text-white",
      dividerLine: "bg-zinc-800",
      dividerText: "text-zinc-600 text-xs uppercase tracking-wider",
      formFieldAction: "text-primary hover:text-primary/80",
      otpCodeFieldInput: "bg-[#121212] border-zinc-800 text-white focus:border-primary focus:ring-1 focus:ring-primary/50",
      formResendCodeLink: "text-primary hover:text-primary/80",
      identityPreview: "bg-[#121212] border-zinc-800 rounded-lg",
      formFieldSuccessText: "text-green-400",
      formFieldErrorText: "text-red-400",
      alertText: "text-zinc-300",
      alert: "bg-[#121212] border-zinc-800 rounded-lg",
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white overflow-hidden relative px-4 py-8">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="relative w-full max-w-[440px] z-10">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo showText={false} className="mb-4" iconClassName="h-14 w-14" />
          <h1 className="text-2xl font-bold tracking-tight text-white">CVDebug</h1>
          <p className="text-zinc-500 text-sm mt-1">Resume ATS Optimization</p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl shadow-[0_0_100px_-20px_rgba(249,245,6,0.15)] p-8 w-full">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              {isSignIn ? "Welcome Back" : "Get Started"}
            </h2>
            <p className="text-zinc-400 text-sm">
              {isSignIn 
                ? "Sign in to access your resume analytics dashboard" 
                : "Create an account to optimize your CV for ATS systems"}
            </p>
          </div>

          {isSignIn ? (
            <SignIn 
              routing="hash"
              forceRedirectUrl={redirectUrl}
              appearance={clerkAppearance}
            />
          ) : (
            <SignUp 
              routing="hash"
              forceRedirectUrl={redirectUrl}
              appearance={clerkAppearance}
            />
          )}
          
          <div className="mt-6 text-center text-sm border-t border-zinc-800 pt-6">
            <span className="text-zinc-400">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all ml-1"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-6 flex justify-center items-center space-x-4 text-xs text-zinc-600">
          <span className="text-zinc-700">•</span>
          <a href="/terms" className="hover:text-zinc-400 transition-colors">Terms</a>
          <span className="text-zinc-700">•</span>
          <a href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <span className="text-zinc-700">•</span>
          <a href="https://x.com/Aherme13" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Support</a>
        </div>
      </div>
    </div>
  );
}