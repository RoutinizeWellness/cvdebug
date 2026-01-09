import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function AmbulatoryCareNurseATS() {
  const template = getNicheTemplate("ambulatory-care-nurse-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
