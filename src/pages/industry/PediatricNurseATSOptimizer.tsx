import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function PediatricNurseATSOptimizer() {
  const template = getNicheTemplate("pediatric-nurse-ats-optimizer");

  if (!template) {
    return <div>Template not found</div>;
  }

  return <NicheLandingPage template={template} />;
}
