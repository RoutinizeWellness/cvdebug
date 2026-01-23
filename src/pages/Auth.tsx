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
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

const apiAny: any = api;

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [searchParams] = useSearchParams();
  const storeUser = useMutation(apiAny.users.storeUser);
  const plan = searchParams.get("plan");
  const payment = searchParams.get("payment");
  const { t } = useI18n();
  
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
        {/* Background glow */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-[120px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* Logo with glow */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-2xl"></div>
            <div className="relative h-16 w-16 bg-[#FFFFFF] backdrop-blur-sm rounded-full flex items-center justify-center border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>

          {/* Loading text */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-2 w-32 bg-[#F8FAFC] rounded-full overflow-hidden border border-[#E2E8F0]">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <p className="text-sm text-[#475569] font-mono">{t.auth.loading}</p>
          </div>
        </motion.div>
      </div>
    );
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
      formButtonPrimary: "bg-gradient-to-r from-[#1E293B] to-[#334155] hover:from-[#0F172A] hover:to-[#1E293B] text-white shadow-[0_10px_40px_-10px_rgba(30,41,59,0.3)] hover:shadow-[0_10px_40px_-10px_rgba(30,41,59,0.5)] transition-all rounded-lg py-3 font-bold w-full border-0 transform hover:-translate-y-0.5",
      formFieldLabel: "text-xs font-mono text-[#1E293B] font-medium tracking-wide uppercase ml-1 mb-1.5",
      formFieldInput: "block w-full pl-10 pr-3 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/50 focus:shadow-[0_0_20px_rgba(30,41,59,0.2)] font-mono transition-all duration-300",
      formFieldRow: "w-full space-y-1",
      formFieldInputGroup: "w-full relative group",
      form: "w-full flex flex-col gap-5",
      identityPreviewText: "hidden",
      identityPreviewEditButton: "hidden",
      footerPages: "hidden",
      footerPagesLink: "hidden",
      socialButtonsBlockButton: "flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1E293B] transition-all duration-200 text-sm font-medium text-[#475569] hover:text-[#0F172A] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]",
      socialButtonsBlockButtonText: "text-[#475569] font-medium",
      socialButtonsIconButton: "text-[#0F172A]",
      dividerLine: "border-[#E2E8F0]",
      dividerText: "text-[#64748B] text-xs font-mono uppercase tracking-widest mx-4",
      formFieldAction: "text-xs text-[#1E293B] hover:text-[#334155] transition-colors",
      otpCodeFieldInput: "bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/50 focus:shadow-[0_0_15px_rgba(30,41,59,0.2)] rounded-lg transition-all duration-300",
      formResendCodeLink: "text-[#1E293B] hover:text-[#334155] font-medium",
      identityPreview: "bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg",
      formFieldSuccessText: "text-emerald-500 font-semibold text-xs",
      formFieldErrorText: "text-red-500 font-semibold text-xs",
      alertText: "text-[#475569] text-sm",
      alert: "bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3",
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] overflow-hidden relative font-display antialiased">
      {/* Left side - Technical Blueprint */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] overflow-hidden">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}></div>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E293B]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#334155]/20 rounded-full blur-[120px]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Logo className="h-10 w-auto" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              {t.auth.headline}
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              {t.auth.subtitle}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#64748B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#64748B]"></div>
                </div>
                <div>
                  <p className="font-semibold">{t.auth.atsVision}</p>
                  <p className="text-sm text-slate-400">{t.auth.atsVisionDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#64748B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#64748B]"></div>
                </div>
                <div>
                  <p className="font-semibold">{t.auth.aiAnalysis}</p>
                  <p className="text-sm text-slate-400">{t.auth.aiAnalysisDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#64748B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#64748B]"></div>
                </div>
                <div>
                  <p className="font-semibold">{t.auth.trackApps}</p>
                  <p className="text-sm text-slate-400">{t.auth.trackAppsDesc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background glow for mobile */}
        <div className="lg:hidden fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-[120px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo className="h-10" />
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-8 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all duration-200 ${
                isSignIn
                  ? 'bg-gradient-to-r from-[#1E293B] to-[#334155] text-white shadow-[0_10px_40px_-10px_rgba(30,41,59,0.3)]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {t.auth.signIn || "Sign In"}
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all duration-200 ${
                !isSignIn
                  ? 'bg-gradient-to-r from-[#1E293B] to-[#334155] text-white shadow-[0_10px_40px_-10px_rgba(30,41,59,0.3)]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {t.auth.signUp || "Sign Up"}
            </button>
          </div>

          {/* Clerk Auth Components */}
          <div className="bg-[#FFFFFF] rounded-2xl p-8 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            {isSignIn ? (
              <SignIn
                appearance={clerkAppearance}
                routing="path"
                path="/auth"
                signUpUrl="/auth"
                forceRedirectUrl={redirectUrl}
              />
            ) : (
              <SignUp
                appearance={clerkAppearance}
                routing="path"
                path="/auth"
                signInUrl="/auth"
                forceRedirectUrl={redirectUrl}
              />
            )}
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-[#64748B] mt-6">
            {t.auth.termsAgreement}
          </p>
        </motion.div>
      </div>
    </div>
  );
}