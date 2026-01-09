import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function SecurityEngineerATSOptimizer() {
  const template = getNicheTemplate("security-engineer-ats-optimizer");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
