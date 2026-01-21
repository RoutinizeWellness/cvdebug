import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/contexts/I18nContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./index.css";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PreviewScan from "./pages/PreviewScan";
import BlogPost from "./pages/blog/BlogPost";
import Blog from "./pages/blog/Blog";
import Admin from "./pages/Admin";
import AdminWaitlist from "./pages/AdminWaitlist";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ProjectSettings from "./pages/ProjectSettings";

// Industry Pages
import SoftwareEngineerKeywordSniper from "./pages/industry/SoftwareEngineerKeywordSniper";
import MarketingManagerATSScanner from "./pages/industry/MarketingManagerATSScanner";
import FinancialAnalystATSOptimizer from "./pages/industry/FinancialAnalystATSOptimizer";
import ProductManagerATSOptimizer from "./pages/industry/ProductManagerATSOptimizer";
import UXDesignerATSOptimizer from "./pages/industry/UXDesignerATSOptimizer";
import TravelNurseATSOptimizer from "./pages/industry/TravelNurseATSOptimizer";
import ICUNurseATSOptimizer from "./pages/industry/ICUNurseATSOptimizer";
import ERNurseATSOptimizer from "./pages/industry/ERNurseATSOptimizer";
import MedSurgNurseATSOptimizer from "./pages/industry/MedSurgNurseATSOptimizer";
import PediatricNurseATSOptimizer from "./pages/industry/PediatricNurseATSOptimizer";
import NursePractitionerATSOptimizer from "./pages/industry/NursePractitionerATSOptimizer";
import CaseManagerNurseATSOptimizer from "./pages/industry/CaseManagerNurseATSOptimizer";
import HomeHealthNurseATSOptimizer from "./pages/industry/HomeHealthNurseATSOptimizer";
import SchoolNurseATSResumeScanner from "./pages/industry/SchoolNurseATSResumeScanner";
import PsychiatricNurseResumeScanner from "./pages/industry/PsychiatricNurseResumeScanner";
import DialysisNurseATSScanner from "./pages/industry/DialysisNurseATSScanner";
import WoundCareNurseATSOptimizer from "./pages/industry/WoundCareNurseATSOptimizer";
import RehabNurseATSOptimizer from "./pages/industry/RehabNurseATSOptimizer";
import TransplantNurseATSOptimizer from "./pages/industry/TransplantNurseATSOptimizer";
import NeurologyNurseATSOptimizer from "./pages/industry/NeurologyNurseATSOptimizer";
import CardiologyNurseATSScanner from "./pages/industry/CardiologyNurseATSScanner";
import EndoscopyNurseATSScanner from "./pages/industry/EndoscopyNurseATSScanner";
import RadiologyNurseATSScanner from "./pages/industry/RadiologyNurseATSScanner";
import InfectionControlNurseATS from "./pages/industry/InfectionControlNurseATS";
import PainManagementNurseATS from "./pages/industry/PainManagementNurseATS";
import AmbulatoryCareNurseATS from "./pages/industry/AmbulatoryCareNurseATS";
import CCUCVUNurseATSOptimizer from "./pages/industry/CCUCVUNurseATSOptimizer";
import ATSScannerNurses from "./pages/industry/ATSScannerNurses";
import ResumeDebugDataAnalysts from "./pages/industry/ResumeDebugDataAnalysts";
import SecurityEngineerATSOptimizer from "./pages/industry/SecurityEngineerATSOptimizer";
import FullStackEngineerATSOptimizer from "./pages/industry/FullStackEngineerATSOptimizer";
import DevOpsEngineerKubernetesATS from "./pages/industry/DevOpsEngineerKubernetesATS";
import BackendEngineerJavaATS from "./pages/industry/BackendEngineerJavaATS";
import SeniorFrontendEngineerATS from "./pages/industry/SeniorFrontendEngineerATS";
import MachineLearningEngineerATS from "./pages/industry/MachineLearningEngineerATS";
import SiteReliabilityEngineerATS from "./pages/industry/SiteReliabilityEngineerATS";
import MobileEngineerReactNativeATS from "./pages/industry/MobileEngineerReactNativeATS";
import QAEngineerAutomationATS from "./pages/industry/QAEngineerAutomationATS";
import CloudArchitectAWSATSScanner from "./pages/industry/CloudArchitectAWSATSScanner";
import EmbeddedSystemsEngineerATS from "./pages/industry/EmbeddedSystemsEngineerATS";
import BlockchainEngineerATSScanner from "./pages/industry/BlockchainEngineerATSScanner";
import IOSEngineerSwiftATSOptimizer from "./pages/industry/IOSEngineerSwiftATSOptimizer";
import AndroidEngineerKotlinATS from "./pages/industry/AndroidEngineerKotlinATS";
import GolangBackendEngineerATS from "./pages/industry/GolangBackendEngineerATS";
import RustSystemsEngineerATS from "./pages/industry/RustSystemsEngineerATS";
import PlatformEngineerATSOptimizer from "./pages/industry/PlatformEngineerATSOptimizer";
import SolutionsArchitectATSScanner from "./pages/industry/SolutionsArchitectATSScanner";
import FinanceInternshipATSOptimizer from "./pages/industry/FinanceInternshipATSOptimizer";

// Blog Pages
import HowToBeatATSResumeScanners from "./pages/blog/HowToBeatATSResumeScanners";
import UnderstandingATSRobotView from "./pages/blog/UnderstandingATSRobotView";

// Optimize Pages
import GoogleSDE from "./pages/optimize/GoogleSDE";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/preview-scan" element={<PreviewScan />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/waitlist" element={<AdminWaitlist />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/project/:projectId/settings" element={<ProjectSettings />} />
      
      {/* Industry Pages */}
      <Route path="/industry/software-engineer-resume-scanner" element={<SoftwareEngineerKeywordSniper />} />
      <Route path="/industry/marketing-manager-ats-scanner" element={<MarketingManagerATSScanner />} />
      <Route path="/industry/financial-analyst-ats-optimizer" element={<FinancialAnalystATSOptimizer />} />
      <Route path="/industry/product-manager-ats-optimizer" element={<ProductManagerATSOptimizer />} />
      <Route path="/industry/ux-designer-ats-optimizer" element={<UXDesignerATSOptimizer />} />
      <Route path="/industry/travel-nurse-ats-optimizer" element={<TravelNurseATSOptimizer />} />
      <Route path="/industry/icu-nurse-ats-optimizer" element={<ICUNurseATSOptimizer />} />
      <Route path="/industry/er-nurse-ats-optimizer" element={<ERNurseATSOptimizer />} />
      <Route path="/industry/med-surg-nurse-ats-optimizer" element={<MedSurgNurseATSOptimizer />} />
      <Route path="/industry/pediatric-nurse-ats-optimizer" element={<PediatricNurseATSOptimizer />} />
      <Route path="/industry/nurse-practitioner-ats-optimizer" element={<NursePractitionerATSOptimizer />} />
      <Route path="/industry/case-manager-nurse-ats-optimizer" element={<CaseManagerNurseATSOptimizer />} />
      <Route path="/industry/home-health-nurse-ats-optimizer" element={<HomeHealthNurseATSOptimizer />} />
      <Route path="/industry/school-nurse-ats-resume-scanner" element={<SchoolNurseATSResumeScanner />} />
      <Route path="/industry/psychiatric-nurse-resume-scanner" element={<PsychiatricNurseResumeScanner />} />
      <Route path="/industry/dialysis-nurse-ats-scanner" element={<DialysisNurseATSScanner />} />
      <Route path="/industry/wound-care-nurse-ats-optimizer" element={<WoundCareNurseATSOptimizer />} />
      <Route path="/industry/rehab-nurse-ats-optimizer" element={<RehabNurseATSOptimizer />} />
      <Route path="/industry/transplant-nurse-ats-optimizer" element={<TransplantNurseATSOptimizer />} />
      <Route path="/industry/neurology-nurse-ats-optimizer" element={<NeurologyNurseATSOptimizer />} />
      <Route path="/industry/cardiology-nurse-ats-scanner" element={<CardiologyNurseATSScanner />} />
      <Route path="/industry/endoscopy-nurse-ats-scanner" element={<EndoscopyNurseATSScanner />} />
      <Route path="/industry/radiology-nurse-ats-scanner" element={<RadiologyNurseATSScanner />} />
      <Route path="/industry/infection-control-nurse-ats" element={<InfectionControlNurseATS />} />
      <Route path="/industry/pain-management-nurse-ats" element={<PainManagementNurseATS />} />
      <Route path="/industry/ambulatory-care-nurse-ats" element={<AmbulatoryCareNurseATS />} />
      <Route path="/industry/ccu-cvu-nurse-ats-optimizer" element={<CCUCVUNurseATSOptimizer />} />
      <Route path="/industry/ats-scanner-nurses" element={<ATSScannerNurses />} />
      <Route path="/industry/resume-debug-data-analysts" element={<ResumeDebugDataAnalysts />} />
      <Route path="/industry/security-engineer-ats-optimizer" element={<SecurityEngineerATSOptimizer />} />
      <Route path="/industry/full-stack-engineer-ats-optimizer" element={<FullStackEngineerATSOptimizer />} />
      <Route path="/industry/devops-engineer-kubernetes-ats" element={<DevOpsEngineerKubernetesATS />} />
      <Route path="/industry/backend-engineer-java-ats" element={<BackendEngineerJavaATS />} />
      <Route path="/industry/senior-frontend-engineer-ats" element={<SeniorFrontendEngineerATS />} />
      <Route path="/industry/machine-learning-engineer-ats" element={<MachineLearningEngineerATS />} />
      <Route path="/industry/site-reliability-engineer-ats" element={<SiteReliabilityEngineerATS />} />
      <Route path="/industry/mobile-engineer-react-native-ats" element={<MobileEngineerReactNativeATS />} />
      <Route path="/industry/qa-engineer-automation-ats" element={<QAEngineerAutomationATS />} />
      <Route path="/industry/cloud-architect-aws-ats-scanner" element={<CloudArchitectAWSATSScanner />} />
      <Route path="/industry/embedded-systems-engineer-ats" element={<EmbeddedSystemsEngineerATS />} />
      <Route path="/industry/blockchain-engineer-ats-scanner" element={<BlockchainEngineerATSScanner />} />
      <Route path="/industry/ios-engineer-swift-ats-optimizer" element={<IOSEngineerSwiftATSOptimizer />} />
      <Route path="/industry/android-engineer-kotlin-ats" element={<AndroidEngineerKotlinATS />} />
      <Route path="/industry/golang-backend-engineer-ats" element={<GolangBackendEngineerATS />} />
      <Route path="/industry/rust-systems-engineer-ats" element={<RustSystemsEngineerATS />} />
      <Route path="/industry/platform-engineer-ats-optimizer" element={<PlatformEngineerATSOptimizer />} />
      <Route path="/industry/solutions-architect-ats-scanner" element={<SolutionsArchitectATSScanner />} />
      <Route path="/industry/finance-internship-ats-optimizer" element={<FinanceInternshipATSOptimizer />} />

      {/* Blog Posts */}
      <Route path="/blog/how-to-beat-ats-resume-scanners" element={<HowToBeatATSResumeScanners />} />
      <Route path="/blog/understanding-ats-robot-view" element={<UnderstandingATSRobotView />} />

      {/* Optimize Pages */}
      <Route path="/optimize/google-sde" element={<GoogleSDE />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <I18nProvider>
              <BrowserRouter>
                <App />
                <Toaster />
              </BrowserRouter>
            </I18nProvider>
          </ThemeProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
);