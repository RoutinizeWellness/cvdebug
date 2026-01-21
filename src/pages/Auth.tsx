import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useSearchParams } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { AuthVisuals } from "@/components/auth/AuthVisuals";
import { AuthForm } from "@/components/auth/AuthForm";

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
      getDeviceFingerprint().then(fingerprint => {
        storeUser({ deviceFingerprint: fingerprint });
      }).catch(err => {
        console.error("Failed to get fingerprint:", err);
        storeUser();
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
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectUrl} replace />;
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
      formButtonPrimary: "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] transition-all rounded-lg py-3 font-bold w-full border-0 transform hover:-translate-y-0.5",
      formFieldLabel: "text-xs font-mono text-[#3B82F6] font-medium tracking-wide uppercase ml-1 mb-1.5",
      formFieldInput: "block w-full pl-10 pr-3 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] font-mono transition-all duration-300",
      formFieldRow: "w-full space-y-1",
      formFieldInputGroup: "w-full relative group",
      form: "w-full flex flex-col gap-5",
      identityPreviewText: "hidden",
      identityPreviewEditButton: "hidden",
      footerPages: "hidden",
      footerPagesLink: "hidden",
      socialButtonsBlockButton: "flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3B82F6] transition-all duration-200 text-sm font-medium text-[#475569] hover:text-[#0F172A] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]",
      socialButtonsBlockButtonText: "text-[#475569] font-medium",
      socialButtonsIconButton: "text-[#0F172A]",
      dividerLine: "border-[#E2E8F0]",
      dividerText: "text-[#64748B] text-xs font-mono uppercase tracking-widest mx-4",
      formFieldAction: "text-xs text-[#3B82F6] hover:text-[#8B5CF6] transition-colors",
      otpCodeFieldInput: "bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-lg transition-all duration-300",
      formResendCodeLink: "text-[#3B82F6] hover:text-[#8B5CF6] font-medium",
      identityPreview: "bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg",
      formFieldSuccessText: "text-emerald-500 font-semibold text-xs",
      formFieldErrorText: "text-red-500 font-semibold text-xs",
      alertText: "text-[#475569] text-sm",
      alert: "bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3",
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] overflow-hidden relative font-display antialiased">
      <AuthVisuals />
      
      <AuthForm 
        isSignIn={isSignIn} 
        setIsSignIn={setIsSignIn} 
        redirectUrl={redirectUrl} 
        clerkAppearance={clerkAppearance} 
      />
    </div>
  );
}