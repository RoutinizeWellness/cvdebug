import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function GolangBackendEngineerATS() {
  const template = getNicheTemplate("golang-backend-engineer-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
