import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function MobileEngineerReactNativeATS() {
  const template = getNicheTemplate("mobile-engineer-react-native-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
