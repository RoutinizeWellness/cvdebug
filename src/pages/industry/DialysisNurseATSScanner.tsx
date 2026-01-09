import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function DialysisNurseATSScanner() {
  const template = getNicheTemplate("dialysis-nurse-ats-scanner");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
