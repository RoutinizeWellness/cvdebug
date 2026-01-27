import { useNavigate } from "react-router";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { useEffect } from "react";

export default function Onboarding() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Get Started | CVDebug";
  }, []);

  const handleComplete = () => {
    // Navigate to dashboard or scan results after onboarding
    navigate("/dashboard");
  };

  return <OnboardingLayout onComplete={handleComplete} />;
}