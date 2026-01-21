import { Toaster } from "@/components/ui/sonner";
// import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx";
import AuthPage from "@/pages/Auth.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import Onboarding from "@/pages/Onboarding.tsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
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
import PsychiatricNurseResumeScanner from "./pages/industry/PsychiatricNurseResumeScanner.tsx";
import NursePractitionerATSOptimizer from "./pages/industry/NursePractitionerATSOptimizer.tsx";
import CCUCVUNurseATSOptimizer from "./pages/industry/CCUCVUNurseATSOptimizer.tsx";
import DialysisNurseATSScanner from "./pages/industry/DialysisNurseATSScanner.tsx";
import HomeHealthNurseATSOptimizer from "./pages/industry/HomeHealthNurseATSOptimizer.tsx";
import SchoolNurseATSResumeScanner from "./pages/industry/SchoolNurseATSResumeScanner.tsx";
import CaseManagerNurseATSOptimizer from "./pages/industry/CaseManagerNurseATSOptimizer.tsx";
import InfectionControlNurseATS from "./pages/industry/InfectionControlNurseATS.tsx";
import ResumeDebugDataAnalysts from "./pages/industry/ResumeDebugDataAnalysts.tsx";
import FinanceInternshipATSOptimizer from "./pages/industry/FinanceInternshipATSOptimizer.tsx";
import SoftwareEngineerKeywordSniper from "./pages/industry/SoftwareEngineerKeywordSniper.tsx";
import SeniorFrontendEngineerATS from "./pages/industry/SeniorFrontendEngineerATS.tsx";
import BackendEngineerJavaATS from "./pages/industry/BackendEngineerJavaATS.tsx";
import FullStackEngineerATSOptimizer from "./pages/industry/FullStackEngineerATSOptimizer.tsx";
import MachineLearningEngineerATS from "./pages/industry/MachineLearningEngineerATS.tsx";
import DevOpsEngineerKubernetesATS from "./pages/industry/DevOpsEngineerKubernetesATS.tsx";
import IOSEngineerSwiftATSOptimizer from "./pages/industry/IOSEngineerSwiftATSOptimizer.tsx";
import AndroidEngineerKotlinATS from "./pages/industry/AndroidEngineerKotlinATS.tsx";
import CloudArchitectAWSATSScanner from "./pages/industry/CloudArchitectAWSATSScanner.tsx";
import SiteReliabilityEngineerATS from "./pages/industry/SiteReliabilityEngineerATS.tsx";
// Phase 3-5 imports
import RehabNurseATSOptimizer from "./pages/industry/RehabNurseATSOptimizer.tsx";
import WoundCareNurseATSOptimizer from "./pages/industry/WoundCareNurseATSOptimizer.tsx";
import PainManagementNurseATS from "./pages/industry/PainManagementNurseATS.tsx";
import AmbulatoryCareNurseATS from "./pages/industry/AmbulatoryCareNurseATS.tsx";
import RadiologyNurseATSScanner from "./pages/industry/RadiologyNurseATSScanner.tsx";
import QAEngineerAutomationATS from "./pages/industry/QAEngineerAutomationATS.tsx";
import SecurityEngineerATSOptimizer from "./pages/industry/SecurityEngineerATSOptimizer.tsx";
import BlockchainEngineerATSScanner from "./pages/industry/BlockchainEngineerATSScanner.tsx";
import MobileEngineerReactNativeATS from "./pages/industry/MobileEngineerReactNativeATS.tsx";
import EmbeddedSystemsEngineerATS from "./pages/industry/EmbeddedSystemsEngineerATS.tsx";
import TransplantNurseATSOptimizer from "./pages/industry/TransplantNurseATSOptimizer.tsx";
import CardiologyNurseATSScanner from "./pages/industry/CardiologyNurseATSScanner.tsx";
import NeurologyNurseATSOptimizer from "./pages/industry/NeurologyNurseATSOptimizer.tsx";
import EndoscopyNurseATSScanner from "./pages/industry/EndoscopyNurseATSScanner.tsx";
import GolangBackendEngineerATS from "./pages/industry/GolangBackendEngineerATS.tsx";
import RustSystemsEngineerATS from "./pages/industry/RustSystemsEngineerATS.tsx";
import PlatformEngineerATSOptimizer from "./pages/industry/PlatformEngineerATSOptimizer.tsx";
import SolutionsArchitectATSScanner from "./pages/industry/SolutionsArchitectATSScanner.tsx";
import FinancialAnalystATSOptimizer from "./pages/industry/FinancialAnalystATSOptimizer.tsx";
import MarketingManagerATSScanner from "./pages/industry/MarketingManagerATSScanner.tsx";
import ProductManagerATSOptimizer from "./pages/industry/ProductManagerATSOptimizer.tsx";
import UXDesignerATSOptimizer from "./pages/industry/UXDesignerATSOptimizer.tsx";
import GoogleSDEOptimize from "./pages/optimize/GoogleSDE.tsx";
import ProjectSettings from "./pages/ProjectSettings.tsx";
import PreviewScan from "./pages/PreviewScan.tsx";
import { Blog } from "./pages/blog/Blog.tsx";
import { BlogPost } from "./pages/blog/BlogPost.tsx";
import HowToBeatATSResumeScanners from "./pages/blog/HowToBeatATSResumeScanners.tsx";
import UnderstandingATSRobotView from "./pages/blog/UnderstandingATSRobotView.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsConditions from "./pages/TermsConditions.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import "./types/global.d.ts";
import { api } from "@/convex/_generated/api";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";
import { getBackendUrl } from "@/config/backend";
import { I18nProvider } from "@/contexts/I18nContext";

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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="w-full h-full"
      >
        <Routes location={location}>
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
          <Route path="/psychiatric-nurse-resume-scanner" element={<PsychiatricNurseResumeScanner />} />
          <Route path="/nurse-practitioner-ats-optimizer" element={<NursePractitionerATSOptimizer />} />
          <Route path="/ccu-cvu-nurse-ats-optimizer" element={<CCUCVUNurseATSOptimizer />} />
          <Route path="/dialysis-nurse-ats-scanner" element={<DialysisNurseATSScanner />} />
          <Route path="/home-health-nurse-ats-optimizer" element={<HomeHealthNurseATSOptimizer />} />
          <Route path="/school-nurse-ats-resume-scanner" element={<SchoolNurseATSResumeScanner />} />
          <Route path="/case-manager-nurse-ats-optimizer" element={<CaseManagerNurseATSOptimizer />} />
          <Route path="/infection-control-nurse-ats" element={<InfectionControlNurseATS />} />
          <Route path="/rehab-nurse-ats-optimizer" element={<RehabNurseATSOptimizer />} />
          <Route path="/wound-care-nurse-ats-optimizer" element={<WoundCareNurseATSOptimizer />} />
          <Route path="/pain-management-nurse-ats" element={<PainManagementNurseATS />} />
          <Route path="/ambulatory-care-nurse-ats" element={<AmbulatoryCareNurseATS />} />
          <Route path="/radiology-nurse-ats-scanner" element={<RadiologyNurseATSScanner />} />
          <Route path="/transplant-nurse-ats-optimizer" element={<TransplantNurseATSOptimizer />} />
          <Route path="/cardiology-nurse-ats-scanner" element={<CardiologyNurseATSScanner />} />
          <Route path="/neurology-nurse-ats-optimizer" element={<NeurologyNurseATSOptimizer />} />
          <Route path="/endoscopy-nurse-ats-scanner" element={<EndoscopyNurseATSScanner />} />

          {/* Industry-Specific Landing Pages - Tech & Other */}
          <Route path="/senior-frontend-engineer-ats" element={<SeniorFrontendEngineerATS />} />
          <Route path="/backend-engineer-java-ats" element={<BackendEngineerJavaATS />} />
          <Route path="/full-stack-engineer-ats-optimizer" element={<FullStackEngineerATSOptimizer />} />
          <Route path="/machine-learning-engineer-ats" element={<MachineLearningEngineerATS />} />
          <Route path="/devops-engineer-kubernetes-ats" element={<DevOpsEngineerKubernetesATS />} />
          <Route path="/ios-engineer-swift-ats-optimizer" element={<IOSEngineerSwiftATSOptimizer />} />
          <Route path="/android-engineer-kotlin-ats" element={<AndroidEngineerKotlinATS />} />
          <Route path="/cloud-architect-aws-ats-scanner" element={<CloudArchitectAWSATSScanner />} />
          <Route path="/site-reliability-engineer-ats" element={<SiteReliabilityEngineerATS />} />
          <Route path="/qa-engineer-automation-ats" element={<QAEngineerAutomationATS />} />
          <Route path="/security-engineer-ats-optimizer" element={<SecurityEngineerATSOptimizer />} />
          <Route path="/blockchain-engineer-ats-scanner" element={<BlockchainEngineerATSScanner />} />
          <Route path="/mobile-engineer-react-native-ats" element={<MobileEngineerReactNativeATS />} />
          <Route path="/embedded-systems-engineer-ats" element={<EmbeddedSystemsEngineerATS />} />
          <Route path="/golang-backend-engineer-ats" element={<GolangBackendEngineerATS />} />
          <Route path="/rust-systems-engineer-ats" element={<RustSystemsEngineerATS />} />
          <Route path="/platform-engineer-ats-optimizer" element={<PlatformEngineerATSOptimizer />} />
          <Route path="/solutions-architect-ats-scanner" element={<SolutionsArchitectATSScanner />} />
          <Route path="/resume-debug-for-data-analysts" element={<ResumeDebugDataAnalysts />} />
          <Route path="/finance-internship-ats-optimizer" element={<FinanceInternshipATSOptimizer />} />
          <Route path="/software-engineer-keyword-sniper" element={<SoftwareEngineerKeywordSniper />} />
          <Route path="/financial-analyst-ats-optimizer" element={<FinancialAnalystATSOptimizer />} />
          <Route path="/marketing-manager-ats-scanner" element={<MarketingManagerATSScanner />} />
          <Route path="/product-manager-ats-optimizer" element={<ProductManagerATSOptimizer />} />
          <Route path="/ux-designer-ats-optimizer" element={<UXDesignerATSOptimizer />} />

          {/* Company-Specific Optimize Pages */}
          <Route path="/optimize/google-sde" element={<GoogleSDEOptimize />} />

          {/* Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/how-to-beat-ats-resume-scanners" element={<HowToBeatATSResumeScanners />} />
          <Route path="/blog/understanding-ats-robot-view" element={<UnderstandingATSRobotView />} />

          {/* Legal & Info Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/contact" element={<ContactUs />} />

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
      </motion.div>
    </AnimatePresence>
  );
}

// Hide SSR content when React loads
document.body.classList.add('react-loaded');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      {/* <VlyToolbar /> */}
      <InstrumentationProvider>
        <I18nProvider>
          <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
              <UserSyncer />
              <BrowserRouter>
                <RouteSyncer />
                <AnimatedRoutes />
              </BrowserRouter>
              <Toaster />
            </ConvexProviderWithClerk>
          </ClerkProvider>
        </I18nProvider>
      </InstrumentationProvider>
    </ErrorBoundary>
  </StrictMode>,
);