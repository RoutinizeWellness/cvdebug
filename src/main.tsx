import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import Onboarding from "@/pages/Onboarding.tsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
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
import "./types/global.d.ts";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
const convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud");
const CLERK_PUBLISHABLE_KEY = "pk_test_aG9wZWZ1bC1kb2UtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <BrowserRouter>
            <RouteSyncer />
            <Routes>
              {/* Level 1: Public Funnel */}
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<PricingPage />} />
              
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