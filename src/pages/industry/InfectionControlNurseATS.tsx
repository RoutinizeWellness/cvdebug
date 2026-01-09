import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function InfectionControlNurseATS() {
  const template = getNicheTemplate("infection-control-nurse-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
