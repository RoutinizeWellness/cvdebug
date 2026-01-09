import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function SolutionsArchitectATSScanner() {
  const template = getNicheTemplate("solutions-architect-ats-scanner");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
