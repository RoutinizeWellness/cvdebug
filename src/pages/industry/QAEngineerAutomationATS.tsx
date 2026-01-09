import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function QAEngineerAutomationATS() {
  const template = getNicheTemplate("qa-engineer-automation-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
