import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function TravelNurseATSOptimizer() {
  const template = getNicheTemplate("travel-nurse-ats-optimizer");

  if (!template) {
    return <div>Template not found</div>;
  }

  return <NicheLandingPage template={template} />;
}
