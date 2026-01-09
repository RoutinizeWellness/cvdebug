import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function FullStackEngineerATSOptimizer() {
  const template = getNicheTemplate("full-stack-engineer-ats-optimizer");

  if (!template) {
    return <div>Template not found</div>;
  }

  return <NicheLandingPage template={template} />;
}
