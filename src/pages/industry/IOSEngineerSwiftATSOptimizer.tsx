import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function IOSEngineerSwiftATSOptimizer() {
  const template = getNicheTemplate("ios-engineer-swift-ats-optimizer");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
