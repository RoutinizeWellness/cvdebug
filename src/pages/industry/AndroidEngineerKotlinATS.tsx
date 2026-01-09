import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function AndroidEngineerKotlinATS() {
  const template = getNicheTemplate("android-engineer-kotlin-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
