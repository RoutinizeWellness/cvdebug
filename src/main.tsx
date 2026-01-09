import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import Onboarding from "@/pages/Onboarding.tsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminWaitlist from "./pages/AdminWaitlist.tsx";
import AdminPage from "./pages/Admin.tsx";
import PricingPage from "./pages/Pricing.tsx";
import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import ATSScannerNurses from "./pages/industry/ATSScannerNurses.tsx";
import MedSurgNurseATSOptimizer from "./pages/industry/MedSurgNurseATSOptimizer.tsx";
import ICUNurseATSOptimizer from "./pages/industry/ICUNurseATSOptimizer.tsx";
import ERNurseATSOptimizer from "./pages/industry/ERNurseATSOptimizer.tsx";
import TravelNurseATSOptimizer from "./pages/industry/TravelNurseATSOptimizer.tsx";
import PediatricNurseATSOptimizer from "./pages/industry/PediatricNurseATSOptimizer.tsx";
import ResumeDebugDataAnalysts from "./pages/industry/ResumeDebugDataAnalysts.tsx";
import FinanceInternshipATSOptimizer from "./pages/industry/FinanceInternshipATSOptimizer.tsx";
import SoftwareEngineerKeywordSniper from "./pages/industry/SoftwareEngineerKeywordSniper.tsx";
import SeniorFrontendEngineerATS from "./pages/industry/SeniorFrontendEngineerATS.tsx";
import BackendEngineerJavaATS from "./pages/industry/BackendEngineerJavaATS.tsx";
import FullStackEngineerATSOptimizer from "./pages/industry/FullStackEngineerATSOptimizer.tsx";
import DevOpsEngineerKubernetesATS from "./pages/industry/DevOpsEngineerKubernetesATS.tsx";
import GoogleSDEOptimize from "./pages/optimize/GoogleSDE.tsx";
import ProjectSettings from "./pages/ProjectSettings.tsx";
import PreviewScan from "./pages/PreviewScan.tsx";
import "./types/global.d.ts";
import { api } from "@/convex/_generated/api";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";
import { getBackendUrl } from "@/config/backend";

// Use hardcoded backend configuration
const convexUrl = getBackendUrl();
console.log("[CVDebug] Using Convex backend:", convexUrl);
const convex = new ConvexReactClient(convexUrl);

// Determine environment to select the correct Clerk Key
// Sandbox/Dev uses the Test Key to avoid "Failed to load script" errors from custom production domains
const isSandbox = typeof window !== "undefined" && (window.location.hostname.includes("vly.sh") || window.location.hostname.includes("localhost"));
const CLERK_PUBLISHABLE_KEY = isSandbox 
  ? "pk_test_aG9wZWZ1bC1kb2UtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA" // Dev/Sandbox Key
  : (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_aG9wZWZ1bC1kb2UtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA"); // Prod Key (fallback to dev if not set)

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

function UserSyncer() {
  const { isSignedIn, userId } = useAuth();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isSignedIn && userId) {
      // Sync user data with Convex backend
      getDeviceFingerprint()
        .then((fingerprint) => {
          storeUser({ deviceFingerprint: fingerprint })
            .catch((err) => console.error("UserSyncer: Failed to store user", err));
        })
        .catch((err) => {
          console.error("UserSyncer: Failed to get fingerprint:", err);
          storeUser({})
            .catch((storeErr) => console.error("UserSyncer: Failed to store user (fallback)", storeErr));
        });
    }
  }, [isSignedIn, userId, storeUser]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <UserSyncer />
          <BrowserRouter>
            <RouteSyncer />
            <Routes>
              {/* Level 1: Public Funnel */}
              <Route path="/" element={<Landing />} />
              <Route path="/preview" element={<PreviewScan />} />
              <Route path="/pricing" element={<PricingPage />} />

              {/* Industry-Specific Landing Pages - Nursing */}
              <Route path="/ats-scanner-for-nurses" element={<ATSScannerNurses />} />
              <Route path="/med-surg-nurse-ats-optimizer" element={<MedSurgNurseATSOptimizer />} />
              <Route path="/icu-nurse-ats-optimizer" element={<ICUNurseATSOptimizer />} />
              <Route path="/er-nurse-ats-optimizer" element={<ERNurseATSOptimizer />} />
              <Route path="/travel-nurse-ats-optimizer" element={<TravelNurseATSOptimizer />} />
              <Route path="/pediatric-nurse-ats-optimizer" element={<PediatricNurseATSOptimizer />} />

              {/* Industry-Specific Landing Pages - Tech & Other */}
              <Route path="/senior-frontend-engineer-ats" element={<SeniorFrontendEngineerATS />} />
              <Route path="/backend-engineer-java-ats" element={<BackendEngineerJavaATS />} />
              <Route path="/full-stack-engineer-ats-optimizer" element={<FullStackEngineerATSOptimizer />} />
              <Route path="/devops-engineer-kubernetes-ats" element={<DevOpsEngineerKubernetesATS />} />
              <Route path="/resume-debug-for-data-analysts" element={<ResumeDebugDataAnalysts />} />
              <Route path="/finance-internship-ats-optimizer" element={<FinanceInternshipATSOptimizer />} />
              <Route path="/software-engineer-keyword-sniper" element={<SoftwareEngineerKeywordSniper />} />

              {/* Company-Specific Optimize Pages */}
              <Route path="/optimize/google-sde" element={<GoogleSDEOptimize />} />

              {/* Level 2: Auth & Onboarding */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Level 3-5: Private Dashboard (handles internal routing) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/projects" element={<Dashboard />} />
              <Route path="/dashboard/resumes" element={<Dashboard />} />
              <Route path="/dashboard/mission/:projectId" element={<Dashboard />} />
              <Route path="/dashboard/tools/cover-letter" element={<Dashboard />} />
              <Route path="/dashboard/tools/linkedin" element={<Dashboard />} />
              <Route path="/dashboard/settings" element={<Dashboard />} />

              {/* Project Settings Demo */}
              <Route path="/project-settings" element={<ProjectSettings />} />

              {/* Payment Success */}
              <Route path="/payment/success" element={<PaymentSuccess />} />
              
              {/* Admin */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/waitlist" element={<AdminWaitlist />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </InstrumentationProvider>
  </StrictMode>,
);