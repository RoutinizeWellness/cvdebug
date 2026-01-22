// Main entry v4 - Added lazy loading for route optimization
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@/contexts/I18nContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./index.css";

// Core pages - loaded immediately
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

// Lazy load secondary pages
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PreviewScan = lazy(() => import("./pages/PreviewScan"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminWaitlist = lazy(() => import("./pages/AdminWaitlist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ProjectSettings = lazy(() => import("./pages/ProjectSettings"));

// Lazy load industry pages
const SoftwareEngineerKeywordSniper = lazy(() => import("./pages/industry/SoftwareEngineerKeywordSniper"));
const MarketingManagerATSScanner = lazy(() => import("./pages/industry/MarketingManagerATSScanner"));
const FinancialAnalystATSOptimizer = lazy(() => import("./pages/industry/FinancialAnalystATSOptimizer"));
const ProductManagerATSOptimizer = lazy(() => import("./pages/industry/ProductManagerATSOptimizer"));
const UXDesignerATSOptimizer = lazy(() => import("./pages/industry/UXDesignerATSOptimizer"));
const TravelNurseATSOptimizer = lazy(() => import("./pages/industry/TravelNurseATSOptimizer"));
const ICUNurseATSOptimizer = lazy(() => import("./pages/industry/ICUNurseATSOptimizer"));
const ERNurseATSOptimizer = lazy(() => import("./pages/industry/ERNurseATSOptimizer"));
const MedSurgNurseATSOptimizer = lazy(() => import("./pages/industry/MedSurgNurseATSOptimizer"));
const PediatricNurseATSOptimizer = lazy(() => import("./pages/industry/PediatricNurseATSOptimizer"));
const NursePractitionerATSOptimizer = lazy(() => import("./pages/industry/NursePractitionerATSOptimizer"));
const CaseManagerNurseATSOptimizer = lazy(() => import("./pages/industry/CaseManagerNurseATSOptimizer"));
const HomeHealthNurseATSOptimizer = lazy(() => import("./pages/industry/HomeHealthNurseATSOptimizer"));
const SchoolNurseATSResumeScanner = lazy(() => import("./pages/industry/SchoolNurseATSResumeScanner"));
const PsychiatricNurseResumeScanner = lazy(() => import("./pages/industry/PsychiatricNurseResumeScanner"));
const DialysisNurseATSScanner = lazy(() => import("./pages/industry/DialysisNurseATSScanner"));
const WoundCareNurseATSOptimizer = lazy(() => import("./pages/industry/WoundCareNurseATSOptimizer"));
const RehabNurseATSOptimizer = lazy(() => import("./pages/industry/RehabNurseATSOptimizer"));
const TransplantNurseATSOptimizer = lazy(() => import("./pages/industry/TransplantNurseATSOptimizer"));
const NeurologyNurseATSOptimizer = lazy(() => import("./pages/industry/NeurologyNurseATSOptimizer"));
const CardiologyNurseATSScanner = lazy(() => import("./pages/industry/CardiologyNurseATSScanner"));
const EndoscopyNurseATSScanner = lazy(() => import("./pages/industry/EndoscopyNurseATSScanner"));
const RadiologyNurseATSScanner = lazy(() => import("./pages/industry/RadiologyNurseATSScanner"));
const InfectionControlNurseATS = lazy(() => import("./pages/industry/InfectionControlNurseATS"));
const PainManagementNurseATS = lazy(() => import("./pages/industry/PainManagementNurseATS"));
const AmbulatoryCareNurseATS = lazy(() => import("./pages/industry/AmbulatoryCareNurseATS"));
const CCUCVUNurseATSOptimizer = lazy(() => import("./pages/industry/CCUCVUNurseATSOptimizer"));
const ATSScannerNurses = lazy(() => import("./pages/industry/ATSScannerNurses"));
const ResumeDebugDataAnalysts = lazy(() => import("./pages/industry/ResumeDebugDataAnalysts"));
const SecurityEngineerATSOptimizer = lazy(() => import("./pages/industry/SecurityEngineerATSOptimizer"));
const FullStackEngineerATSOptimizer = lazy(() => import("./pages/industry/FullStackEngineerATSOptimizer"));
const DevOpsEngineerKubernetesATS = lazy(() => import("./pages/industry/DevOpsEngineerKubernetesATS"));
const BackendEngineerJavaATS = lazy(() => import("./pages/industry/BackendEngineerJavaATS"));
const SeniorFrontendEngineerATS = lazy(() => import("./pages/industry/SeniorFrontendEngineerATS"));
const MachineLearningEngineerATS = lazy(() => import("./pages/industry/MachineLearningEngineerATS"));
const SiteReliabilityEngineerATS = lazy(() => import("./pages/industry/SiteReliabilityEngineerATS"));
const MobileEngineerReactNativeATS = lazy(() => import("./pages/industry/MobileEngineerReactNativeATS"));
const QAEngineerAutomationATS = lazy(() => import("./pages/industry/QAEngineerAutomationATS"));
const CloudArchitectAWSATSScanner = lazy(() => import("./pages/industry/CloudArchitectAWSATSScanner"));
const EmbeddedSystemsEngineerATS = lazy(() => import("./pages/industry/EmbeddedSystemsEngineerATS"));
const BlockchainEngineerATSScanner = lazy(() => import("./pages/industry/BlockchainEngineerATSScanner"));
const IOSEngineerSwiftATSOptimizer = lazy(() => import("./pages/industry/IOSEngineerSwiftATSOptimizer"));
const AndroidEngineerKotlinATS = lazy(() => import("./pages/industry/AndroidEngineerKotlinATS"));
const GolangBackendEngineerATS = lazy(() => import("./pages/industry/GolangBackendEngineerATS"));
const RustSystemsEngineerATS = lazy(() => import("./pages/industry/RustSystemsEngineerATS"));
const PlatformEngineerATSOptimizer = lazy(() => import("./pages/industry/PlatformEngineerATSOptimizer"));
const SolutionsArchitectATSScanner = lazy(() => import("./pages/industry/SolutionsArchitectATSScanner"));
const FinanceInternshipATSOptimizer = lazy(() => import("./pages/industry/FinanceInternshipATSOptimizer"));

// Lazy load blog pages
const HowToBeatATSResumeScanners = lazy(() => import("./pages/blog/HowToBeatATSResumeScanners"));
const UnderstandingATSRobotView = lazy(() => import("./pages/blog/UnderstandingATSRobotView"));

// Lazy load optimize pages
const GoogleSDE = lazy(() => import("./pages/optimize/GoogleSDE"));

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/preview" element={<PreviewScan />} />
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
    </Suspense>
  );
}

const RootApp = () => (
  <ErrorBoundary>
    <HelmetProvider>
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
    </HelmetProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(
  import.meta.env.DEV ? <RootApp /> : <StrictMode><RootApp /></StrictMode>
);