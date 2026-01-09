import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function CaseManagerNurseATSOptimizer() {
  const template = getNicheTemplate("case-manager-nurse-ats-optimizer");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
