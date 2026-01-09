import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function BackendEngineerJavaATS() {
  const template = getNicheTemplate("backend-engineer-java-ats");

  if (!template) {
    return <div>Template not found</div>;
  }

  return <NicheLandingPage template={template} />;
}
