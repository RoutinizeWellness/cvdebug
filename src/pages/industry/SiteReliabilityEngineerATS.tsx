import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function SiteReliabilityEngineerATS() {
  const template = getNicheTemplate("site-reliability-engineer-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
